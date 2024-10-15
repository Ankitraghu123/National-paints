import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Button,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { allHoliday } from "features/Holiday/HolidaySlice";

const AttendanceTable = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");

  const employees = useSelector((state) => state.employee?.allEmployees);

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday());
  }, [dispatch]);

  

  useEffect(() => {
    const days = Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );
    setDaysInMonth(days);
  }, [year, month]);

  const isSunday = (date) => {
    return new Date(date).getDay() === 0;
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal);
    const minutes = Math.round((totalHoursDecimal - hours) * 60);
    return `${hours} : ${minutes}`;
  };

  const calculateTotalHours = (attendanceRecords) => {
    const totalHoursDecimal = daysInMonth.reduce((total, day) => {
      const currentDate = new Date(year, month, day);
      const attendanceRecord = attendanceRecords.find((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getDate() === currentDate.getDate() &&
          recordDate.getFullYear() === currentDate.getFullYear() &&
          recordDate.getMonth() === currentDate.getMonth()
        );
      });
      const hoursForDay = attendanceRecord ? attendanceRecord.totalHours : 0;
      const overtimeHours =
        attendanceRecord && attendanceRecord.checkIn && attendanceRecord.checkOut
          ? calculateOvertime(attendanceRecord.checkIn, attendanceRecord.checkOut)
          : 0;

      if (isSunday(day)) {
        return total + 8 + overtimeHours; // 8 hours for Sunday plus overtime
      }

      return total + hoursForDay + overtimeHours;
    }, 0);

    return formatHours(totalHoursDecimal);
  };

  const calculateOvertime = (checkIn, checkOut) => {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const diffInHours =
      (checkOutTime - checkInTime) / (1000 * 60 * 60);
    return diffInHours > 8 ? diffInHours - 8 : 0;
  };

  const calculateDailySalary = (monthlySalary, hours, daysInMonth) => {
    if (!hours || !hours.includes(':')) {
      console.error("Invalid hours format:", hours);
      return 0; // Return a fallback value like 0 in case of invalid input
    }

    const salaryPerMinute = monthlySalary / (daysInMonth * 8 * 60);
    const [hourPart, minutePart] = hours.split(':').map(Number);
    const totalMinutes = (hourPart || 0) * 60 + (minutePart || 0); // Default to 0 if NaN
    const totalSalary = salaryPerMinute * totalMinutes;

    return parseFloat(totalSalary.toFixed(2));
  };

  const getDailyHours = (attendanceRecord) => {
    const selectedDayOfWeek = new Date(selectedDate).getDay();
    if (!attendanceRecord) return {
      formattedHours : selectedDayOfWeek === 0 ? formatHours(8) : "0 : 0"
    }

    const hoursForDay = attendanceRecord.totalHours || 0;
    const overtimeHours =
      attendanceRecord.checkIn && attendanceRecord.checkOut
        ? calculateOvertime(attendanceRecord.checkIn, attendanceRecord.checkOut)
        : 0;

    let totalDailyHours = hoursForDay + overtimeHours;

    // Calculate lunch deduction
    let shouldDeductLunch = false;

    // Check for lunch deduction based on attendance logs
    for (let i = 0; i < attendanceRecord.timeLogs.length; i++) {
      const checkInTime = new Date(attendanceRecord.timeLogs[i].checkIn);
      const checkOutTime = new Date(attendanceRecord.timeLogs[i].checkOut);

      // Check if lunch deduction should apply
      if (checkInTime.getHours() < 13 && checkOutTime.getHours() > 14) {
        shouldDeductLunch = true;
        break; // No need to check further if lunch deduction already applies
      }
    }

    // Deduct lunch time if applicable
    if (shouldDeductLunch) {
      totalDailyHours -= 0.5; // Deduct 30 minutes (0.5 hours)
    }

    
  if (selectedDayOfWeek === 0) {
    totalDailyHours += 8; // Add 8 hours if it's Sunday
  }

    return {
      formattedHours: formatHours(totalDailyHours),
      deductedLunch: shouldDeductLunch ? "Yes" : "No"
    };
  };

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = employees
    ?.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      {/* Year and Month Selection */}
      

      {/* Date Selection */}
      <Flex justifyContent={'space-between'}>
      <Box width={'48%'} mb={4}>
        <Text mb={2}>Select Date:</Text>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Box>

      {/* Search Bar */}
      <Box width={'48%'} mb={4}>
        <Text mb={2}>Search by Employee Name:</Text>
        <Input
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      </Flex>

      {/* Entries per page selection */}
      <Box mb={4}>
        <Text mb={2}>Entries per page:</Text>
        <Select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          width="150px"
        >
          {[50,75,100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>

      {/* Attendance Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>In</Th>
              <Th>Out</Th>
              <Th>Lunch Deducted</Th>
              <Th>{new Date(selectedDate).getDate()} (Today's Working Hours) {new Date(selectedDate).getDay()  == 0 ? "Sunday" : ''}</Th>
            </Tr>
          </Thead>
          <Tbody>
  {currentEmployees?.map((employee) => {
    const attendanceRecord = employee.attendanceTime.find((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === new Date(selectedDate).getDate() &&
        recordDate.getFullYear() === new Date(selectedDate).getFullYear() &&
        recordDate.getMonth() === new Date(selectedDate).getMonth()
      );
    });

    const {formattedHours,deductedLunch} = getDailyHours(attendanceRecord);

    return (
      <Tr key={employee._id}>
        <Td>{employee.name}</Td>
       
        <Td>
          {attendanceRecord && attendanceRecord.timeLogs.length > 0 ? (
            attendanceRecord.timeLogs.map((log, index) => (
              <Text key={index}>
                {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            ))
          ) : (
            "A"
          )}
        </Td>
        <Td>
          {attendanceRecord && attendanceRecord.timeLogs.length > 0 ? (
            attendanceRecord.timeLogs.map((log, index) => (
              <Text key={index}>
                {new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            ))
          ) : (
            "A"
          )}
        </Td>
       
        <Td>
          {deductedLunch ? deductedLunch : "No"}
        </Td>
        <Td>{formattedHours}
        </Td>
      </Tr>
    );
  })}
</Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable;
