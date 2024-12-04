import { todaysAbsent } from 'features/Attendance/AttendanceSlice'
import React, { useEffect,useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Input,
    Select,
    Flex,
    Box,
    Button
  } from '@chakra-ui/react';
import EmployeeTable from './EmployeeTable';

const TodaysAbsent = () => {
    const dispatch = useDispatch()
    const todaysAbsentEmployee = useSelector(state => state.attendance.todaysAbsentEmployee)
    useEffect(() => {
        dispatch(todaysAbsent())
    },[dispatch])

  return (
   <EmployeeTable employeeData={todaysAbsentEmployee?.data}/>
  )
}

export default TodaysAbsent