import React from 'react';
import { Calendar, User, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { DailyUpdate } from '../types';
import { format } from 'date-fns';

interface TimelineProps {
  updates: DailyUpdate[];
  loading?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ updates, loading = false }) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-600">Loading updates...</p>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <div className="bg-gray-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
          <Calendar className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900">No Updates Yet</h3>
        <p className="mt-2 text-gray-600">Start by submitting your first daily update.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => {
        const isExpanded = expandedItems.has(update.id);
        
        return (
          <div
            key={update.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-gray-900">{update.user_name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {update.team}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(update.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(update.created_at), 'HH:mm')}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Yesterday's Accomplishments</h4>
                      <p className={`text-gray-700 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                        {update.accomplishments}
                      </p>
                    </div>
                    
                    {isExpanded && (
                      <>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Carry Forward & Reasons</h4>
                          <p className="text-gray-700">{update.carry_forward}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Today's Plans</h4>
                          <p className="text-gray-700">{update.today_plans}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => toggleExpanded(update.id)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {isExpanded ? (
                  <>
                    <span>Less</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>More</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};