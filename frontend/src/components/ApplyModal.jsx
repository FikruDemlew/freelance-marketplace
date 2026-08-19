import { useState } from 'react';
import { applyForJob } from '../services/applicationService';

export default function ApplyModal({ jobId, jobTitle, onClose, onSuccess }) {
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await applyForJob(jobId, proposal, bidAmount);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.proposal?.[0] ||
          err.response?.data?.bid_amount?.[0] ||
          'Failed to submit application.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">Apply for: {jobTitle}</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Bid Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 500.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposal / Cover Message
            </label>
            <textarea
              required
              rows={4}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Explain why you are a great fit for this job..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}