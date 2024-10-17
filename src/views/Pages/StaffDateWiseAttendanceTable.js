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

const StaffDateWiseAttendanceTable = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");

  const allEmployees = useSelector((state) => state.employee?.allEmployees);

  const employees = allEmployees?.filter((employee) => employee.empType === 'staff');

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
              {/* <Th>Lunch Deducted</Th> */}
              <Th>{new Date(selectedDate).getDate()} (Today's Attendnace) {new Date(selectedDate).getDay()  == 0 ? "Sunday" : ''}</Th>
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
       
        <Td>{getAttendance(attendanceRecord)}
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

export default StaffDateWiseAttendanceTable;
