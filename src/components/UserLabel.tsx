import { getMetadata } from '@/nostr/nostr';
import { nip19 } from 'nostr-tools';
import React, { useState, useEffect } from 'react';

export default function UserLabel({ pubkey }: { pubkey: string }) {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');

  useEffect(() => {
    const fetchMetaData = async () => {
      if (pubkey === '') {
        return;
      }

      const npub = nip19.npubEncode(pubkey);
      const metadata = await getMetadata(pubkey);

      const newName =
        metadata?.name && metadata.name.trim() !== ''
          ? metadata.name
          : npub.slice(0, 11);
      setName(newName);

      if (metadata?.picture) {
        setPicture(metadata.picture);
      }
    };

    fetchMetaData();
  }, [pubkey]);

  return (
    <div className="flex items-center">
      {picture && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={picture}
          alt={name}
          className="w-8 h-8 rounded-full mr-2 mb-2 mt-2"
        />
      )}
      <span>{name}</span>
    </div>
  );
}
