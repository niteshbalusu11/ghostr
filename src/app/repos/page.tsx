"use client";

import { fetchFromRelays } from "@/nostr/fetch_from_relays";
import { Repo } from "@/nostr/nip43";
import { repoCache } from "@/nostr/nostr";
import { useEffect, useState } from "react";

export default function Repos() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    fetchFromRelays().then(() => {
      // Update the repos state when fetchFromRelays is complete
      setRepos(Array.from(repoCache.values()));
    });
  }, [repos]);

  return (
    <>
      <h2 className="mb-6 text-xl sm:text-2xl font-bold text-center text-gray-300">
        Repos
      </h2>{" "}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Repos
      </button>
      <div>
        {repos.map((n) => (
          <div key={n.guid}>{n.name}</div>
        ))}
      </div>
    </>
  );
}
