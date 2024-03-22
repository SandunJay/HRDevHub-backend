import express from 'express';
import {
  createLeave,
  getAllLeaves,
  getAllLeavesWithEmployeeData,
  getLeaveById,
  updateLeave,
  deleteLeave,
  getLeavesByEmployeeID
} from '../controllers/LeaveController';

const router = express.Router();

// Employee's
router.post('/leaves', createLeave);
router.put('/leaves/:id', updateLeave);
router.delete('/leaves/:id', deleteLeave);
router.get('/leaves/:id', getLeaveById);
router.get('/empAllLeaves/:employeeID',getLeavesByEmployeeID)


// Admin's
router.get('/allLeaves', getAllLeaves);
router.get('/leaves', getAllLeavesWithEmployeeData);
// router.delete('/leaves/:id', deleteLeave); but this is also the same for admin when deleting records






// 
export default router;
