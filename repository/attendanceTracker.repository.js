// repositories/attendanceProfileRepository.js
import AttendanceProfile from '../models/attendanceProfile';

// Create a new attendance profile
export const create = async (attendanceProfileData) => {
  const attendanceProfile = new AttendanceProfile(attendanceProfileData);
  return await attendanceProfile.save();
};

// Get all attendance profiles
export const getAll = async () => {
  return await AttendanceProfile.find();
};

// Get a specific attendance profile by ID
export const getById = async (id) => {
  return await AttendanceProfile.findById(id);
};

// Update an existing attendance profile by ID
export const update = async (id, attendanceProfileData) => {
  return await AttendanceProfile.findByIdAndUpdate(id, attendanceProfileData, {
    new: true,
  });
};

// Delete an attendance profile by ID
export const remove = async (id) => {
  return await AttendanceProfile.findByIdAndRemove(id);
};
