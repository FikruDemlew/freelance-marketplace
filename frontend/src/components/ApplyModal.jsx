import { useState, useEffect } from 'react';
import { applyForJob, updateApplication } from '../services/applicationService';

export default function ApplyModal({ jobId, jobTitle, existingApplication, onClose, onSuccess }) {
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill form if editing an existing application
  useEffect(() => {
    if (existingApplication) {
      setProposal(existingApplication.proposal || '');
      setBidAmount(existingApplication.bid_amount || '');
    }
  }, [existingApplication]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (existingApplication) {
        await updateApplication(existingApplication.id, proposal, bidAmount);
      } else {
        await applyForJob(jobId, proposal, bidAmount);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const serverMessage =
        err.response?.data?.detail ||
        err.response?.data?.proposal?.[0] ||
        err.response?.data?.bid_amount?.[0] ||
        'Failed to save application.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {existingApplication ? 'Edit Application for:' : 'Apply for:'}{' '}
          <span className="text-blue-600">{jobTitle}</span>
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
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
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposal / Cover Letter
            </label>
            <textarea
              required
              rows={4}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading
                ? 'Saving...'
                : existingApplication
                ? 'Update Application'
                : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}