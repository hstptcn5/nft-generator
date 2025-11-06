export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">FOMO NFT Generator</h1>
        <p className="text-gray-400 mb-8">Dev server is working! 🎉</p>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Test Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/admin" className="text-blue-400 hover:underline">
                /admin - Admin Panel
              </a>
            </li>
            <li>
              <a 
                href="/api/test/generate?tokenId=1&phase=2&profileIndex=0" 
                className="text-blue-400 hover:underline"
                target="_blank"
              >
                /api/test/generate - Test API (Preview Prompt)
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Test API Endpoints</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Preview Prompt (GET - Free):</p>
              <code className="block bg-gray-900 p-2 rounded text-sm">
                GET /api/test/generate?tokenId=1&phase=2&profileIndex=0
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Generate Image (POST - Costs ~$0.002):</p>
              <code className="block bg-gray-900 p-2 rounded text-sm">
                POST /api/test/generate<br/>
                Body: {"{"}"tokenId": 1, "phase": 2, "profileIndex": 0{"}"}
              </code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

