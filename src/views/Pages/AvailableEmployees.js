import React, { useEffect } from 'react'
import EmployeeTable from './EmployeeTable'
import { useDispatch, useSelector } from 'react-redux'
import { todaysAvailable } from 'features/Attendance/AttendanceSlice'

const AvailableEmployees = () => {
    const dispatch = useDispatch()
    const todaysAvailableEmployee = useSelector(state => state.attendance.todaysAvailableEmployee)
    useEffect(() => {
        dispatch(todaysAvailable())
    },[dispatch])
  return (
    <EmployeeTable employeeData={todaysAvailableEmployee?.data}/>
  )
}

export default AvailableEmployees