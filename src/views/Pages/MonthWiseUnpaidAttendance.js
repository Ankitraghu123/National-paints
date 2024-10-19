import React, { useState, useEffect } from 'react';
import {
  Box,
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
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee, getEmployeeAttendance } from 'features/Employee/EmployeeSlice';
import { useParams } from 'react-router-dom';

const MonthWiseUnpaidAttendance = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the employee ID from the URL parameters
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'labour');
  const attendanceData = useSelector((state) => state.employee?.employeeAttendnace);

  // Set the current month as the default selected month
  const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in YYYY-MM format
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Fetch all employees when the component mounts
  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch]);

  // Fetch attendance data for the selected employee and month
  useEffect(() => {
    if (id && selectedMonth) {
      dispatch(getEmployeeAttendance({ id, month: selectedMonth }));
    }
  }, [id, selectedMonth, dispatch]);

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

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  // Function to get attendance data for a specific date
  const getAttendanceForDate = (date) => {
    return attendanceData ? attendanceData.find(att => att.date === date) : null;
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal);
    const minutes = Math.round((totalHoursDecimal - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const isSunday = (day) => {
    const selectedDate = new Date(`${selectedMonth}-${day.toString().padStart(2, '0')}`);
    return selectedDate.getDay() === 0; 
  };

  const getDailyHours = (attendanceRecord, day) => {
    if (!attendanceRecord) return { formattedHours: isSunday(day) ? formatHours(8) : "0:00" };

    const hoursForDay = attendanceRecord.totalHours || 0;
    let totalDailyHours = hoursForDay;

    // If it's Sunday, add 8 hours to the total
    if (isSunday(day)) {
      totalDailyHours += 8;
    }

    return {
      formattedHours: formatHours(totalDailyHours),
    };
  };

  const calculateDailySalary = (attendanceRecord, daysInMonth) => {
    const monthlySalary = 10000; // Monthly salary
    const workingDaysInMonth = daysInMonth.length; // Number of days in the month
    const dailySalary = monthlySalary / workingDaysInMonth;

    const totalHours = attendanceRecord.totalHours || 0;
    const workedMinutes = totalHours * 60; // Convert hours to minutes
    const hourlyRate = dailySalary / 8; // Assuming 8 working hours

    const salaryForToday = (workedMinutes / 60) * hourlyRate;

    return salaryForToday.toFixed(2); // Return salary formatted to 2 decimal places
  };

  return (
    <Box p={8} mt={20} backgroundColor="white" borderRadius="8px">
      <Heading as="h2" size="lg" mb={6}>
        UnPaid Employee Attendance
      </Heading>

      {/* Month Selection */}
      <Flex justifyContent={'space-between'}>
        <Box width={'100%'} mb={4}>
          <Text mb={2}>Select Month:</Text>
          <Input type="month" value={selectedMonth} onChange={handleMonthChange} />
        </Box>
      </Flex>

      {/* Attendance Table */}
      {id && selectedMonth ? (
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>In</Th>
                <Th>Out</Th>
                <Th>Total Hours</Th>
              </Tr>
            </Thead>
            <Tbody>
              {daysInMonth.map((day) => {
                const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const attendance = getAttendanceForDate(formattedDate);

                // Extract check-in and check-out times
                const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => new Date(log.checkIn).toLocaleTimeString()) || [];
                const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => new Date(log.checkOut).toLocaleTimeString()) || [];
                const dailySalary = attendance ? calculateDailySalary(attendance, daysInMonth) : "A";

                const { formattedHours } = getDailyHours(attendance, day);

                return (
                  <Tr key={day}>
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
                    <Td>{formattedHours}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>Please select a month to view attendance.</Text>
      )}
    </Box>
  );
};

export default MonthWiseUnpaidAttendance;
