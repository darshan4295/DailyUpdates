import React, { useState, useMemo } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { DailyUpdateForm } from './components/DailyUpdateForm';
import { Timeline } from './components/Timeline';
import { FilterPanel } from './components/FilterPanel';
import { ReportGenerator } from './components/ReportGenerator';
import { ProfileSetup } from './components/ProfileSetup';
import { useUpdates } from './hooks/useUpdates';
import { useProfile } from './hooks/useProfile';
import { FilterOptions } from './types';
import { Users, Loader2 } from 'lucide-react';

function App() {
  const { user: clerkUser, isLoaded } = useUser();
  const { profile, loading: profileLoading, updateProfile } = useProfile(clerkUser);
  const { updates, loading: updatesLoading, saveUpdate, filterUpdates, allUsers } = useUpdates(profile);
  
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { start: '', end: '' },
    team: '',
    user: '',
  });

  const filteredUpdates = useMemo(() => {
    if (!filters.dateRange.start && !filters.dateRange.end && !filters.team && !filters.user) {
      return updates;
    }
    return filterUpdates(filters);
  }, [updates, filters, filterUpdates]);

  if (!isLoaded || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Daily Updates</h2>
              <p className="mt-2 text-sm text-gray-600">
                Track progress and generate insightful reports
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="text-center">
                <SignInButton mode="modal">
                  <button className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                    <Users className="h-4 w-4 mr-2" />
                    Sign In to Continue
                  </button>
                </SignInButton>
                <p className="mt-4 text-xs text-gray-500">
                  Secure authentication powered by Clerk
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {!profile ? (
          <ProfileSetup onComplete={updateProfile} />
        ) : (
          <>
            <Header profile={profile} />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Daily Update Form - Only for employees */}
                  {profile.role === 'employee' && (
                    <DailyUpdateForm profile={profile} onSubmit={saveUpdate} />
                  )}
                  
                  {/* Timeline */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {profile.role === 'manager' ? 'Team Updates' : 'Recent Updates'}
                    </h2>
                    <Timeline updates={filteredUpdates} loading={updatesLoading} />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Filters - Only for managers */}
                  {profile.role === 'manager' && (
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      allUsers={allUsers}
                    />
                  )}
                  
                  {/* Report Generator - Only for managers */}
                  {profile.role === 'manager' && (
                    <ReportGenerator updates={filteredUpdates} />
                  )}
                  
                  {/* Quick Stats for employees */}
                  {profile.role === 'employee' && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Updates</span>
                          <span className="font-medium text-gray-900">
                            {updates.filter(u => u.user_id === profile.id).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">This Month</span>
                          <span className="font-medium text-gray-900">
                            {updates.filter(u => 
                              u.user_id === profile.id && 
                              new Date(u.date).getMonth() === new Date().getMonth()
                            ).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team</span>
                          <span className="font-medium text-blue-600">{profile.team}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </>
        )}
      </SignedIn>
    </div>
  );
}

export default App;