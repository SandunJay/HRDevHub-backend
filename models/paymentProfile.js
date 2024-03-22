import mongoose from 'mongoose'

const PaymentProfileSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
      ref:'Employee',
    },
    base_salary: {
      type: Number,
      required: true,
    },
    allowances: {
        type: Number,
        required: true,
      },
    description: {
        type: String,
        required: true,
    },

  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const PaymentProfile = mongoose.model('PaymentProfile', PaymentProfileSchema)

PaymentProfile.syncIndexes()

export default PaymentProfile
