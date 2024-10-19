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
import UnPaidEmployees from './UnPaidEmployees';
import { getUnpaidEmployees } from 'features/Employee/EmployeeSlice';

const AllEmployee = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector(state => state.employee?.allEmployees);
  const unpaidEmployees = useSelector(state => state.employee?.unpaidEmployees);
  const { checkedIn, checkedOut } = useSelector(state => state.attendance);
  const [time, setTime] = useState({}); 
  const [searchTerm, setSearchTerm] = useState('')

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50); 

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(getUnpaidEmployees())
  }, [dispatch, checkedIn, checkedOut]);

  const combineDateWithTime = (timeString) => {
    const today = new Date();
    const [hours, minutes] = timeString.split(':');

    // Set today's date with the selected time
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return today; // Return the complete Date object
  };

  // Handle time change
  const handleTimeChange = (empId, value) => {
    setTime(prev => ({ ...prev, [empId]: value }));
  };

  // Handle check-in
  const handleCheckIn = (empId) => {
    let selectedTime = time[empId];

    if (!selectedTime) {
      // Get the current time in HH:mm format
      const now = new Date();
      selectedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    const dateWithTime = combineDateWithTime(selectedTime);
    
    dispatch(checkIn({ empId, setTime: dateWithTime.toISOString() }));
  };

  // Handle check-out
  const handleCheckOut = (empId) => {
    let selectedTime = time[empId] ; // Default to "17:00" if no time selected
    if (!selectedTime) {
      // Get the current time in HH:mm format
      const now = new Date();
      selectedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    const dateWithTime = combineDateWithTime(selectedTime);
    dispatch(checkOut({ empId, setTime: dateWithTime.toISOString() }));
  };

  const combinedEmployees = [
    ...(allEmployees || []),  // Spread existing allEmployees array
    ...(unpaidEmployees || [])  // Spread existing unpaidEmployees array
  ];

  const filteredEmployees = combinedEmployees?.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.empType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastEmployee = currentPage * entriesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
  const currentEmployees = filteredEmployees?.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalEntries = allEmployees?.length || 0;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  return (
    <Box p={8} mt={100} backgroundColor={'white'} borderRadius={'30px'}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Employee Table</Text>

      {/* Search Bar  */}
      <Flex justifyContent={'space-between'} alignItems={'center'} id='emp-flex'>
      <Box mb={4} width={'50%'} id='emp-search'>
        <Input
          placeholder="Search.... "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={4}
          
          // width="300px"
        />
      </Box>

      {/* Entries per page selector */}
      <Box mb={4}>
        {/* <Text mb={2}>Entries Per Page </Text> */}
        <Select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          // width="150px"
        >
          {[50,75,100].map((option) => (
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
                  <input
                    type="time"
                    value={time[employee._id] || ""}
                    onChange={(e) => handleTimeChange(employee._id, e.target.value)}
                    step="600" // 10 minutes interval
                  />
                </Td>
                <Td>
                  <Button
                    colorScheme={employee.check === 0 ? 'green' : 'red'}
                    onClick={() => employee.check === 0 ? handleCheckIn(employee._id) : handleCheckOut(employee._id)}
                  >
                    {employee.check === 0 ? 'In' : 'Out'}
                  </Button>
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
