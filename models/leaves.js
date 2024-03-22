import mongoose from 'mongoose'

const LeaveSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
      ref:'Employee',
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
        type: String,
        required: true,
      },
    description: {
        type: String,
        required: true,
    },
    isHandled: {
      type: Boolean,
      required:true,
    },
    message:{
      type:String,
      required:true,
    }

  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const Leave = mongoose.model('Leave', LeaveSchema)

Leave.syncIndexes()

export default Leave
