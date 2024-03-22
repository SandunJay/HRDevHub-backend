import express from 'express';
import QRCode from 'qrcode';
import Employee from '../models/Employee';
import QRCodeModel from '../models/qrCodeModel';

// Verification controller to verify user with database

// Custom error handler function
function handleError(res, statusCode, message) {
  return res.status(statusCode).json({ error: message });
}

// Verification controller to verify user with database
export async function validateUser(req, res) {
  const { body } = req;
  const {employeeID} = body;

  console.log('Received employeeID:', employeeID);
  
  try {
    const existingEmployee = await Employee.findOne({ employeeID });

    if (!existingEmployee) {
      return handleError(res, 404, 'Employee not found');
    }

    // Employee found, you can return a success response if needed.
    res.status(200).json({ message: 'Employee found' });
  } catch (error) {
    console.error('Error finding employee:', error);
    handleError(res, 500, 'Internal server error');
  }
}


// Stores QR code data in DB after generating new QR code
export async function createQR(req, res) {
  const { body } = req;
  const { employeeID, uniqueID, date } = body;

  try {
    const existingEmployee = await Employee.findOne({ employeeID });

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(body));
      const qrCodeDocument = new QRCodeModel({
        employeeID: employeeID,
        uniqueID: uniqueID,
        createdDate: date,
        backupData: qrCodeDataUrl,
      });

      await qrCodeDocument.save();
      res.status(200).json({ message: 'QR code saved successfully' });
    } catch (error) {
      console.error('Error generating QR code or saving document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error finding employee:', error);
    res.status(403).json({ error: 'Employee not found' });
  }
}



