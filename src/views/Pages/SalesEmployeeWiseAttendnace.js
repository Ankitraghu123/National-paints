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
import { CSVLink } from 'react-csv';
import { Button } from '@chakra-ui/react';

// Helper function to format time
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
};

// Helper function to extract time in HH:MM:SS AM/PM format
const extractTime = (isoString) => {
  const dateObject = new Date(isoString);
  let hours = dateObject.getUTCHours();
  const minutes = dateObject.getUTCMinutes();
  const seconds = dateObject.getUTCSeconds();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
};

const SalesMonthAttendanceTable = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'sales'&& !employee.delete);
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

      // Convert checkOut time to a Date object and compare with 3 PM in local time
      const checkOutTime = new Date(checkOut);
      const threePM = new Date(checkOutTime);
      threePM.setHours(15, 0, 0, 0); // Set 3:00 PM

      // Adjust for timezone if necessary
      const checkOutHours = checkOutTime.getHours();
      const threePMHours = threePM.getHours();

      if (!(checkIn && checkOut && checkOutHours < threePMHours)) {
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
            new Date(log.checkIn).toLocaleTimeString()
          ) || [];
        const checkOuts =
          attendance?.timeLogs.filter((log) => log.checkOut).map((log) =>
            new Date(log.checkOut).toLocaleTimeString()
          ) || [];

        return {
          'S. No.': index + 1,
          'Employee Name': selectedEmployeeData?.name,
          'Employee Code': selectedEmployeeData?.employeeCode,
          Date: formattedDate,
          In: checkIns.join(', ') || 'A',
          Out: checkOuts.join(', ') || (checkIns.length > 0 ? '-' : 'A'),
          Attendance: getAttendance(attendance),
        };
      });

      setTableData(csvData);
    }
  }, [selectedEmployeeId, selectedMonth, daysInMonth, attendanceData, selectedEmployeeData]);


  

  return (
    <Box p={8} mt={40} backgroundColor="white" borderRadius="8px">
      <Heading as="h2" size="lg" mb={6}>
        Sales Person Monthly Attendance
      </Heading>

      {/* Employee Selection */}
      <Flex  justifyContent={'space-between'} alignItems={'center'} gap={4}>
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
        
        <Box mt={4}>
            <CSVLink
              data={tableData}
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
                <Th>Daily Attendance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {daysInMonth.map((day, index) => {
                const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const attendance = getAttendanceForDate(formattedDate);

                // Extract check-in and check-out times
                const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => extractTime(log.checkIn)) || [];
                const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => extractTime(log.checkOut)) || [];

                return (
                  <Tr key={day}>
                    <Td>{index + 1}</Td>
                    <Td id='col-fixed'>{selectedEmployeeData?.name}</Td>
                    <Td>{selectedEmployeeData?.employeeCode}</Td>
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
