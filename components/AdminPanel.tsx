'use client';

import { useState } from 'react';
import { BLIND_BOX_IMAGE_URL } from '@/lib/constants';
import { generateTraits } from '@/lib/services/traitGeneration';
import { testProfiles } from '@/lib/test/imageGenerationTest';

export default function AdminPanel() {
  const [tokenId, setTokenId] = useState<number>(1);
  const [phase, setPhase] = useState<number>(2);
  const [profileIndex, setProfileIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          phase,
          profileIndex,
          ownerAddress: '0x1234567890123456789012345678901234567890',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Test generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPrompt = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/test/generate?tokenId=${tokenId}&phase=${phase}&profileIndex=${profileIndex}`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate prompt');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to preview prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleManualReveal = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          phase,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Reveal failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Manual reveal failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Admin Test Panel</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Token ID</label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(parseInt(e.target.value, 10))}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phase (1-7)</label>
          <input
            type="number"
            value={phase}
            onChange={(e) => setPhase(parseInt(e.target.value, 10))}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700"
            min="1"
            max="7"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Test Profile</label>
          <select
            value={profileIndex}
            onChange={(e) => setProfileIndex(parseInt(e.target.value, 10))}
            className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700"
          >
            {testProfiles.map((profile, index) => (
              <option key={index} value={index}>
                {profile.username} ({profile.followerCount} followers, {profile.casts} casts)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePreviewPrompt}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Preview Prompt
        </button>
        <button
          onClick={handleTestGenerate}
          disabled={loading}
          className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Generate Image
        </button>
        <button
          onClick={handleManualReveal}
          disabled={loading}
          className="px-6 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Manual Reveal (Admin)
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded">
          <p className="text-red-200">Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded">
            <h3 className="text-xl font-semibold mb-2">Generated Traits</h3>
            <pre className="text-xs bg-gray-900 p-3 rounded overflow-auto">
              {JSON.stringify(result.traits, null, 2)}
            </pre>
          </div>

          {result.prompt && (
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="text-xl font-semibold mb-2">AI Prompt</h3>
              <p className="text-sm text-gray-300 bg-gray-900 p-3 rounded">
                {result.prompt}
              </p>
            </div>
          )}

          {result.imageUrl && (
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="text-xl font-semibold mb-2">Generated Image</h3>
              <img
                src={result.imageUrl}
                alt="Generated NFT"
                className="w-full max-w-md rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = BLIND_BOX_IMAGE_URL;
                }}
              />
              <p className="text-xs text-gray-400 mt-2 break-all">{result.imageUrl}</p>
            </div>
          )}

          {result.metadata && (
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="text-xl font-semibold mb-2">Metadata</h3>
              <div className="mb-2">
                <h4 className="font-medium">Revealed Traits:</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {result.metadata.attributes?.map((attr: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-900 p-2 rounded border border-gray-700"
                    >
                      <p className="text-xs text-gray-400">{attr.trait_type}</p>
                      <p className="text-sm font-medium">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <pre className="text-xs bg-gray-900 p-3 rounded overflow-auto">
                {JSON.stringify(result.metadata, null, 2)}
              </pre>
            </div>
          )}

          {result.transactionHash && (
            <div className="p-4 bg-green-900/20 border border-green-700 rounded">
              <p className="text-green-200">
                Transaction Hash: {result.transactionHash}
              </p>
              <a
                href={`https://basescan.org/tx/${result.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm"
              >
                View on Basescan
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

