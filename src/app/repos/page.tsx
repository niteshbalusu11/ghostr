"use client";

import { Patch, Repo, parsePatch, parseRepo } from "@/nostr/nip43";
import { patchCache, pool, repoCache, repositoryRelays } from "@/nostr/nostr";
import { useEffect, useState } from "react";

export default function Repos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [eoseHappened, setEoseHappened] = useState(false);

  useEffect(() => {
    setRepos(Array.from(repoCache.values()));

    const subscription = pool.subscribeMany(
      repositoryRelays,
      [{ kinds: [30617, 1617], limit: 200 }],
      {
        onevent: (evt) => {
          if (evt.kind === 30617) {
            const repo = parseRepo(evt);
            setRepos((currentRepos) => {
              const idx = currentRepos.findIndex(
                (r) => r.id === repo.id && r.event.pubkey === repo.event.pubkey
              );

              if (idx === -1) {
                return [repo, ...currentRepos];
              } else if (
                repo.event.created_at > currentRepos[idx].event.created_at
              ) {
                const updatedRepos = [...currentRepos];
                updatedRepos[idx] = repo;
                return updatedRepos;
              }
              return currentRepos;
            });

            repoCache.set(repo.guid, repo);
          } else if (evt.kind === 1617) {
            const patch = parsePatch(evt);
            if (patch) {
              setPatches((currentPatches) => {
                if (eoseHappened) {
                  return [patch, ...currentPatches];
                } else {
                  return [...currentPatches, patch];
                }
              });

              patchCache.set(evt.id, patch);
            }
          }
        },
        oneose: () => {
          setEoseHappened(true);

          // Sort repositories
          setRepos((currentRepos) => {
            return [...currentRepos].sort(
              (a, b) => b.event.created_at - a.event.created_at
            );
          });

          // Sort patches and update their sourceRelays
          setPatches((currentPatches) => {
            const sortedPatches = [...currentPatches].sort(
              (a, b) => b.event.created_at - a.event.created_at
            );

            return sortedPatches.map((patch) => {
              const sourceRelays = Array.from(
                pool.seenOn.get(patch.event.id)?.values?.() || []
              ).map((r) => r.url);
              return { ...patch, sourceRelays };
            });
          });
        },
      }
    );

    // Cleanup function to unsubscribe
    return () => {
      subscription.close();
    };
  }, [eoseHappened]);

  return (
    <div className="w-full bg-gray-700 p-4 rounded-lg overflow-hidden">
      <h1 className="text-xl text-white mb-4">Repos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {repos
          .filter((repo) => !!repo.name)
          .map((repo) => (
            <div key={repo.guid} className="bg-gray-600 p-3 rounded shadow">
              <h2 className="text-lg text-white font-bold">{repo.name}</h2>
              <p className="text-gray-300 text-sm">{repo.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
