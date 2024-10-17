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

const StaffMonthAttendanceTable = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'staff');
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


  let consecutiveLateDays = 0
  const getAttendance = (attendanceRecord) => {
    // Check if there are timeLogs and at least one checkIn
    if (attendanceRecord?.timeLogs?.length > 0) {
        const { checkIn, checkOut } = attendanceRecord.timeLogs[0];

        const checkInTime = new Date(checkIn);
        const checkOutTime = new Date(checkOut);

        const tenAM = new Date(checkInTime);
        tenAM.setHours(10, 0, 0, 0);

        const threePM = new Date(checkOutTime);
        threePM.setHours(15, 0, 0, 0); // Set 3:00 PM

        const isLate = checkInTime > tenAM;

        if (isLate) {
            consecutiveLateDays++;
        } else {
            consecutiveLateDays = 0;
        }

        if (consecutiveLateDays >= 3) {
            return "Half day";
        }

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


const calculateTotalDays = (attendanceRecords) => {
    let totalDaysWorked = 0; // Total days worked
    let totalHalfDays = 0; // Count for half days
    let totalAbsences = 0; // Count for absences
    let consecutiveLateDays = 0; // Track consecutive late check-ins
    
    // Define 10 AM for checking late arrivals
    const tenAM = new Date();
    tenAM.setHours(10, 0, 0, 0);
    
    daysInMonth.forEach((day) => {
        const currentDate = new Date(year, month, day);
        
        const attendanceRecord = attendanceRecords.find((record) => {
            const recordDate = new Date(record.date);
            return (
                recordDate.getDate() === currentDate.getDate() &&
                recordDate.getFullYear() === currentDate.getFullYear() &&
                recordDate.getMonth() === currentDate.getMonth()
            );
        });

        if (attendanceRecord && attendanceRecord.timeLogs.length > 0) {
            const checkInTime = new Date(attendanceRecord.timeLogs[0].checkIn);
            const checkOutTime = new Date(attendanceRecord.timeLogs[0].checkOut);
            
            const threePM = new Date(checkOutTime);
            threePM.setHours(15, 0, 0, 0); // Set 3 PM for checkout comparison

            // Check if employee checked in late (after 10 AM)
            const isLate = checkInTime > tenAM;

            if (isLate) {
                consecutiveLateDays++; // Increment late count if late
            } else {
                consecutiveLateDays = 0; // Reset if on time
            }

            // If it's the third consecutive late day, mark as half day
            if (consecutiveLateDays >= 3) {
                totalHalfDays++; // Count as half day on the third consecutive late
                consecutiveLateDays = 0; // Reset consecutive late days after half day
            } else if (checkOutTime < threePM) {
                totalHalfDays++; // Count as half day based on check-out time
            } else {
                totalDaysWorked += 1; // Count as full day otherwise
            }
        } else {
            totalAbsences++; // Count as absence if no time logs
        }

        // If it's Sunday or a holiday, count as a full day worked
        if (isSunday(day) || isHoliday(day)) {
            totalDaysWorked += 1;
        }
    });

    // Add half days to total days worked (half days count as 0.5)
    totalDaysWorked += totalHalfDays * 0.5;

    return totalDaysWorked.toFixed(1); // Return total days worked as a string
};
  

  return (
    <Box p={8} mt={20} backgroundColor="white" borderRadius="8px">
      <Heading as="h2" size="lg" mb={6}>
        Staff Monthly Attendance
      </Heading>

      {/* Employee Selection */}
      <Flex  justifyContent={'space-between'}>
      <Box width={'48%'} mb={4}>
        <Text mb={2}>Select Staff Person:</Text>
        <Select placeholder="Select Staff Person" onChange={ handleEmployeeChange}>
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

export default StaffMonthAttendanceTable;
