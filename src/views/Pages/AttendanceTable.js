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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";

const AttendanceTable = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5); // Default entries per page

  const employees = useSelector((state) => state.employee?.allEmployees);

  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch]);

  useEffect(() => {
    const days = Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );
    setDaysInMonth(days);
  }, [year, month]);

  const isSunday = (date) => {
    return new Date(year, month, date).getDay() === 0; // Sunday is 0
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal); // Whole hours
    const minutes = Math.round((totalHoursDecimal - hours) * 60); // Convert decimal to minutes
    return `${hours} : ${minutes}`; // Format as required
  };

  const calculateTotalHours = (attendanceRecords) => {
    const totalHoursDecimal = daysInMonth.reduce((total, day) => {
      // Find the attendance record for the specific day
      const attendanceRecord = attendanceRecords.find((record) => {
        const recordDate = new Date(record.date).getDate();
        return (
          recordDate === day &&
          new Date(record.date).getFullYear() === year &&
          new Date(record.date).getMonth() === month
        );
      });

      // Calculate hours for the day
      const hoursForDay = attendanceRecord
        ? attendanceRecord.totalHours // Assuming you have this field for regular hours
        : 0;

      // Calculate overtime (check-in and check-out)
      const overtimeHours =
        attendanceRecord && attendanceRecord.checkIn && attendanceRecord.checkOut
          ? calculateOvertime(
              attendanceRecord.checkIn,
              attendanceRecord.checkOut
            )
          : 0;

      // For Sundays, default to 8 hours plus any overtime
      if (isSunday(day)) {
        return total + 8 + overtimeHours; // 8 hours for Sunday plus overtime
      }

      return total + hoursForDay + overtimeHours; // For other days, add regular and overtime hours
    }, 0);

    return formatHours(totalHoursDecimal); // Format total hours for display
  };

  const calculateOvertime = (checkIn, checkOut) => {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const diffInHours =
      (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert milliseconds to hours
    return diffInHours > 8 ? diffInHours - 8 : 0; // Overtime if more than 8 hours
  };

  const getDailyHours = (attendanceRecord) => {
    if (!attendanceRecord) return "0 : 0"; // If no record, return default

    const hoursForDay = attendanceRecord.totalHours || 0;
    const overtimeHours =
      attendanceRecord.checkIn && attendanceRecord.checkOut
        ? calculateOvertime(attendanceRecord.checkIn, attendanceRecord.checkOut)
        : 0;

    const totalDailyHours = hoursForDay + overtimeHours;

    return formatHours(totalDailyHours); // Format daily hours for display
  };

  // Calculate total pages
  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  
  // Get current employees based on pagination
  const currentEmployees = employees?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <Box p={8} mt={100} backgroundColor={'white'} borderRadius={'30px'}>
      {/* Year and Month Selection */}
      <Box display="flex" alignItems="center" gap={4} mb={4}>
        <Box>
          <Text mb={2}>Year:</Text>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="2000"
            max="2100"
            width="100px"
          />
        </Box>
        <Box>
          <Text mb={2}>Month:</Text>
          <Select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            width="150px"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Entries per page selection */}
      <Box mb={4}>
        <Text mb={2}>Entries per page:</Text>
        <Select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          width="150px"
        >
          {[5, 10, 15, 20].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
      </Box>

      {/* Attendance Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              {daysInMonth.map((day) => (
                <Th key={day} style={isSunday(day) ? { color: 'red' } : {}}>{day} {isSunday(day) ? '(Sun)' : ''}</Th>
              ))}
              <Th>Total Hours</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((employee) => (
              <Tr key={employee._id}>
                <Td>{employee.name}</Td>
                {daysInMonth.map((day) => {
                  const attendanceRecord = employee.attendanceTime.find(
                    (record) => {
                      const recordDate = new Date(record.date).getDate();
                      return (
                        recordDate === day &&
                        new Date(record.date).getFullYear() === year &&
                        new Date(record.date).getMonth() === month
                      );
                    }
                  );

                  // Check if it's Sunday
                  const isCurrentDaySunday = isSunday(day);

                  return (
                    <Td key={day} style={isCurrentDaySunday ? { color: 'red' } : {}}>
                      {/* Show 8 hours for Sundays with no attendance record, otherwise show attendance record's total hours */}
                      {isCurrentDaySunday && !attendanceRecord
                        ? formatHours(8) // Show default hours for Sunday
                        : getDailyHours(attendanceRecord)}
                    </Td>
                  );
                })}
                <Td>
                  {calculateTotalHours(employee.attendanceTime)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <HStack justifyContent="space-between" mt={4}>
        <Button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default AttendanceTable;
