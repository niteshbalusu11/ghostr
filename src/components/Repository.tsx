import { Patch, Repo, parsePatch } from '@/nostr/nip43';
import { patchCache, pool } from '@/nostr/nostr';
import { copyToClipboard } from '@/utils/utils';
import { useEffect, useState } from 'react';
import Patches from './Patches';

export default function Repository({ repo }: { repo: Repo }) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Repository: {repo.name}</h1>
      <p className="text-lg mb-4">{repo.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <p
            className="break-all cursor-pointer mb-2"
            onClick={() => copyToClipboard(repo.guid)}
          >
            <strong>GUID:</strong> {repo.guid}
          </p>
          <p
            className="break-all cursor-pointer mb-2"
            onClick={() => copyToClipboard(repo.naddr)}
          >
            <strong>NADDR:</strong> {repo.naddr}
          </p>

          <p>
            <strong>ID:</strong> {repo.id}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Links</h2>
          <div>
            <strong>Web:</strong>
            <ul>
              {repo.web.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            <strong>Clone:</strong>
            <ul>
              {repo.clone.map((url, index) => (
                <li
                  key={index}
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(url)}
                >
                  {url}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Relays</h2>
        <ul>
          {repo.relays.map((relay, index) => (
            <li key={index}>{relay}</li>
          ))}
        </ul>
      </div>

      {repo.sourceRelays && repo.sourceRelays.length !== 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Source Relays</h2>
          <ul>
            {repo.sourceRelays.map((relay, index) => (
              <li key={index}>{relay}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
