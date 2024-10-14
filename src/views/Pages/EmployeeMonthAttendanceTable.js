// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Select,
//   Input,
//   Table,
//   Thead,
//   Tr,
//   Th,
//   Tbody,
//   TableContainer,
//   Text,
//   Heading,
//   Td,
// } from '@chakra-ui/react';
// import { useDispatch, useSelector } from 'react-redux';
// import { allEmployee, getEmployeeAttendance } from 'features/Employee/EmployeeSlice';

// const EmployeeMonthAttendanceTable = () => {
//   const dispatch = useDispatch();
//   const employees = useSelector((state) => state.employee?.allEmployees);
//   const attendanceData = useSelector((state) => state.employee?.employeeAttendnace);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [daysInMonth, setDaysInMonth] = useState([]);

//   useEffect(() => {
//     dispatch(allEmployee());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedEmployeeId && selectedMonth) {
//       dispatch(getEmployeeAttendance({ id: selectedEmployeeId, month: selectedMonth }));
//     }
//   }, [selectedEmployeeId, selectedMonth, dispatch]);

//   useEffect(() => {
//     if (selectedMonth) {
//       const month = new Date(selectedMonth).getMonth() + 1;
//       const year = new Date(selectedMonth).getFullYear();
//       const days = new Date(year, month, 0).getDate();
//       const daysArray = Array.from({ length: days }, (_, i) => i + 1);
//       setDaysInMonth(daysArray);
//     }
//   }, [selectedMonth]);

//   const handleEmployeeChange = (e) => setSelectedEmployeeId(e.target.value);
//   const handleMonthChange = (e) => setSelectedMonth(e.target.value);

//   const getAttendanceForDate = (date) => {
//     return attendanceData ? attendanceData.find(att => {
//       return att.date === date;
//     }) : null;
//   };

//   const isSunday = (date) => {
//     const fullDate = new Date(new Date(selectedMonth).getFullYear(), new Date(selectedMonth).getMonth(), date);
//     return fullDate.getDay() === 0; // Sunday is 0
//   };

//   const formatHours = (totalHoursDecimal) => {
//     const hours = Math.floor(totalHoursDecimal);
//     const minutes = Math.round((totalHoursDecimal - hours) * 60);
//     return `${hours}:${minutes.toString().padStart(2, '0')}`;
//   };

//   const getDailyHours = (attendanceRecord, day) => {
//     const isCurrentDaySunday = isSunday(day);
    
//     if (!attendanceRecord) return isCurrentDaySunday ? formatHours(8) : "0:00";
    
//     const hoursForDay = attendanceRecord.totalHours || 0;
//     let totalDailyHours = hoursForDay;

//     const shouldDeductLunch = attendanceRecord.timeLogs.some(log => {
//       const checkInTime = new Date(log.checkIn);
//       const checkOutTime = new Date(log.checkOut);
//       return checkInTime.getHours() < 13 && checkOutTime.getHours() > 14;
//     });

//     if (shouldDeductLunch) {
//       totalDailyHours -= 0.5; // Deduct 30 minutes (0.5 hours)
//     }

//     return formatHours(isCurrentDaySunday ? totalDailyHours + 8 : totalDailyHours);
//   };

//   const calculateDailySalary = (attendance) => {
//     const monthlySalary = 10000; // Monthly salary
//     const totalHours = attendance.totalHours;

//     // Convert total hours to minutes
//     console.log(totalHours)
//     const totalMinutes = totalHours * 60;

//     // Calculate the total number of working minutes in a month (assuming 30 days)
//     const totalWorkingDays = 31; // or whatever your working days are in a month
//     const workingHoursPerDay = 8; // Assuming 8 working hours in a day
//     const workingMinutesPerDay = workingHoursPerDay * 60;
//     const totalWorkingMinutesInMonth = totalWorkingDays * workingMinutesPerDay;

//     // Calculate salary per minute
//     const salaryPerMinute = monthlySalary / totalWorkingMinutesInMonth;

