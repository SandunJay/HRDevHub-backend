import PaymentProfile from '../models/paymentProfile';
import Employee from '../models/Employee'; 

class PaymentProfileRepository {
  async createPaymentProfile(profileData) {
    return PaymentProfile.create(profileData);
  }

  async getAllPaymentProfilesWithEmployeeData() {
    return PaymentProfile.find()
  }
  

  async getAllPaymentProfilesWithEmployeeDetails() {
    try {
      const paymentProfiles = await PaymentProfile.find();

      // Create an array to store the combined data
      const combinedProfiles = [];

      for (const profile of paymentProfiles) {
        // Retrieve employee details using the employeeID from the payment profile
        const employee = await Employee.findOne({ employeeID: profile.employeeID });

        if (employee) {
          // Extract the desired employee details
          const { fullName, email, designation, department } = employee;

          // Extract payment profile data
          const { employeeID, base_salary, allowances } = profile;

          // Combine the data
          const combinedProfile = {
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

      return combinedProfiles;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentProfileById(_id) {
    return PaymentProfile.findById(_id);
  }

  async updatePaymentProfile(_id, profileData) {
    return PaymentProfile.findByIdAndUpdate(_id, profileData, { new: true });
  }

  async deletePaymentProfile(id) {
    return PaymentProfile.findByIdAndRemove(id);
  }



}

export default new PaymentProfileRepository();
