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
  Button,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee, getEmployeeAttendance } from 'features/Employee/EmployeeSlice';
import { format } from 'prettier';
import { CSVLink } from 'react-csv';

const OfficeBoyEmplpoyeeMonthTable = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'officeboy'&& !employee.delete);
  const attendanceData = useSelector((state) => state.employee?.employeeAttendnace);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeData, setSelectedEmployeeData] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [tableData, setTableData] = useState([]);

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

  // Function to extract time in AM/PM format
  const extractTime = (isoString) => {
    const dateObject = new Date(isoString);
    let hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const seconds = dateObject.getUTCSeconds();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
  };

  // Prepare data for CSV export
  useEffect(() => {
    if (selectedEmployeeId && selectedMonth) {
      const csvData = daysInMonth.map((day, index) => {
        const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const attendance = getAttendanceForDate(formattedDate);
        const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => extractTime(log.checkIn)) || [];
        const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => extractTime(log.checkOut)) || [];
        const { formattedHours, deductedLunch } = getDailyHours(attendance, day);

        return {
          'Sno.': index + 1,
          'Employee Name': selectedEmployeeData?.name,
          'Employee Code': selectedEmployeeData?.employeeCode,
          Date: formattedDate,
          In: checkIns.join(', ') || 'A',
          Out: checkOuts.join(', ') || (checkIns.length > 0 ? '-' : 'A'),
          'Lunch Deducted': deductedLunch,
          'Total Hours': formattedHours,
        };
      });

      setTableData(csvData);
    }
  }, [selectedEmployeeId, selectedMonth, daysInMonth, attendanceData, selectedEmployeeData]);

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

  
  const isSunday = (day) => {
    const selectedDate = new Date(`${selectedMonth}-${day.toString().padStart(2, '0')}`);
    return selectedDate.getDay() === 0; 
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
    const isLunchDeductible = checkInHour < 14 && (checkOutHour > 14 || (checkOutHour === 14 && checkOutDate.getUTCMinutes() >= 30));
  
    if (isLunchDeductible) {
      totalHours -= 0.5; // Deduct 30 minutes for lunch
    }
  
    return {
      formattedHours: formatHours(totalHours),
      deductedLunch: isLunchDeductible ? "Yes" : "No",
    };
  };

  const calculateDailySalary = (attendanceRecord, daysInMonth) => {
    const monthlySalary = 10000; // Monthly salary
    const workingDaysInMonth = daysInMonth.length; // Number of days in the month
    const dailySalary = monthlySalary / workingDaysInMonth; // Daily salary
    
    // Assuming totalHours is in decimal format (e.g., 12.5 for 12 hours and 30 minutes)
    const totalHours = attendanceRecord.totalHours || 0;
    
    // Calculate total minutes worked
    const workedMinutes = totalHours * 60; // Convert hours to minutes
    
    // Calculate hourly rate from daily salary
    const hourlyRate = dailySalary / 12 ; // Assuming 12 working hours
  
    // Calculate the salary for the current day
    const salaryForToday = (workedMinutes / 60) * hourlyRate; // Convert worked minutes back to hours for salary calculation
  
    return salaryForToday.toFixed(2); // Return salary formatted to 2 decimal places
  };

  return (
    <Box p={12} mt={40} backgroundColor="white" borderRadius="12px">
      <Heading as="h2" size="lg" mb={6}>
        Office Boy Monthly Attendance
      </Heading>

      {/* Employee Selection */}
      <Flex justifyContent={'space-between'} alignItems={'center'} gap={4}>
        <Box width={'412%'} mb={4}>
          <Text mb={2}>Select Office Boy:</Text>
          <Select placeholder="Select office boy" onChange={handleEmployeeChange}>
            {employees?.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </Select>
        </Box>

        {/* Month Selection */}
        <Box width={'412%'} mb={4}>
          <Text mb={2}>Select Month:</Text>
          <Input type="month" onChange={handleMonthChange} />
        </Box>

        {/* CSV Export Button */}
        <Box mt={4}>
          <CSVLink
            data={tableData}
            filename={`officeboy_attendance_${selectedEmployeeData?.name || 'Employee'}_${selectedMonth}.csv`}
          >
            <Button colorScheme="teal">Export to CSV</Button>
          </CSVLink>
        </Box>
      </Flex>

      {/* Attendance Table */}
      {selectedEmployeeId && selectedMonth ? (
        <TableContainer maxHeight={'100vh'} overflowY="auto">
          <Table variant="striped" colorScheme="teal">
            <Thead id='head-fixed'>
              <Tr>
                <Th>Sno.</Th>
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
              {daysInMonth.map((day, index) => {
                const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const attendance = getAttendanceForDate(formattedDate);

                const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => extractTime(log.checkIn)) || [];
                const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => extractTime(log.checkOut)) || [];
                const { formattedHours, deductedLunch } = getDailyHours(attendance, day);

                return (
                  <Tr key={day}>
                    <Td>{index + 1}</Td>
                    <Td id='col-fixed'>{selectedEmployeeData.name}</Td>
                    <Td>{selectedEmployeeData.employeeCode}</Td>
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

export default OfficeBoyEmplpoyeeMonthTable;