//     // Calculate salary for today
//     const salaryForToday = totalMinutes * salaryPerMinute;

//     return salaryForToday.toFixed(2); // Return salary formatted to 2 decimal places
// };

//   return (
//     <Box p={8} mt={4} backgroundColor="white" borderRadius="8px">
//       <Heading as="h2" size="lg" mb={6}>
//         Employee Monthly Attendance
//       </Heading>

//       <Box mb={4}>
//         <Text mb={2}>Select Employee:</Text>
//         <Select placeholder="Select employee" onChange={handleEmployeeChange}>
//           {employees?.map((employee) => (
//             <option key={employee._id} value={employee._id}>
//               {employee.name}
//             </option>
//           ))}
//         </Select>
//       </Box>

//       <Box mb={4}>
//         <Text mb={2}>Select Month:</Text>
//         <Input type="month" onChange={handleMonthChange} />
//       </Box>

//       {selectedEmployeeId && selectedMonth ? (
//         <TableContainer>
//           <Table variant="striped" colorScheme="teal">
//             <Thead>
//               <Tr>
//                 <Th>Date</Th>
//                 <Th>In</Th>
//                 <Th>Out</Th>
//                 <Th>Total Hours</Th>
//                 <Th>Lunch Deducted</Th>
//                 <Th>Daily Salary</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {daysInMonth.map((day) => {
//                 const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//                 const attendance = getAttendanceForDate(formattedDate);

//                 const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => new Date(log.checkIn).toLocaleTimeString()) || [];
//                 const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => new Date(log.checkOut).toLocaleTimeString()) || [];
//                 const dailySalary = attendance ? calculateDailySalary(getDailyHours(attendance,day)) : "N/A";

//                 return (
//                   <Tr key={day}>
//                     <Td>{formattedDate}</Td>
//                     <Td>
//                       {checkIns.length > 0 ? (
//                         checkIns.map((checkIn, index) => (
//                           <div key={index}>{checkIn}</div>
//                         ))
//                       ) : (
//                         'N/A'
//                       )}
//                     </Td>
//                     <Td>
//                       {checkOuts.length > 0 ? (
//                         checkOuts.map((checkOut, index) => (
//                           <div key={index}>{checkOut}</div>
//                         ))
//                       ) : (
//                         (checkIns.length > 0 ? '-' : 'N/A')
//                       )}
//                     </Td>
//                     <Td>{getDailyHours(attendance, day)}</Td>
//                     <Td>{attendance ? (attendance.timeLogs.length > 0 ? "Yes" : "No") : "N/A"}</Td>
//                     <Td>{dailySalary}</Td>
//                   </Tr>
//                 );
//               })}
//             </Tbody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Text>Please select an employee and a month to view attendance.</Text>
//       )}
//     </Box>
//   );
// };

// export default EmployeeMonthAttendanceTable;




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
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee, getEmployeeAttendance } from 'features/Employee/EmployeeSlice';

