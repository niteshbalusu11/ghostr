'use client';

import Patches from '@/components/Patches';
import Repository from '@/components/Repository';
import { parsePatch, parseRepo, Patch, Repo } from '@/nostr/nip43';
import {
  repoCache,
  pool,
  repositoryRelays,
  getWriteRelays,
  patchCache,
} from '@/nostr/nostr';
import { nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';

export default function Repo({ params }: { params: { naddr: string } }) {
  const [repository, setRepository] = useState<Repo>();
  const repoId = params.naddr;

  useEffect(() => {
    let repo: Repo | undefined;
    const getData = async () => {
      let { data, type } = nip19.decode(repoId);

      switch (type) {
        case 'naddr': {
          let { relays, identifier, pubkey, kind } =
            data as nip19.AddressPointer;

          console.info(
            'relays, identifier, pubkey, kind',
            relays,
            identifier,
            pubkey,
            kind
          );
          if (kind !== 30617) {
            console.error('Invalid kind for repo', kind);
            return;
          }
          repo = repoCache.get(pubkey + '/' + identifier);

          if (repo) {
            setRepository(repo);
            return;
          }

          let sc = pool.subscribeMany(
            [
              ...(relays || []),
              ...(await getWriteRelays(pubkey)),
              ...repositoryRelays,
            ],
            [
              {
                kinds: [30617],
                authors: [pubkey],
                '#d': [identifier],
              },
            ],
            {
              onevent(evt) {
                if (!repo || evt.created_at > repo.event.created_at) {
                  setRepository(parseRepo(evt));
                  if (repo) {
                    repoCache.set(repo.guid, repo);
                  }
                }
              },
              oneose() {},
            }
          );
          break;
        }
        default:
          break;
      }
    };

    getData();
  }, [repoId]);

  const [eoseHappened, setEoseHappened] = useState(false);
  const [patches, setPatches] = useState<Patch[]>([]);

  useEffect(() => {
    const loadPatches = async () => {
      if (!repository) return;

      pool.subscribeMany(
        repository.relays,
        [
          {
            kinds: [1617],
            '#a': [`30617:${repository.event.pubkey}:${repository.id}`],
          },
        ],
        {
          onevent(evt) {
            const parsedPatch = parsePatch(evt);
            if (parsedPatch) {
              setPatches((currentPatches) => {
                const newPatches = eoseHappened
                  ? [parsedPatch, ...currentPatches]
                  : [...currentPatches, parsedPatch];
                return newPatches;
              });
              patchCache.set(evt.id, parsedPatch);
            }
          },

          oneose() {
            setEoseHappened(true);
            setPatches((currentPatches) => {
              return currentPatches
                .map((patch) => {
                  patch.sourceRelays = Array.from(
                    pool.seenOn.get(patch.event.id)?.values?.() || []
                  ).map((r) => r.url);
                  return patch;
                })
                .sort((a, b) => b.event.created_at - a.event.created_at);
            });
          },
          onclose(reason) {
            console.warn('subscription closed', reason);
          },
        }
      );
    };

    loadPatches();
  }, [eoseHappened, repository]);

  return (
    <div>
      {repository && <Repository repo={repository} />}
      {patches && patches.length !== 0 && <Patches patches={patches} />}
    </div>
  );
}
