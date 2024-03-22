import express from 'express'
import attendanceProfileRoutes from './attendanceTracker.routes.js';
import paymentProfileRoutes from './paymentProfileRoutes.js'
import leaveRoutes from './leaveRoutes'
import miscRouter from './misc'
import QRCodeRouter from './QRCodeRoutes' 

import atmRouter from './taskAdminMgt.routes'
import smsRouter from './skillMatrix.routes'
import traineeDiaryMgtRouter from './TraineeDiary.routes'
import inlineProductRoutes from './inlineProduct.routes'


const router = express.Router()

// Add your routes bellow
router.use(miscRouter) // Miscellaneous routes. Ex: Email
// ...
router.use('/attendanceTracker', attendanceProfileRoutes); //Attendance Tracker routes
router.use('/paymentProfile', paymentProfileRoutes); //Payment profile routes
router.use('/leave', leaveRoutes); //Payment profile routes

router.use('/qrCode', QRCodeRouter); //QR code routes
router.use('/sms', smsRouter)// Router for Skill Matrix System - Radul
router.use('/sms', smsRouter) // Router for Skill Matrix System - Radul
router.use('/atm', atmRouter) // Router for Admin Task Management - Akila
router.use('/ipm', inlineProductRoutes) // Router for Inline Product Management- Supun
router.use('/tds', traineeDiaryMgtRouter)
// Add your routes above

router.use('/', (req, res) =>
  res.json({ data: 'API running successfully' }).status(200)
)

export default router