const EmployeeMonthAttendanceTable = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee?.allEmployees);
  const attendanceData = useSelector((state) => state.employee?.employeeAttendnace);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
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

  const isSunday = (date) => {
    // return new Date(selectedMonth).getFullYear(), new Date(selectedMonth).getMonth(), date.getDate().getDay() === 0; // Sunday is 0
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal); // Whole hours
    const minutes = Math.round((totalHoursDecimal - hours) * 60); // Convert decimal to minutes
    return `${hours}:${minutes.toString().padStart(2, '0')}`; // Format as required
  };

  const calculateOvertime = (checkIn, checkOut) => {
    // Calculate overtime logic here
  };

  const getDailyHours = (attendanceRecord, day) => {
    const isCurrentDaySunday = isSunday(day);
    
    if (!attendanceRecord) return isCurrentDaySunday ? formatHours(8) : "0:00";
    
    const hoursForDay = attendanceRecord.totalHours || 0;
    let totalDailyHours = hoursForDay;
  
    // Check for lunch deduction
    const shouldDeductLunch = attendanceRecord.timeLogs.some(log => {
      const checkInTime = new Date(log.checkIn);
      const checkOutTime = new Date(log.checkOut);
      return checkInTime.getHours() < 13 && checkOutTime.getHours() > 14;
    });
  
    if (shouldDeductLunch) {
      totalDailyHours -= 0.5; // Deduct 30 minutes (0.5 hours)
    }
  
    return formatHours(isCurrentDaySunday ? totalDailyHours + 8 : totalDailyHours);
  };
  

  const calculateDailySalary = (attendanceRecord, daysInMonth) => {
    const monthlySalary = 10000; // Monthly salary
    const workingDaysInMonth = daysInMonth.length; // Number of days in the month
    const dailySalary = monthlySalary / workingDaysInMonth; // Daily salary
    
    // Assuming totalHours is in decimal format (e.g., 8.5 for 8 hours and 30 minutes)
    const totalHours = attendanceRecord.totalHours || 0;
    
    // Calculate total minutes worked
    const workedMinutes = totalHours * 60; // Convert hours to minutes
    console.log(totalHours)
    // Calculate hourly rate from daily salary
    const hourlyRate = dailySalary / 8 ; // Assuming 8 working hours
  
    // Calculate the salary for the current day
    const salaryForToday = (workedMinutes / 60) * hourlyRate; // Convert worked minutes back to hours for salary calculation
  
    return salaryForToday.toFixed(2); // Return salary formatted to 2 decimal places
  };

  return (
    <Box p={8} mt={20} backgroundColor="white" borderRadius="8px">
      <Heading as="h2" size="lg" mb={6}>
        Employee Monthly Attendance
      </Heading>

      {/* Employee Selection */}
      <Box mb={4}>
        <Text mb={2}>Select Employee:</Text>
        <Select placeholder="Select employee" onChange={handleEmployeeChange}>
          {employees?.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </Select>
      </Box>

      {/* Month Selection */}
      <Box mb={4}>
        <Text mb={2}>Select Month:</Text>
        <Input type="month" onChange={handleMonthChange} />
      </Box>

      {/* Attendance Table */}
      {selectedEmployeeId && selectedMonth ? (
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>In</Th>
                <Th>Out</Th>
                <Th>Total Hours</Th>
                {/* <Th>Lunch Deducted</Th> */}
                {/* <Th>Daily Salary</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {daysInMonth.map((day) => {
                const formattedDate = `${new Date(selectedMonth).getFullYear()}-${(new Date(selectedMonth).getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const attendance = getAttendanceForDate(formattedDate);

                // Extract check-in and check-out times
                const checkIns = attendance?.timeLogs.filter(log => log.checkIn).map(log => new Date(log.checkIn).toLocaleTimeString()) || [];
                const checkOuts = attendance?.timeLogs.filter(log => log.checkOut).map(log => new Date(log.checkOut).toLocaleTimeString()) || [];
                const dailySalary = attendance ? calculateDailySalary(attendance, daysInMonth) : "N/A";

                return (
                  <Tr key={day}>
                    <Td>{formattedDate}</Td>
                    <Td>
                      {checkIns.length > 0 ? (
                        checkIns.map((checkIn, index) => (
                          <div key={index}>{checkIn}</div>
                        ))
                      ) : (
                        'N/A'
                      )}
                    </Td>
                    <Td>
                      {checkOuts.length > 0 ? (
                        checkOuts.map((checkOut, index) => (
                          <div key={index}>{checkOut}</div>
                        ))
                      ) : (
                        (checkIns.length > 0 ? '-' : 'N/A')
                      )}
                    </Td>
                    <Td>{getDailyHours(attendance, day)}</Td>
                    <Td>Yes</Td>

                    {/* <Td>{attendance && isSunday(day) ? 'Yes' : 'No'}</Td> */}
                    {/* <Td>{dailySalary}</Td> */}
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

