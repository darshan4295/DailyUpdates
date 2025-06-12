import React, { useState } from 'react';
import { FileText, Download, Loader2, BarChart3 } from 'lucide-react';
import { DailyUpdate } from '../types';
import { generateSummary } from '../services/llmService';
import { format } from 'date-fns';

interface ReportGeneratorProps {
  updates: DailyUpdate[];
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ updates }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (updates.length === 0) return;
    
    setLoading(true);
    try {
      const generatedSummary = await generateSummary(updates);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error generating summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    const reportContent = `
Daily Updates Report
Generated on: ${format(new Date(), 'PPP')}

SUMMARY:
${summary}

DETAILED UPDATES:
${updates.map(update => `
Date: ${format(new Date(update.date), 'PPP')}
Employee: ${update.user_name}
Team: ${update.team}

Accomplishments:
${update.accomplishments}

Carry Forward:
${update.carry_forward}

Today's Plans:
${update.today_plans}

---
`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-updates-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = {
    totalUpdates: updates.length,
    teams: [...new Set(updates.map(u => u.team))].length,
    employees: [...new Set(updates.map(u => u.user_name))].length,
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Analytics & Reports</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalUpdates}</div>
          <div className="text-sm text-blue-800">Total Updates</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.teams}</div>
          <div className="text-sm text-purple-800">Active Teams</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.employees}</div>
          <div className="text-sm text-emerald-800">Contributors</div>
        </div>
      </div>

      <div className="space-y-4">
        {updates.length > 0 && (
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating AI Summary...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Generate AI Summary</span>
              </>
            )}
          </button>
        )}

        {summary && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">AI-Generated Summary</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">{summary}</p>
          </div>
        )}

        {(summary || updates.length > 0) && (
          <button
            onClick={handleExportReport}
            className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        )}
      </div>
    </div>
  );
};