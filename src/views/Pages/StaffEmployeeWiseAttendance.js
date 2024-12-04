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
import { CSVLink } from 'react-csv';
import { allEmployee, getEmployeeAttendance } from 'features/Employee/EmployeeSlice';

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

const StaffEmployeeWiseAttendance = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter(
    (employee) => employee.empType === 'staff' && !employee.delete
  );
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

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);

    const selectedEmployee = employees.find((employee) => employee._id === employeeId);
    setSelectedEmployeeData(selectedEmployee || {});
  };
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  // Function to get attendance data for a specific date
  const getAttendanceForDate = (date) => {
    return attendanceData
      ? attendanceData.find((att) => {
          return att.date === date; // Ensure `att.date` is in 'YYYY-MM-DD' format
        })
      : null;
  };

  const isSunday = (day) => {
    const selectedDate = new Date(
      `${selectedMonth}-${day.toString().padStart(2, '0')}`
    );
    return selectedDate.getDay() === 0;
  };
  let consecutiveDailyLateDays = 0; 
  const getAttendance = (attendanceRecord) => {
    
    if (attendanceRecord?.timeLogs?.length > 0) {
      const { checkIn, checkOut } = attendanceRecord.timeLogs[0];

      // Convert checkOut time to a Date object and compare with 3 PM in local time
      let checkInDate = new Date(checkIn);
      let checkOutDate = new Date(checkOut);
      // Extract only the time part (HH:mm) from the checkIn and checkOut
      const checkInHour = checkInDate.getUTCHours();
      const checkOutHour = checkOutDate.getUTCHours()
    // console.log(checkIn)
      // Check if the employee is late

      const isLate = checkInHour > 10;
      if (isLate) {
        consecutiveDailyLateDays++;
      } else {
        consecutiveDailyLateDays = 0;
      }
        // console.log(checkInHour)
      // Show "Half day" option only if late for 3 consecutive days
      if (consecutiveDailyLateDays >= 3) {
        return !attendanceRecord.removeHalfDay ? "Half day" : "P";
      }
      if ((checkInHour <= 14 && checkOutHour <= 14) || checkInHour > 14) {
        return !attendanceRecord?.removeHalfDay ? "Half day" : "P";
      } else if (checkInHour <= 13) {
        return "P";
      }
  }
  
  if (!attendanceRecord?.removeDay) {
    return "P";
}

  return "A";
  };

  // Prepare data for CSV export
  const csvData = useMemo(() => {
    return daysInMonth.map((day, index) => {
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
        "S. No.": index + 1,
        "Employee Name": selectedEmployeeData?.name,
        "Employee Code": selectedEmployeeData?.employeeCode,
        Date: formattedDate,
        In: checkIns.join(', ') || 'A',
        Out: checkOuts.join(', ') || (checkIns.length > 0 ? '-' : 'A'),
        Attendance: getAttendance(attendance),
      };
    });
  }, [selectedEmployeeId, selectedMonth, daysInMonth, attendanceData, selectedEmployeeData]);

  return (
    <Box p={8} mt={40} backgroundColor="white" borderRadius="8px">
      <Heading as="h2" size="lg" mb={6}>
        Staff Monthly Attendance
      </Heading>
      {/* Employee and Month Selection */}
      <Flex justifyContent="space-between" alignItems={'center'} gap={4}>
        <Box width={'48%'} mb={4}>
          <Text mb={2}>Select Staff Person:</Text>
          <Select placeholder="Select Staff Person" onChange={handleEmployeeChange}>
            {employees?.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </Select>
        </Box>
        <Box width={'48%'} mb={4}>
          <Text mb={2}>Select Month:</Text>
          <Input type="month" onChange={handleMonthChange} />
        </Box>
        {/* CSV Export Button */}
        <Box mt={4}>
          <CSVLink
            data={csvData}
            filename={`Attendance_${selectedEmployeeData?.name || 'Employee'}_${selectedMonth}.csv`}
          >
            <Button colorScheme="teal">Export to CSV</Button>
          </CSVLink>
        </Box>
      </Flex>

      {/* Attendance Table */}
      {selectedEmployeeId && selectedMonth ? (
        <Box>
          <TableContainer>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>S. No.</Th>
                  <Th>Employee Name</Th>
                  <Th>Employee Code</Th>
                  <Th>Date</Th>
                  <Th>In</Th>
                  <Th>Out</Th>
                  <Th>Daily Attendance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {daysInMonth.map((day, idx) => {
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

                  return (
                    <Tr key={day}>
                      <Td>{idx + 1}</Td>
                      <Td>{selectedEmployeeData?.name}</Td>
                      <Td>{selectedEmployeeData?.employeeCode}</Td>
                      <Td>
                        {formattedDate} {isSunday(day) ? '(Sunday)' : ''}
                      </Td>
                      <Td>{checkIns.join(', ') || 'A'}</Td>
                      <Td>{checkOuts.join(', ') || (checkIns.length > 0 ? '-' : 'A')}</Td>
                      <Td>{getAttendance(attendance)}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Text>Please select an employee and a month to view attendance.</Text>
      )}
    </Box>
  );
};

export default StaffEmployeeWiseAttendance;
