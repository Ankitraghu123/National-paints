import React, { useState, useEffect, useMemo } from 'react';
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
  Button,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee, getEmployeeAttendance } from 'features/Employee/EmployeeSlice';
import { format } from 'prettier';
import { CSVLink } from 'react-csv';

const EmployeeMonthAttendanceTable = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'labour'&& !employee.delete );
  const attendanceData = useSelector((state) => state.employee?.employeeAttendnace);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeData, setSelectedEmployeeData] = useState('');
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

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
  
    const selectedEmployee = employees.find((employee) => employee._id === employeeId);
    setSelectedEmployeeData(selectedEmployee || {});
  };
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  // Function to get attendance data for a specific date
  const getAttendanceForDate = (date) => {
    return attendanceData ? attendanceData.find(att => {
      // Compare with date string in the same format
      return att.date === date; // Ensure `att.date` is in 'YYYY-MM-DD' format
    }) : null;
  };

  const getDailyHours = (attendanceRecord) => {
    if (!attendanceRecord || !attendanceRecord.timeLogs || attendanceRecord.timeLogs.length === 0) {
      return {
        formattedHours: "0:0",
        deductedLunch: "No",
      };
    }
  
    const firstLog = attendanceRecord.timeLogs[0];
    const checkInTime = firstLog.checkIn;
    const checkOutTime = firstLog.checkOut;
  
    if (!checkInTime || !checkOutTime) {
      return {
        formattedHours: "0:0",
        deductedLunch: "No",
      };
    }
  
    // Convert checkInTime and checkOutTime to Date objects
    let checkInDate = new Date(checkInTime);
    let checkOutDate = new Date(checkOutTime);
  
    // Round check-in and check-out times
    checkInDate = roundTime(checkInDate);
    checkOutDate = roundTime(checkOutDate);
  
    // If the checkOutTime is earlier than the checkInTime, it means the checkout is on the next day
    if (checkOutDate < checkInDate) {
      checkOutDate.setDate(checkOutDate.getDate() + 1); // Add 1 day to checkOutTime
    }
  
    // Calculate total hours worked (difference between check-out and check-in)
    const checkInMilliseconds = checkInDate.getTime();
    const checkOutMilliseconds = checkOutDate.getTime();
  
    let totalHours = (checkOutMilliseconds - checkInMilliseconds) / (1000 * 60 * 60); // Convert milliseconds to hours
  
    // Deduct lunch if conditions are met (check-in before 1 PM and check-out after 2 PM)
    const checkInHour = checkInDate.getUTCHours();
    const checkOutHour = checkOutDate.getUTCHours();
  
    // Check if lunch should be deducted
    const isLunchDeductible = checkInHour < 13 && checkOutHour > 14;
  
    if (isLunchDeductible) {
      totalHours -= 0.5; // Deduct 30 minutes for lunch
    }
  
    return {
      formattedHours: formatHours(totalHours),
      deductedLunch: isLunchDeductible ? "Yes" : "No",
    };
  };
  
  // Helper function to round time
  const roundTime = (date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = roundMinutes(minutes);
  
    // Adjust hours if rounded minutes go to 60
    if (roundedMinutes === 60) {
      date.setHours(date.getHours() + 1, 0, 0, 0); // Increment the hour and set minutes to 0
    } else {
      date.setMinutes(roundedMinutes, 0, 0); // Set rounded minutes
    }
  
    return date;
  };
  
  // Helper function to format hours into HH:MM format
  const formatHours = (hours) => {
    const wholeHours = Math.floor(hours);
    const rawMinutes = (hours - wholeHours) * 60;
  
    const roundedMinutes = Math.round(rawMinutes);
  
    return `${wholeHours}:${roundedMinutes.toString().padStart(2, "0")}`;
  };

  const roundMinutes = (minutes) => {
    if (minutes <= 10) return 0;
    if (minutes <= 25) return 15;
    if (minutes <= 40) return 30;
    if (minutes <= 55) return 45;
    return 60; // Minutes > 55 round to the next hour
  };
 

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  };

  const extractTime = (isoString) => {
    const dateObject = new Date(isoString);
    let hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const csvData = useMemo(() => {
    return daysInMonth.map((day, idx) => {
      const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const attendance = getAttendanceForDate(formattedDate);

      const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => extractTime(log.checkIn)) || [];
      const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => extractTime(log.checkOut)) || [];
      const { formattedHours, deductedLunch } = getDailyHours(attendance, day);

      return {
        "Serial No.": idx + 1,
        Name: selectedEmployeeData.name,
        EmployeeCode: selectedEmployeeData.employeeCode,
        Date: formattedDate,
        CheckIn: checkIns.length > 0 ? checkIns.join(', ') : 'A',
        CheckOut: checkOuts.length > 0 ? checkOuts.join(', ') : (checkIns.length > 0 ? '-' : 'A'),
        LunchDeducted: deductedLunch,
        WorkingHours: formattedHours,
      };
    });
  }, [daysInMonth, selectedMonth, selectedEmployeeData, attendanceData]);

  return (
    <Box p={8} mt={40} backgroundColor="white" borderRadius="8px">
      <Heading as="h2" size="lg" mb={6}>
        Labour Monthly Attendance
      </Heading>

      {/* Employee Selection */}
      <Flex  justifyContent={'space-between'}>
      <Box width={'48%'} mb={4}>
        <Text mb={2}>Select Labour:</Text>
        <Select placeholder="Select labour" onChange={handleEmployeeChange }>
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

      <Button colorScheme="green" mb={4}>
        <CSVLink
          data={csvData || []}
          filename={`${selectedEmployeeData.name}_${selectedMonth}.csv`}
          className="btn btn-primary"
          target="_blank"
        >
          Export to CSV
        </CSVLink>
      </Button>

      {/* Attendance Table */}
      {selectedEmployeeId && selectedMonth ? (
        <TableContainer maxHeight={'100vh'} overflowY="auto">
          <Table variant="striped" colorScheme="teal">
            <Thead id='head-fixed'>
              <Tr>
                <Th>Serial No.</Th>
                <Th id='col-fixed'>Employee Name</Th>
                <Th>Employee Code</Th>
                <Th>Date</Th>
                <Th>In</Th>
                <Th>Out</Th>
                <Th>Lunch Deducted</Th>
                <Th>Total Hours</Th>
              </Tr>
            </Thead>
            <Tbody>
              {daysInMonth.map((day, idx) => {
                const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const attendance = getAttendanceForDate(formattedDate);
              
                const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => extractTime(log.checkIn)) || [];
                const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => extractTime(log.checkOut)) || [];
                const { formattedHours, deductedLunch } = getDailyHours(attendance, day);

                return (
                  <Tr key={day}>
                    <Td>{idx + 1}</Td>
                    <Td id='col-fixed'>{selectedEmployeeData.name}</Td>
                    <Td>{selectedEmployeeData?.employeeCode}</Td>
                    <Td>{formattedDate}</Td>
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
                    <Td>{deductedLunch ? deductedLunch : "No"}</Td>
                    <Td>{formattedHours}</Td>
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

export default EmployeeMonthAttendanceTable;
