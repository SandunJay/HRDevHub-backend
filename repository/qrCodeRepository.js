// repositories/qrCodeRepository.js
import QRCode from '../models/qrCodeModel.js';

export const saveQRCodeData = async (userId, uniqueId, qrCodeData) => {
  try {
    const qrCode = new QRCode({
      userId,
      uniqueId,
      qrCodeData,
    });
    const savedQRCode = await qrCode.save();
    return savedQRCode;
  } catch (error) {
    throw new Error(error.message);
  }
};
