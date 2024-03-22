// controllers/attendanceProfileController.js
import { body } from 'express-validator'
import AttendanceProfile from '../models/attendanceProfile'
import Employee from '../models/Employee'
import QRCodeModel from '../models/qrCodeModel'
import { create } from '../repository/attendanceTracker.repository'

import { sendEmail } from '../utils/email';
import { validationResult } from 'express-validator';


// Returns the employeeID to be stored in the cookie
export const getEmployeeIDByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Access the email from req.params

    console.log('Received email:', email);

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ data: 'Employee not found' });
    }

    const employeeID = employee.employeeID;

    return res.status(200).json({ employeeID });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: 'Internal server error' });
  }
};


// Use a Map to store the last recorded timestamp for each employee
const lastRecordedTimestamps = new Map();
const errorTimestamps = new Map();

// Create a new attendance profile
export const createAttendanceRecord = async (req, res) => {
  try {
    const { employeeID, uniqueID, createdDate } = req.body;

    // Validate userId against Employee model
    const employee = await Employee.findOne({ employeeID: employeeID });

    if (!employee) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    // Validate uniqueID against QRCodeModel or replace QRCodeModel with the actual model you are using
    const qrCode = await QRCodeModel.findOne({ uniqueID: uniqueID });

    if (!qrCode) {
      return res.status(400).json({ error: 'Invalid QR code' });
    }

    // Check if the created date is within 6 days of the current date
    const qrCreatedDateObj = new Date(createdDate);
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    if (qrCreatedDateObj < sixDaysAgo) {
      return res.status(400).json({ error: 'QR code expired' });
    }

    // Get the current timestamp
    const currentTimestamp = new Date().getTime();

    // Check if the user has already recorded attendance within the last hour
    const lastRecordedTimestamp = lastRecordedTimestamps.get(employeeID);

    if (lastRecordedTimestamp && currentTimestamp - lastRecordedTimestamp < 3600000) {
      return res.status(400).json({ error: 'You can only record one attendance per hour' });
    }

    // Check if the user has already recorded attendance within the last hour
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 to get the start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Get the start of the next day

    const attendanceCount = await AttendanceProfile.countDocuments({
      employeeID: employeeID,
      createdDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (attendanceCount >= 2) {
      return res.status(400).json({ error: 'Attendance limit reached for today' });
    }

    // If no error occurs, update the last recorded timestamp for the employee and wait for 10 seconds
    lastRecordedTimestamps.set(employeeID, currentTimestamp);
    setTimeout(async () => {
      try {
        const attendanceProfileData = {
          employeeID: employeeID,
          uniqueID: uniqueID,
          createdDate: createdDate,
          scannedDate: new Date(),
        };
        const savedProfile = await create(attendanceProfileData); // Assuming create function exists
        res.status(200).json(savedProfile);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }, 10000); // 10 seconds

  } catch (err) {
    const errorTimestamp = errorTimestamps.get(employeeID);
    if (errorTimestamp && currentTimestamp - errorTimestamp < 5000) {
      return res.status(400).json({ error: 'Wait for 5 seconds before scanning again' });
    }
    errorTimestamps.set(employeeID, currentTimestamp);

    res.status(404).json({ error: err.message });
  }
};


// Get all attendance profiles and employee data separately
export const getAllAttendanceRecords = async (req, res) => {
  try {
    // Get all attendance profiles
    const attendanceRecords = await AttendanceProfile.find({}, 'employeeID createdDate scannedDate');

    // Get unique employee IDs from attendance records
    const employeeIDs = [...new Set(attendanceRecords.map((record) => record.employeeID))];

    // Get employee data based on employee IDs
    const employees = await Employee.find({ employeeID: { $in: employeeIDs } }, 'employeeID fullName email department');

    // Create a map to quickly access employee data by employeeID
    const employeeMap = new Map();
    employees.forEach((employee) => {
      employeeMap.set(employee.employeeID, employee);
    });

    // Combine data based on employeeID
    const combinedData = attendanceRecords.map((record) => {
      const employee = employeeMap.get(record.employeeID);

      // Check if an employee was found
      if (!employee) {
        return {
          _id: record._id,
          employeeID: record.employeeID,
          fullName: 'Employee Not Found',
          email: '',
          department: '',
          createdDate: record.createdDate,
          scannedDate: record.scannedDate,
        };
      }

      return {
        _id: record._id,
        employeeID: record.employeeID,
        fullName: employee.fullName,
        email: employee.email,
        department: employee.department,
        createdDate: record.createdDate,
        scannedDate: record.scannedDate,
      };
    });

    res.status(200).json(combinedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific attendance profile by ID
export const getAttendanceRecordById = async (req, res) => {
  try {
    const profile = await AttendanceProfile.findById(req.params.id)
      .populate('userId', 'fullName email phoneNo') // Populate Employee details
      .exec()
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.status(200).json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getAttendanceRecordByDocumentId = async (req, res) => {
  try {
    const documentId = req.params.id; 

    // Find the document by its _id
    const attendanceRecord = await AttendanceProfile.findById(documentId)
      .select('employeeID createdDate scannedDate')
      .lean(); 

    if (!attendanceRecord) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Find the employee data for the employeeID in the attendance record
    const employeeData = await Employee.findOne({ employeeID: attendanceRecord.employeeID })
      .select('fullName email')
      .lean();

    if (!employeeData) {
      return res.status(404).json({ error: 'Employee data not found' });
    }

    // Combine the attendance record and employee data
    const result = {
      _id: documentId,
      employeeID: attendanceRecord.employeeID,
      fullName: employeeData.fullName,
      email: employeeData.email,
      createdDate: attendanceRecord.createdDate,
      scannedDate: attendanceRecord.scannedDate,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing attendance profile by ID
export const updateAttendanceProfile = async (req, res) => {
  try {
    const updatedProfile = await AttendanceProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.status(200).json(updatedProfile)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete an attendance profile by ID
export const deleteAttendanceRecord = async (req, res) => {
  try {
    const deletedProfile = await AttendanceProfile.findByIdAndRemove(
      req.params.id
    )
    if (!deletedProfile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const attendanceEmailController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient, greet, emailBody, subject } = req.body;

    const result = await sendEmail({
      from: 'No Reply<sliitproj@gmail.com>',
      recipient,
      subject,
      greeting: greet,
      emailBody,
    });

    if (result === 1) {
      return res.status(200).json({ message: 'Email sent successfully.' });
    } else {
      return res.status(500).json({ message: 'Failed to send email.' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'An error occurred while sending the email.' });
  }
};


// Define validation rules using express-validator
export const sendEmailValidationRules = () => [
  body('recipient').isEmail(),
  body('greet').isString(),
  body('emailBody').isString(),
  body('subject').isString(),
];

