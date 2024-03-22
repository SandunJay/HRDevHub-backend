import LeaveRepository from '../repository/leaveRepository'
import { validateLeave } from '../validations/leaveValidation'
import Employee from '../models/Employee' // Import the Employee model
import Leave from '../models/leaves'


// Employee CRUD operations
// Create a Leave
export async function createLeave(req, res) {
  const { body } = req;

  const { error } = validateLeave(body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { employeeID, reason, date, description, isHandled,message } = body;

  try {
    const existingEmployee = await Employee.findOne({ employeeID });

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Parse the date string into a JavaScript Date object
    const dateParts = date.split('-');
    const formattedDate = new Date(
      parseInt(dateParts[2]), // Year
      parseInt(dateParts[1]) - 1, // Month (subtract 1 as months are 0-based)
      parseInt(dateParts[0]) // Day
    );

    const allowedAttributes = {
      employeeID,
      reason,
      date: formattedDate,
      description,
      isHandled,
      message,
    };

    try {
      const leave = await LeaveRepository.createLeave(allowedAttributes);
      res.status(201).json(leave);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getLeavesByEmployeeID(req, res) {
  const { employeeID } = req.params; // Assuming you pass the employeeID as a parameter

  console.log('Received employeeID:', employeeID);
  
  try {
    // Find all leaves with the specified employeeID
    const leaves = await Leave.find({ employeeID });

    // If no leaves are found, return an error message
    if (leaves.length === 0) {
      return res.status(404).json({ error: 'No leaves found for the specified employeeID' });
    }

    // Return the found leaves
    res.status(200).json(leaves);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// UPDATE CONTROLLER
export async function updateLeave(req, res) {
    try {
      const { id } = req.params
      const { employeeID, reason, date, description,isHandled,message} = req.body
  
      await Leave.findByIdAndUpdate(
        { _id: id },
        {
          employeeID,
          reason,
          date,
          description,
          isHandled,
          message,
        }
      )
  
      res.status(200).json({ message: 'Leave updated successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }



  
  // DELETE CONTROLLER
  export async function deleteLeave(req, res) {
    const { id } = req.params
    try {
      const leave = await LeaveRepository.deleteLeave(id)
  
      if (!leave) {
        return res.status(404).json({ error: 'Leave not found' })
      }
  
      res.status(200).json({ success: 'Leave Deleted' })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  // export async function getLeaveByEmployeeId(req, res) {
  //   const { id } = req.params
  //   try {
  //     const leave = await LeaveRepository.getLeaveByEmployeeId(id)
  
  //     if (!leave) {
  //       return res.status(404).json({ error: 'Leave not found' })
  //     }
  
  //     res.status(200).json(leave)
  //   } catch (error) {
  //     res.status(500).json({ error: 'Internal Server Error' })
  //   }
  // }
  


//   Admin's controllers

  // Update leave status
  export async function updateLeaveStatus(req, res) {
    try {
      const { id } = req.params
      const { employeeID, isHandled,message} = req.body
  
      await Leave.findByIdAndUpdate(
        { _id: id },
        {
          employeeID,
          isHandled,
          message,
        }
      )
  
      res.status(200).json({ message: 'Leave status updated successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

export async function getAllLeavesWithEmployeeData(req, res) {
  try {
    const leaves =
      await LeaveRepository.getAllLeavesWithEmployeeData()
    res.status(200).json(leaves)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}


export async function getAllLeaves(req, res) {
  try {
    // Retrieve payment leaves
    const leaves = await Leave.find();

    // Create an array to store the combined data
    const combinedLeaves = [];

    // Iterate through each payment leave
    for (const leave of leaves) {
      // Retrieve employee details using the employeeID from the payment leave
      const employee = await Employee.findOne({ employeeID: leave.employeeID });

      // Check if an employee was found
      if (employee) {
        // Extract the desired employee details
        const { fullName, email, designation, department } = employee;

        // Extract payment leave data
        const {_id, employeeID, reason, date,description, isHandled,message } = leave;

        // Combine the data
        const combinedLeave = {
          _id,
          employeeID,
          reason,
          date,
          description,
          isHandled,
          fullName,
          email,
          designation,
          department,
          message,
        };

        combinedLeaves.push(combinedLeave);
      }
    }

    // Send the combined data as a response
    res.status(200).json(combinedLeaves);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function getLeaveById(req, res) {
  const { id } = req.params
  try {
    const leave = await LeaveRepository.getLeaveById(id)

    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' })
    }

    res.status(200).json(leave)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}


