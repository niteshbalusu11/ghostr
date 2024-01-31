import { AbstractSimplePool } from 'nostr-tools/abstract-pool';
import { Patch, Repo } from './nip43';
import { verifyEvent } from 'nostr-tools';
import { type Event } from 'nostr-tools';

export type Metadata = {
  pubkey: string;
  name?: string;
  display_name?: string;
  nip05?: string;
  nip05valid: boolean;
  picture?: string;
};

export const profileRelays = [
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://purplepag.es',
];

export const relayListRelays = [
  'wss://purplepag.es',
  'wss://nos.lol',
  'wss://nostr-pub.wellorder.net',
  'wss://relay.damus.io',
];

export const repositoryRelays = [
  'wss://relay.nostr.bg',
  'wss://nostr21.com',
  'wss://nostr.fmt.wiz.biz',
  'wss://nostr-pub.wellorder.net',
  'wss://relay.damus.io',
];

export const repoCache = new Map<string, Repo>();
export const patchCache = new Map<string, Patch>();
const _metadataCache = new Map<string, Promise<Metadata>>();

export const pool = new AbstractSimplePool({ verifyEvent });
pool.trackRelays = true;

const _relaysCache = new Map<
  string,
  Promise<{
    read: string[];
    write: string[];
  }>
>();

export async function getWriteRelays(
  pubkey: string | undefined
): Promise<string[]> {
  if (!pubkey) return [];
  return getRelays(pubkey).then(({ write }) => write);
}

export async function getReadRelays(
  pubkey: string | undefined
): Promise<string[]> {
  if (!pubkey) return [];
  return getRelays(pubkey).then(({ read }) => read);
}

export async function getRelays(
  pubkey: string
): Promise<{ read: string[]; write: string[] }> {
  const cached = _relaysCache.get(pubkey);
  if (cached) return cached;

  const fetch = pool
    .get(relayListRelays, {
      kinds: [10002],
      authors: [pubkey],
    })
    .catch(() => null)
    .then((event: Event | null) => {
      if (!event) return { read: [], write: [] };
      const read = [];
      const write = [];
      for (let i = 0; i < event.tags.length; i++) {
        const tag = event.tags[i];
        if (tag[0] === 'r') {
          switch (tag[2]) {
            case 'write':
              write.push(tag[1]);
              break;
            case 'read':
              read.push(tag[1]);
              break;
            case undefined:
              read.push(tag[1]);
              write.push(tag[1]);
              break;
          }
        }
      }
      return { read, write };
    });
  _relaysCache.set(pubkey, fetch);
  return fetch;
}

export async function getMetadata(pubkey: string): Promise<Metadata> {
  const cached = _metadataCache.get(pubkey);
  if (cached) return cached;

  const fetch = pool
    .get(profileRelays, { kinds: [0], authors: [pubkey] })
    .catch(() => console.error('failed to fetch metadata'))
    .then((event) => {
      if (event) {
        return {
          pubkey,
          nip05valid: false,
          groups: [],
          writeRelays: [],
          ...JSON.parse(event!.content),
        };
      }
      return { pubkey, nip05valid: false };
    });

  _metadataCache.set(pubkey, fetch);
  return fetch;
}
