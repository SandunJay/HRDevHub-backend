import QEExam from '../models/QEExam'

export const createQEExamRepo = async ({
  ExamType,
  InvigilatorEmpID,
  Location,
  StartTimestamp,
  EndTimestamp,
  Materials,
  Questions,
}) => {
  const session = new QEExam({
    ExamType,
    InvigilatorEmpID,
    Location,
    StartTimestamp,
    EndTimestamp,
    Materials,
    Questions,
  })

  const status = await session.save()
  return status
}

export const updateQEExamRepo = async ({
  _id,
  ExamType,
  InvigilatorEmpID,
  Location,
  StartTimestamp,
  EndTimestamp,
  Materials,
  Questions,
}) => {
  const status = await QEExam.findByIdAndUpdate(
    { _id },
    {
      $set: {
        ExamType,
        InvigilatorEmpID,
        Location,
        StartTimestamp,
        EndTimestamp,
        Materials,
        Questions,
      },
    }
  ).catch((err) => {
    return 0
  })

  return status
}

export const deleteQEExamRepo = async (_id) => {
  const status = await QEExam.findByIdAndDelete({
    _id,
  })

  return status
}

export const getQEExamsRepo = async () => {
  const record = await QEExam.find({})
  return record
}

export const getQEExamRepo = async (_id) => QEExam.findById(_id)
