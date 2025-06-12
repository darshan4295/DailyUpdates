import React from 'react';
import { Filter, Calendar, Users, User } from 'lucide-react';
import { FilterOptions, UserProfile } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  allUsers: UserProfile[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, allUsers }) => {
  const teams = [...new Set(allUsers.map(user => user.team))];

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Filter className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </label>
          <select
            value={filters.team}
            onChange={(e) => onFiltersChange({ ...filters, team: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <User className="h-4 w-4" />
            <span>Employee</span>
          </label>
          <select
            value={filters.user}
            onChange={(e) => onFiltersChange({ ...filters, user: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Employees</option>
            {allUsers.filter(user => user.role === 'employee').map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.team}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onFiltersChange({
            dateRange: { start: '', end: '' },
            team: '',
            user: '',
          })}
          className="w-full px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};