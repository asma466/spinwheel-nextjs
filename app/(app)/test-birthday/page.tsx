'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function TestBirthdayPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [spinLink, setSpinLink] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateBirthday = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/birthday', {
        name,
        email,
      });

      const id = response.data.recordId;
      setRecordId(id);
      const link = `${window.location.origin}/birthday-spin?x=${id}`;
      setSpinLink(link);
      setMessage(
        `✅ Birthday record created successfully! Record ID: ${id}`
      );
      setName('');
      setEmail('');
    } catch (error: any) {
      setMessage(
        `❌ Error: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto">
        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2 text-center text-indigo-600">
            🎂 Birthday Spin Test
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Create a birthday record and get the spin link
          </p>

          <form onSubmit={handleCreateBirthday} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Creating...' : 'Create Birthday Record'}
            </Button>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-sm font-medium ${
                message.includes('✅')
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {spinLink && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Spin Link:
              </p>
              <div className="bg-white p-3 rounded border border-gray-300 break-all">
                <a
                  href={spinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-xs"
                >
                  {spinLink}
                </a>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(spinLink);
                  setMessage('📋 Link copied to clipboard!');
                }}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition"
              >
                Copy Link
              </button>
            </div>
          )}
        </Card>

        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">How to Test:</h2>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. Fill in the name and email above</li>
            <li>2. Click "Create Birthday Record"</li>
            <li>3. Copy the generated spin link</li>
            <li>4. Open the link in a new tab</li>
            <li>5. Click the wheel to spin and win a prize!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
