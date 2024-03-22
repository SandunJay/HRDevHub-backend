import mongoose from 'mongoose'

const AttendanceProfileSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
      ref:'Employee',
    },
    uniqueID: {
      type: String,
      required: true,
    },
    createdDate: {
        type: Date,
        required: true,
    },
    scannedDate: {
      type: Date,
      required: true,
  },

  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const AttendanceProfile = mongoose.model('AttendanceProfile', AttendanceProfileSchema)

AttendanceProfile.syncIndexes()

export default AttendanceProfile
