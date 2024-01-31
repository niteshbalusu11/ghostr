import { AbstractSimplePool } from "nostr-tools/abstract-pool";
import { Patch, Repo } from "./nip43";
import { verifyEvent } from "nostr-tools";

export const profileRelays = [
  "wss://relay.primal.net",
  "wss://relay.nostr.band",
  "wss://purplepag.es",
];

export const relayListRelays = [
  "wss://purplepag.es",
  "wss://nos.lol",
  "wss://nostr-pub.wellorder.net",
  "wss://relay.damus.io",
];

export const repositoryRelays = [
  "wss://relay.nostr.bg",
  "wss://nostr21.com",
  "wss://nostr.fmt.wiz.biz",
  "wss://nostr-pub.wellorder.net",
  "wss://relay.damus.io",
];

export const repoCache = new Map<string, Repo>();
export const patchCache = new Map<string, Patch>();

export const pool = new AbstractSimplePool({ verifyEvent });
pool.trackRelays = true;
