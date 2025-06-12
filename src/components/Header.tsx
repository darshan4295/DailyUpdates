import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { User, Settings } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ profile }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Daily Updates</h1>
              <p className="text-sm text-gray-600">Team Progress Tracking</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{profile.name}</div>
                <div className="text-gray-500 capitalize">{profile.role} • {profile.team}</div>
              </div>
            </div>
            
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};