import Employee from '../models/Employee'
import express from 'express'
const router = express.Router()

//add to db
router.route('/add').post((req, res) => {
  const employeeID = req.body.employeeID
  const fullName = req.body.fullName
  const fName = req.body.fName
  const lName = req.body.lName
  const pName = req.body.pName
  const dateOfBirth = req.body.dateOfBirth
  const noOfExp = Number(req.body.noOfExp)
  const gender = req.body.gender
  const email = req.body.email
  const phoneNo = Number(req.body.phoneNo)
  const address = req.body.address

  const newEmployee = new Employee({
    employeeID,
    fullName,
    fName,
    lName,
    pName,
    dateOfBirth,
    noOfExp,
    gender,
    email,
    phoneNo,
    address,
  })

  newEmployee
    .save()
    .then(() => {
      res.json('Trainee Added Successfully')
    })
    .catch((err) => {
      console.log(err)
    })
})

//fetch to db all
router.route('/').get((req, res) => {
  Employee.find()
    .then((employee) => {
      res.json(employee)
    })
    .catch((err) => {
      console.log(err)
    })
})

//update to db
router.route('/update/:id').put(async (req, res) => {
  let userId = req.params.id
  const {
    employeeID,
    fullName,
    fName,
    lName,
    pName,
    dateOfBirth,
    gender,
    email,
    phoneNo,
    address,
  } = req.body

  const updateEmployee = {
    employeeID,
    fullName,
    fName,
    lName,
    pName,
    dateOfBirth,
    noOfExp,
    gender,
    email,
    phoneNo,
    address,
  }
  const update = await Employee.findByIdAndUpdate(userId, updateEmployee) //Employee
    .then(() => {
      res.status(200).send({ status: 'User updated' })
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .send({ status: 'Error with updating data', error: err.message })
    })
})

//delete from db

router.route('/:id').delete(async (req, res) => {
  let userId = req.params.id

  await Employee.findByIdAndDelete(userId)
    .then(() => {
      res.status(200).send({ status: 'User deleted' })
    })
    .catch((err) => {
      console.log(err.message)
      res
        .status(500)
        .send({ status: 'Error with delete user', error: err.message })
    })
})

//fetch single from db specific

router.route('/get/:id').get(async (req, res) => {
  try {
    let userId = req.params.id
    const user = await Employee.findById(userId)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})


export default router



export const findUserByEmailAndRole = async ({ email, role }) => {
  const employee = await Employee.findOne({ email, role })

  return employee
}
