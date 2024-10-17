import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  TableContainer,
  Text,
  Heading,
  Td,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee, getEmployeeAttendance } from 'features/Employee/EmployeeSlice';
import { format } from 'prettier';

const SalesMonthAttendanceTable = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'sales');
  const attendanceData = useSelector((state) => state.employee?.employeeAttendnace);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Fetch all employees when the component mounts
  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch]);

  // Fetch attendance data for the selected employee and month
  useEffect(() => {
    if (selectedEmployeeId && selectedMonth) {
      dispatch(getEmployeeAttendance({ id: selectedEmployeeId, month: selectedMonth }));
    }
  }, [selectedEmployeeId, selectedMonth, dispatch]);

  // Update daysInMonth when selectedMonth changes
  useEffect(() => {
    if (selectedMonth) {
      const month = new Date(selectedMonth).getMonth() + 1; // getMonth() returns month from 0-11
      const year = new Date(selectedMonth).getFullYear();
      const days = new Date(year, month, 0).getDate(); // get days in the month
      const daysArray = Array.from({ length: days }, (_, i) => i + 1);
      setDaysInMonth(daysArray);
    }
  }, [selectedMonth]);

  const handleEmployeeChange = (e) => setSelectedEmployeeId(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  // Function to get attendance data for a specific date
  const getAttendanceForDate = (date) => {
    return attendanceData ? attendanceData.find(att => {
      // Compare with date string in the same format
      return att.date === date; // Ensure `att.date` is in 'YYYY-MM-DD' format
    }) : null;
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal); // Whole hours
    const minutes = Math.round((totalHoursDecimal - hours) * 60); // Convert decimal to minutes
    return `${hours}:${minutes.toString().padStart(2, '0')}`; // Format as required
  };

  const isSunday = (day) => {
    const selectedDate = new Date(`${selectedMonth}-${day.toString().padStart(2, '0')}`);
    return selectedDate.getDay() === 0; 
  };


  const getAttendance = (attendanceRecord) => {
    // Check if there are timeLogs and at least one checkIn
    if (attendanceRecord?.timeLogs?.length > 0) {
        const { checkIn, checkOut } = attendanceRecord.timeLogs[0];

        // Convert checkOut time to a Date object and compare with 3 PM
        const checkOutTime = new Date(checkOut);
        const threePM = new Date(checkOutTime);
        threePM.setHours(15, 0, 0, 0); // Set 3:00 PM

        if (checkIn && checkOut && checkOutTime < threePM) {
            // If there's a checkIn and checkOut is before 3 PM, it's half day
            return "Half day";
        } else if (checkIn) {
            // If there's a checkIn but not before 3 PM, it's a full present
            return "P";
        }
    }

    // If no checkIn, it's absent
    return "A";
};

  

  return (
    <Box p={8} mt={20} backgroundColor="white" borderRadius="8px">
      <Heading as="h2" size="lg" mb={6}>
        Sales Person Monthly Attendance
      </Heading>

      {/* Employee Selection */}
      <Flex  justifyContent={'space-between'}>
      <Box width={'48%'} mb={4}>
        <Text mb={2}>Select Sales Person:</Text>
        <Select placeholder="Select Sales Person" onChange={ handleEmployeeChange}>
          {employees?.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </Select>
      </Box>

      {/* Month Selection */}
      <Box width={'48%'} mb={4}>
        <Text mb={2}>Select Month:</Text>
        <Input type="month" onChange={handleMonthChange} />
      </Box>
      </Flex>

      {/* Attendance Table */}
      {selectedEmployeeId && selectedMonth ? (
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
              {/* <Th>Employee Name</Th> */}
                <Th>Date</Th>
                <Th>In</Th>
                <Th>Out</Th>
               
                <Th>Daily Attendnace</Th>
              </Tr>
            </Thead>
            <Tbody>
              {daysInMonth.map((day) => {
                const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const attendance = getAttendanceForDate(formattedDate);

                // Extract check-in and check-out times
                const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => new Date(log.checkIn).toLocaleTimeString()) || [];
                const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => new Date(log.checkOut).toLocaleTimeString()) || [];


                return (
                  <Tr key={day}>
                    {/* <Td>{selectedEmployeeId}</Td> */}
                    <Td>{formattedDate} {isSunday(day) ? "(Sunday)" : ''}</Td>
                    <Td>
                      {checkIns.length > 0 ? (
                        checkIns.map((checkIn, index) => (
                          <div key={index}>{checkIn}</div>
                        ))
                      ) : (
                        'A'
                      )}
                    </Td>
                    <Td>
                      {checkOuts.length > 0 ? (
                        checkOuts.map((checkOut, index) => (
                          <div key={index}>{checkOut}</div>
                        ))
                      ) : (
                        (checkIns.length > 0 ? '-' : 'A')
                      )}
                    </Td>
                    <Td>{getAttendance(attendance)}</Td>

                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>Please select an employee and a month to view attendance.</Text>
      )}
    </Box>
  );
};

export default SalesMonthAttendanceTable;
