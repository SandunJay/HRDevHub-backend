import PaymentProfileRepository from '../repository/paymentProfileRepository'
import { validatePaymentProfile } from '../validations/paymentProfileValidation'
import Employee from '../models/Employee' // Import the Employee model
import PaymentProfile from '../models/paymentProfile'

export async function createPaymentProfile(req, res) {
  const { body } = req

  const { error } = validatePaymentProfile(body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  const { employeeID } = body

  try {

    const existingEmployee = await Employee.findOne({ employeeID })

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    const allowedAttributes = {
      employeeID: body.employeeID,
      base_salary: body.base_salary,
      allowances: body.allowances,
      description: body.description,
    }

    try {
      const profile = await PaymentProfileRepository.createPaymentProfile(
        allowedAttributes
      )
      res.status(201).json(profile)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export async function getAllPaymentProfilesWithEmployeeData(req, res) {
  try {
    const profiles =
      await PaymentProfileRepository.getAllPaymentProfilesWithEmployeeData()
    res.status(200).json(profiles)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export async function getAllPaymentProfiles(req, res) {
  try {
    // Retrieve payment profiles
    const paymentProfiles = await PaymentProfile.find();

    // Create an array to store the combined data
    const combinedProfiles = [];

    // Iterate through each payment profile
    for (const profile of paymentProfiles) {
      // Retrieve employee details using the employeeID from the payment profile
      const employee = await Employee.findOne({ employeeID: profile.employeeID });

      // Check if an employee was found
      if (employee) {
        // Extract the desired employee details
        const { fullName, email, designation, department } = employee;

        // Extract payment profile data
        const {_id, employeeID, base_salary, allowances } = profile;

        // Combine the data
        const combinedProfile = {
          _id,
          employeeID,
          base_salary,
          allowances,
          fullName,
          email,
          designation,
          department,
        };

        combinedProfiles.push(combinedProfile);
      }
    }

    // Send the combined data as a response
    res.status(200).json(combinedProfiles);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function getPaymentProfileById(req, res) {
  const { id } = req.params
  try {
    const profile = await PaymentProfileRepository.getPaymentProfileById(id)

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.status(200).json(profile)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}


// UPDATE CONTROLLER
export async function updatePaymentProfile(req, res) {
  try {
    const { id } = req.params
    const { employeeID, base_salary, allowances, description } = req.body

    await PaymentProfile.findByIdAndUpdate(
      { _id: id },
      {
        employeeID,
        base_salary,
        allowances,
        description,
      }
    )

    res.status(200).json({ message: 'Profile updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE CONTROLLER
export async function deletePaymentProfile(req, res) {
  const { id } = req.params
  try {
    const profile = await PaymentProfileRepository.deletePaymentProfile(id)

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
