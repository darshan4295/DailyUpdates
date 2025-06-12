import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface DailyUpdateFormProps {
  profile: UserProfile;
  onSubmit: (update: {
    date: string;
    accomplishments: string;
    carry_forward: string;
    today_plans: string;
  }) => Promise<{ success: boolean; error: string | null }>;
}

export const DailyUpdateForm: React.FC<DailyUpdateFormProps> = ({ profile, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    accomplishments: '',
    carry_forward: '',
    today_plans: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            date: new Date().toISOString().split('T')[0],
            accomplishments: '',
            carry_forward: '',
            today_plans: '',
          });
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit update');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">Update Submitted!</h3>
          <p className="mt-2 text-gray-600">Your daily update has been recorded successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Daily Update</h2>
          <p className="text-sm text-gray-600">{profile.team}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What were your accomplishments yesterday? (Tasks)
          </label>
          <textarea
            value={formData.accomplishments}
            onChange={(e) => setFormData({ ...formData, accomplishments: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Describe your completed tasks and achievements..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Did you achieve all planned tasks? If not, what's being carried forward and why?
          </label>
          <textarea
            value={formData.carry_forward}
            onChange={(e) => setFormData({ ...formData, carry_forward: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Mention any incomplete tasks and reasons..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you plan to work on today? (Tasks)
          </label>
          <textarea
            value={formData.today_plans}
            onChange={(e) => setFormData({ ...formData, today_plans: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Outline your plans and priorities for today..."
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Submit Daily Update'
          )}
        </button>
      </form>
    </div>
  );
};