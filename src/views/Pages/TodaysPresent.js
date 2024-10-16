import { useDisclosure } from '@chakra-ui/react'
import { todaysPresent } from 'features/Attendance/AttendanceSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmployeeTable from './EmployeeTable'

const TodaysPresent = () => {
    const dispatch = useDispatch()
    const todaysPresentEmployee = useSelector(state => state.attendance.todaysPresentEmployee)
    useEffect(() => {
        dispatch(todaysPresent())
    },[dispatch])
  return (
    <EmployeeTable employeeData = {todaysPresentEmployee?.data}/>
  )
}

export default TodaysPresent