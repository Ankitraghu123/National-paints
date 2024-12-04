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

const GuardEmployeeWiseMonthTable = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'guard' && !employee.delete);
  const attendanceData = useSelector((state) => state.employee?.employeeAttendnace);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployeeData, setSelectedEmployeeData] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [tableData, setTableData] = useState([]); // For CSV export

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

  // Function to extract and format time in AM/PM
  const extractTime = (isoString) => {
    const dateObject = new Date(isoString);
    let hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Prepare data for CSV export
  const csvHeaders = [
    { label: "S. No.", key: "serialNumber" },
    { label: "Employee Name", key: "employeeName" },
    { label: "Employee Code", key: "employeeCode" },
    { label: "Date", key: "date" },
    { label: "In", key: "in" },
    { label: "Out", key: "out" },
    { label: "Lunch Deducted", key: "lunchDeducted" },
    { label: "Total Hours", key: "totalHours" },
  ];
  useEffect(() => {
    if (selectedEmployeeId && selectedMonth) {
      const csvData = daysInMonth.map((day, index) => {
        const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(
          new Date(selectedMonth).getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const attendance = getAttendanceForDate(formattedDate);
        const checkIns =
          attendance?.timeLogs.filter((log) => log.checkIn).map((log) =>
            extractTime(log.checkIn)
          ) || [];
        const checkOuts =
          attendance?.timeLogs.filter((log) => log.checkOut).map((log) =>
            extractTime(log.checkOut)
          ) || [];
        const { formattedHours, deductedLunch } = getDailyHours(attendance, day);

        return {
          serialNumber: index + 1,
          employeeName: selectedEmployeeData?.name,
          employeeCode: selectedEmployeeData?.employeeCode,
          date: formattedDate,
          in: checkIns.join(', ') || 'A',
          out: checkOuts.join(', ') || (checkIns.length > 0 ? '-' : 'A'),
          lunchDeducted: deductedLunch,
          totalHours: formattedHours,
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

  const roundMinutes = (minutes) => {
    if (minutes <= 14) return 0;
    else if (minutes <= 29) return 15;
    else if (minutes <= 44) return 30;
    else return 45;
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal); // Whole hours
    const rawMinutes = (totalHoursDecimal - hours) * 60;
    const minutes = roundMinutes(Math.round(rawMinutes)); // Convert decimal to minutes
    return `${hours} : ${minutes}`;  // Format as required
  };

  const isSunday = (day) => {
    const selectedDate = new Date(`${selectedMonth}-${day.toString().padStart(2, '0')}`);
    return selectedDate.getDay() === 0; 
  };

  const getDailyHours = (attendanceRecord, day) => {
    const isCurrentDaySunday = isSunday(day);

    if (!attendanceRecord) return { formattedHours: isCurrentDaySunday ? formatHours(12) : "0:00", deductedLunch: "No" };

    const hoursForDay = attendanceRecord.totalHours || 0;
    let totalDailyHours = hoursForDay;

    // Check for lunch deduction
    const shouldDeductLunch = attendanceRecord.timeLogs.some(log => {
      const checkInTime = new Date(log.checkIn);
      const checkOutTime = new Date(log.checkOut);
      return checkInTime.getUTCHours() < 13 && checkOutTime.getUTCHours() > 14;
    });

    if (shouldDeductLunch) {
      totalDailyHours -= 0.5; // Deduct 30 minutes (0.5 hours)
    }

    // If it's Sunday, add 12 hours to the total
    if (isCurrentDaySunday) {
      totalDailyHours += 12;
    }

    return {
      formattedHours: formatHours(totalDailyHours),
      deductedLunch: shouldDeductLunch ? "Yes" : "No",
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
        Guard Monthly Attendance
      </Heading>

      {/* Employee Selection */}
      <Flex  justifyContent={'space-between'} alignItems={'center'} gap={4}>
      <Box width={'412%'} mb={4}>
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
      <Box width={'412%'} mb={4}>
        <Text mb={2}>Select Month:</Text>
        <Input type="month" onChange={handleMonthChange} />
      </Box>
      {/* CSV Export Button */}
      <Box mt={4}>
        <CSVLink
            data={tableData}
            headers={csvHeaders}
          filename={`Attendance_${selectedEmployeeData?.name || 'Employee'}_${selectedMonth}.csv`}
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
                <Th>S. No.</Th>
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
                const dailySalary = attendance ? calculateDailySalary(attendance, daysInMonth) : "A";

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

export default GuardEmployeeWiseMonthTable;
