import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee } from 'features/Employee/EmployeeSlice';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, HStack,
  Select,
} from '@chakra-ui/react';
import { checkOut, checkIn } from 'features/Attendance/AttendanceSlice';

const AllEmployee = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector(state => state.employee?.allEmployees);
  const { checkedIn, checkedOut } = useSelector(state => state.attendance);
  const [time, setTime] = useState({}); // State to hold selected time per employee

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5); // Change this to any number you prefer

  // Fetch all employees on component mount
  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch, checkedIn, checkedOut]);

  // Function to merge today's date with the selected time
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
    const selectedTime = time[empId] || "09:00"; // Default to "09:00" if no time selected
    const dateWithTime = combineDateWithTime(selectedTime);
    dispatch(checkIn({ empId, setTime: dateWithTime.toISOString() }));
  };

  // Handle check-out
  const handleCheckOut = (empId) => {
    const selectedTime = time[empId] || "17:00"; // Default to "17:00" if no time selected
    const dateWithTime = combineDateWithTime(selectedTime);
    dispatch(checkOut({ empId, setTime: dateWithTime.toISOString() }));
  };

  // Pagination Logic
  const indexOfLastEmployee = currentPage * entriesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
  const currentEmployees = allEmployees?.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalEntries = allEmployees?.length || 0;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  return (
    <Box p={8} mt={100} backgroundColor={'white'} borderRadius={'30px'}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Employee Table</Text>

      {/* Entries per page selector */}
      <Box mb={4}>
        <Text mb={2}>Enteries Per Page </Text>
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

      <Box overflowX="auto">
        <Table variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Time</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((employee) => (
              <Tr key={employee._id}>
                <Td>{employee.name}</Td>

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
                    {employee.check === 0 ? 'Check In' : 'Check Out'}
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
