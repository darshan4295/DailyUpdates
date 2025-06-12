import {
  createUserProfile,
  getUserProfile,
  getAllProfiles,
  updateUserProfile,
  getUpdates,
  addUpdate,
  getUpdatesByUserId,
  getUpdatesByTeam,
  UserProfile,
  StorageUpdate,
} from './storage';
import { query } from './db';

// Mock the db query function
jest.mock('./db', () => ({
  query: jest.fn(),
}));

describe('User Profile Management', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (query as jest.Mock).mockReset();
  });

  describe('createUserProfile', () => {
    it('should create a new user profile successfully', async () => {
      const profileData: UserProfile = {
        id: 'mockId',
        name: 'Test User',
        email: 'test@example.com',
        role: 'employee',
        team: 'Test Team',
      };
      const expectedProfile: UserProfile = { ...profileData };

      (query as jest.Mock).mockResolvedValueOnce({ rows: [expectedProfile], rowCount: 1 });

      const profile = await createUserProfile(profileData);
      expect(query).toHaveBeenCalledWith(
        'INSERT INTO profiles (id, name, email, role, team) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, team',
        [profileData.id, profileData.name, profileData.email, profileData.role, profileData.team]
      );
      expect(profile).toEqual(expectedProfile);
    });

    it('should throw an error if database operation fails', async () => {
      const profileData: UserProfile = {
        id: 'testId',
        name: 'Test User',
        email: 'test@example.com',
        role: 'employee',
        team: 'Test Team',
      };
      (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      await expect(createUserProfile(profileData)).rejects.toThrow('DB error');
    });
  });

  describe('getUserProfile', () => {
    it('should return a user profile if found', async () => {
      const expectedProfile: UserProfile = {
        id: 'userId1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'employee',
        team: 'Test Team',
      };
      (query as jest.Mock).mockResolvedValueOnce({ rows: [expectedProfile], rowCount: 1 });

      const profile = await getUserProfile('userId1');
      expect(query).toHaveBeenCalledWith(
        'SELECT id, name, email, role, team FROM profiles WHERE id = $1',
        ['userId1']
      );
      expect(profile).toEqual(expectedProfile);
    });

    it('should return null if user profile is not found', async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [], rowCount: 0 });

      const profile = await getUserProfile('nonExistentId');
      expect(profile).toBeNull();
    });

    it('should return null if database operation fails', async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      const profile = await getUserProfile('userId1');
      expect(profile).toBeNull();
    });
  });

  describe('getAllProfiles', () => {
    // TODO: Add tests for getAllProfiles
    it('should return all profiles', async () => {
      // Test implementation
    });
    it('should return an empty array if db error occurs', async () => {
      // Test implementation
    });
  });

  describe('updateUserProfile', () => {
    // TODO: Add tests for updateUserProfile
    it('should update a user profile successfully', async () => {
      // Test implementation
    });
    it('should throw an error if db error occurs during update', async () => {
      // Test implementation
    });
  });
});

describe('Updates Management', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (query as jest.Mock).mockReset();
  });

  describe('getUpdates', () => {
    // TODO: Add tests for getUpdates
    it('should return all updates', async () => {
      // Test implementation
    });
    it('should return an empty array if db error occurs', async () => {
      // Test implementation
    });
  });

  describe('addUpdate', () => {
    // TODO: Add tests for addUpdate
    it('should add an update successfully', async () => {
      // Test implementation
    });
    it('should throw an error if db error occurs during add', async () => {
      // Test implementation
    });
  });

  describe('getUpdatesByUserId', () => {
    // TODO: Add tests for getUpdatesByUserId
    it('should return updates for a specific user', async () => {
      // Test implementation
    });
    it('should return an empty array if no updates found for user', async () => {
      // Test implementation
    });
    it('should return an empty array if db error occurs', async () => {
      // Test implementation
    });
  });

  describe('getUpdatesByTeam', () => {
    // TODO: Add tests for getUpdatesByTeam
    it('should return updates for a specific team', async () => {
      // Test implementation
    });
    it('should return an empty array if no updates found for team', async () => {
      // Test implementation
    });
    it('should return an empty array if db error occurs', async () => {
      // Test implementation
    });
  });
});
