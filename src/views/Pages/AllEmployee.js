import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee } from 'features/Employee/EmployeeSlice';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, HStack,
  Select,
  Input,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { checkOut, checkIn } from 'features/Attendance/AttendanceSlice';
import { getUnpaidEmployees } from 'features/Employee/EmployeeSlice';
import { guardCheckIn } from 'features/Attendance/AttendanceSlice';

const AllEmployee = () => {
  const dispatch = useDispatch();
  const employees = useSelector(state => state.employee?.allEmployees);
  const unpaidEmployees = useSelector(state => state.employee?.unpaidEmployees);
  const { checkedIn, checkedOut } = useSelector(state => state.attendance);
  const [inTime, setInTime] = useState({});
  const [outTime, setOutTime] = useState({});
  const [sharedDate, setSharedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [loading, setLoading] = useState({});

  const allEmployees = employees?.filter((employee) => !employee.delete);

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(getUnpaidEmployees());
  }, [dispatch, checkedIn, checkedOut]);

  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  };

  const { start: monthStart, end: monthEnd } = getCurrentMonthRange();

  const combineDateWithTime = (dateString, timeString) => {
    return `${dateString}T${timeString}:00.000Z`; // Keeps the exact time provided
  };
  

  const handleInTimeChange = (empId, value) => {
    setInTime(prev => ({ ...prev, [empId]: value }));
  };

  const handleOutTimeChange = (empId, value) => {
    setOutTime(prev => ({ ...prev, [empId]: value }));
  };

  const handleSharedDateChange = (value) => {
    setSharedDate(value);
  };

  const handleSave = async (empId, employee) => {
    const inTimeValue = inTime[empId];
    const outTimeValue = outTime[empId];
    setLoading(prev => ({ ...prev, [empId]: true })); // Set loading to true for the current employee
  
    try {
      if (inTimeValue) {
        const inDateWithTime = combineDateWithTime(sharedDate, inTimeValue);
  
        await (employee.empType === 'officeboy' || employee.empType === 'guard'
          ? dispatch(guardCheckIn({ empId, setTime: inDateWithTime }))
          : dispatch(checkIn({ empId, setTime: inDateWithTime })));
  
        if (outTimeValue) {
          const outDateWithTime = combineDateWithTime(sharedDate, outTimeValue);
          await dispatch(checkOut({ empId, setTime: outDateWithTime }));
        }
      } else if (outTimeValue) {
        const outDateWithTime = combineDateWithTime(sharedDate, outTimeValue);
        await dispatch(checkOut({ empId, setTime: outDateWithTime }));
      }
    } catch (error) {
      console.error("Error handling save:", error);
    } finally {
      setLoading(prev => ({ ...prev, [empId]: false })); // Set loading to false when action completes
    }
  };
  

  const combinedEmployees = [...(allEmployees || []), ...(unpaidEmployees || [])];

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

  const calculateTotalHours = (empId) => {
    const inTimeValue = inTime[empId];
    const outTimeValue = outTime[empId];

    if (inTimeValue && outTimeValue) {
      const inDateTime = new Date(`${sharedDate}T${inTimeValue}:00`);
      const outDateTime = new Date(`${sharedDate}T${outTimeValue}:00`);
      const diffInMs = outDateTime - inDateTime;
      const diffInHours = diffInMs / (1000 * 60 * 60);
      return diffInHours.toFixed(2);
    }
    return '0.00';
  };

  return (
    <Box p={8} mt={100} backgroundColor={'white'} borderRadius={'30px'}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Employee Table</Text>

      {/* Search Bar */}
      <Flex justifyContent={'space-between'} alignItems={'center'} gap={5} id='emp-flex'>
        <Box mb={4} width={'50%'} id='emp-search'>
          <Input
            placeholder="Search.... "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box mb={4} width={'50%'} >
          <Input
            type="date"
            value={sharedDate}
            // min={monthStart}
            // max={monthEnd}
            onChange={(e) => handleSharedDateChange(e.target.value)}
          />
        </Box>
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

      <Box maxHeight={'100vh'} overflowY="auto">
        <Table variant="simple" colorScheme="gray">
          <Thead id='head-fixed'>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Date</Th>
              <Th>In Time</Th>
              <Th>Out Time</Th>
              <Th>Total Hours</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((employee) => (
              <Tr key={employee._id}>
                <Td>{employee.name}</Td>
                <Td>{employee.empType}</Td>
                <Td>
                  <Input type="date" value={sharedDate} isReadOnly />
                </Td>
                <Td>
                  <Input
                    type="time"
                    value={inTime[employee._id] || ""}
                    onChange={(e) => handleInTimeChange(employee._id, e.target.value)}
                    step="600"
                    disabled={hasCheckedInToday(employee)}
                  />
                </Td>
                <Td>
                  <Input
                    type="time"
                    value={outTime[employee._id] || ""}
                    onChange={(e) => handleOutTimeChange(employee._id, e.target.value)}
                    step="600"
                    disabled={hasCheckedOutToday(employee)}
                  />
                </Td>
                <Td>{calculateTotalHours(employee._id)}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleSave(employee._id, employee)}
                    disabled={hasCheckedInToday(employee) && hasCheckedOutToday(employee)}
                  >
                    {loading[employee._id] ? <Spinner size="sm" /> : 'Save'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

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
