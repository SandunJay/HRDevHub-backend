import express from 'express';
import {
  createPaymentProfile,
  getAllPaymentProfiles,
  getAllPaymentProfilesWithEmployeeData,
  getPaymentProfileById,
  updatePaymentProfile,
  deletePaymentProfile,
} from '../controllers/paymentProfile.controller';

const router = express.Router();

router.post('/profiles', createPaymentProfile);
router.get('/profiles', getAllPaymentProfiles);
router.get('/Allprofiles', getAllPaymentProfilesWithEmployeeData);

router.get('/profiles/:id', getPaymentProfileById);
router.put('/profiles/:id', updatePaymentProfile);
router.delete('/profiles/:id', deletePaymentProfile);



// 
export default router;
