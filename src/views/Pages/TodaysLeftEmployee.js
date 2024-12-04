import { useDisclosure } from '@chakra-ui/react'
import { todaysPresent } from 'features/Attendance/AttendanceSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmployeeTable from './EmployeeTable'
import { todaysLeft } from 'features/Attendance/AttendanceSlice'

const TodaysLeftEmployee = () => {
    const dispatch = useDispatch()
    const todaysLeftEmployee = useSelector(state => state.attendance.todaysLeftEmployees)
    useEffect(() => {
        dispatch(todaysLeft())
    },[dispatch])
  return (
    <EmployeeTable employeeData = {todaysLeftEmployee?.data}/>
  )
}

export default TodaysLeftEmployee