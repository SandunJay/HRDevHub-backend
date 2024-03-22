// models/qrCodeModel.js
import mongoose from 'mongoose';

const QRCodeSchema = new mongoose.Schema({
  employeeID: {
    type: String,
    required: true,
  },
  uniqueID: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  backupData: {
    type: String,
    required: true,
  },

},
{
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
}
);

const QRCodeModel = mongoose.model('QRCodeModel', QRCodeSchema);
QRCodeModel.syncIndexes()

export default QRCodeModel;

