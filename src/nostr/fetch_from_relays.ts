import { Repo, Patch, parseRepo, parsePatch } from './nip43';
import { repositoryRelays, repoCache, patchCache, pool } from './nostr';

export const fetchFromRelays = async () => {
  let repos: Repo[] = [];
  let patches: Patch[] = [];
  let eoseHappened = false;

  repos = Array.from(repoCache.values());

  pool.subscribeMany(
    repositoryRelays,
    [
      {
        kinds: [30617, 1617],
        limit: 200,
      },
    ],
    {
      onevent(evt) {
        switch (evt.kind) {
          case 30617:
            const repo = parseRepo(evt);
            const idx = repos.findIndex(
              (r) => r.id === repo.id && r.event.pubkey === repo.event.pubkey
            );

            if (idx === -1) {
              repos.push(repo);
            } else if (repo.event.created_at > repos[idx].event.created_at) {
              repos[idx] = repo;
            } else return;

            repoCache.set(repo.guid, repo);
            if (eoseHappened) {
              repos = repos;
            }

            break;
          case 1617:
            const patch = parsePatch(evt);
            if (patch) {
              if (eoseHappened) {
                patches = [patch, ...patches];
              } else {
                patches.push(patch);
              }
              patchCache.set(evt.id, patch);
            }
            break;
        }
      },
      oneose() {
        eoseHappened = true;
        repos = repos;

        patches = patches.map((patch) => {
          patch.sourceRelays = Array.from(
            pool.seenOn.get(patch.event.id)?.values?.() || []
          ).map((r) => r.url);
          return patch;
        });
      },
    }
  );
};
