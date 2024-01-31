import { Patch } from '@/nostr/nip43';
import UserLabel from './UserLabel';

export default function Patches({ patches }: { patches: Patch[] }) {
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Patches</h2>
      <div className="grid grid-cols-1 gap-4">
        {patches.map((patch, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg shadow">
            <p>
              <strong>Date:</strong>{' '}
              {new Date(patch.event.created_at).toLocaleDateString()}
            </p>
            <div>
              <strong>Owner:</strong>
              <UserLabel pubkey={patch.repo?.owner || ''} />
            </div>
            <p>
              <strong>GUID:</strong> {patch.repo?.guid}
            </p>
            <p>{patch.preamble.match(/Subject: (.*)/)?.[1] || '<empty>'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
