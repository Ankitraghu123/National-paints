import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee } from 'features/Employee/EmployeeSlice';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, HStack,
  Select,
  Input,
  Flex,
} from '@chakra-ui/react';
import { checkOut, checkIn } from 'features/Attendance/AttendanceSlice';
import { getUnpaidEmployees } from 'features/Employee/EmployeeSlice';

const AllEmployee = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector(state => state.employee?.allEmployees);
  const unpaidEmployees = useSelector(state => state.employee?.unpaidEmployees);
  const { checkedIn, checkedOut } = useSelector(state => state.attendance);
  const [time, setTime] = useState({}); 
  const [sharedDate, setSharedDate] = useState(new Date().toISOString().split('T')[0]); // Single date for all employees
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50); 

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(getUnpaidEmployees());
  }, [dispatch, checkedIn, checkedOut]);

  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  };

  const { start: monthStart, end: monthEnd } = getCurrentMonthRange();

  const combineDateWithTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date; 
  };

  const handleTimeChange = (empId, value) => {
    setTime(prev => ({ ...prev, [empId]: value }));
  };

  // Update shared date
  const handleSharedDateChange = (value) => {
    setSharedDate(value);
  };

  const handleCheckIn = (empId) => {
    const selectedTime = time[empId] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateWithTime = combineDateWithTime(sharedDate, selectedTime);
    dispatch(checkIn({ empId, setTime: dateWithTime.toISOString() }));
  };

  const handleCheckOut = (empId) => {
    const selectedTime = time[empId] || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateWithTime = combineDateWithTime(sharedDate, selectedTime);
    dispatch(checkOut({ empId, setTime: dateWithTime.toISOString() }));
  };

  const combinedEmployees = [
    ...(allEmployees || []),
    ...(unpaidEmployees || [])
  ];

  const filteredEmployees = combinedEmployees?.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.empType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * entriesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
  const currentEmployees = filteredEmployees?.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalEntries = allEmployees?.length || 0;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const hasCheckedInToday = (emp) => {
    return emp.attendanceTime?.some(attendance => {
      const attendanceDate = attendance.date; 
      const timeLogs = attendance.timeLogs || [];
      return attendanceDate.split('T')[0] === sharedDate && timeLogs.some(log => log.checkIn);
    }) || false;
  };

  const hasCheckedOutToday = (emp) => {
    return emp.attendanceTime?.some(attendance => {
      const attendanceDate = attendance.date; 
      const timeLogs = attendance.timeLogs || [];
      return attendanceDate.split('T')[0] === sharedDate && timeLogs.some(log => log.checkOut);
    }) || false;
  };

  return (
    <Box p={8} mt={100} backgroundColor={'white'} borderRadius={'30px'}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Employee Table</Text>

      {/* Shared Date Input */}
      <Flex mb={4}>
        <Input
          type="date"
          value={sharedDate}
          min={monthStart}
          max={monthEnd}
          onChange={(e) => handleSharedDateChange(e.target.value)}
        />
      </Flex>

      {/* Search Bar  */}
      <Flex justifyContent={'space-between'} alignItems={'center'} id='emp-flex'>
        <Box mb={4} width={'50%'} id='emp-search'>
          <Input
            placeholder="Search.... "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={4}
          />
        </Box>

        {/* Entries per page selector */}
        <Box mb={4}>
          <Select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            {[50, 75, 100].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        </Box>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((employee) => (
              <Tr key={employee._id}>
                <Td>{employee.name}</Td>
                <Td>{employee.empType}</Td>
                <Td>
                  <Input
                    type="date"
                    value={sharedDate} // Using shared date for all employees
                    isReadOnly // Make it read-only
                  />
                </Td>
                <Td>
                  <input
                    type="time"
                    value={time[employee._id] || ""}
                    onChange={(e) => handleTimeChange(employee._id, e.target.value)}
                    step="600" // 10 minutes interval
                  />
                </Td>
                <Td>
                  <Button colorScheme='green' onClick={() => handleCheckIn(employee._id)} isDisabled={hasCheckedInToday(employee)}>In</Button>
                  <Button colorScheme='red' onClick={() => handleCheckOut(employee._id)} isDisabled={hasCheckedOutToday(employee)}>Out</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

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

export default AllEmployee;
