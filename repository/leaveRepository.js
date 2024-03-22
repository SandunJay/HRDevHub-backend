import Leave from '../models/leaves';
import Employee from '../models/Employee'; 

class LeaveRepository {
  async createLeave(leaveData) {
    return Leave.create(leaveData);
  }

  async getAllLeavesWithEmployeeData() {
    return Leave.find()
  }
  

  async getAllLeavesWithEmployeeDetails() {
    try {
      const leaves = await Leave.find();

      // Create an array to store the combined data
      const combinedLeaves = [];

      for (const leave of leaves) {
        // Retrieve employee details using the employeeID from the Leave leave
        const employee = await Employee.findOne({ employeeID: leave.employeeID });

        if (employee) {
          // Extract the desired employee details
          const { fullName, email, designation, department } = employee;

          // Extract Leave leave data
          const { employeeID, reason, date,description , isHandled,message } = leave;

          // Combine the data
          const combinedLeave = {
            employeeID,
            reason,
            date,
            description,
            isHandled,
            message,
            fullName,
            email,
            designation,
            department,
          };

          combinedLeaves.push(combinedLeave);
        }
      }

      return combinedLeaves;
    } catch (error) {
      throw error;
    }
  }

  async getLeaveById(_id) {
    return Leave.findById(_id);
  }

  async updateLeave(_id, leaveData) {
    return Leave.findByIdAndUpdate(_id, leaveData, { new: true });
  }

  async deleteLeave(id) {
    return Leave.findByIdAndRemove(id);
  }



}

export default new LeaveRepository();
