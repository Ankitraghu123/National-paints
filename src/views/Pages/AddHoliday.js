import React, { useEffect, useState } from 'react';
import { addHoliday, allHoliday } from "features/Holiday/HolidaySlice";
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Input, Text, Heading, VStack, useToast, Stack, Table, Thead, Tbody, Tr, Th, Td, Flex } from '@chakra-ui/react';

const AddHoliday = () => {
  const [holidays, setHolidays] = useState([]);
  const [selectedHolidayDate, setSelectedHolidayDate] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const dispatch = useDispatch();
  const toast = useToast();

  const allHolidays = useSelector(state => state.holiday.allHolidays);

  useEffect(() => {
    dispatch(allHoliday());
  }, [dispatch]);

  // Get today's date
  const today = new Date();
  
  // Calculate the first day of the next month
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const minDate = nextMonth.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format

  const handleAddHoliday = () => {
    const selectedDate = new Date(selectedHolidayDate);

    // Check if both holiday name and selected date are valid
    if (holidayName && selectedHolidayDate && selectedDate >= nextMonth) {
      // Dispatch action to add holiday with both name and date
      dispatch(addHoliday({ name: holidayName, date: selectedHolidayDate }));

      // Clear inputs after dispatch
      setSelectedHolidayDate('');
      setHolidayName('');
      
      // Show a success toast message
      toast({
        title: 'Holiday added.',
        description: `${holidayName} set for ${selectedHolidayDate}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error.',
        description: 'Please enter a holiday name and select a date in the next month or any future month.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to filter holidays by the selected month
  const getHolidaysForMonth = (month) => {
    return allHolidays?.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getMonth() + 1 === month && holidayDate.getFullYear() === today.getFullYear(); // Check for current year
    });
  };

  return (
    <Box mt="90px" mx="auto" maxWidth="800px" p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" backgroundColor="white">
      <Heading as="h2" size="lg" textAlign="center" mb={4} color="teal.500">
        Add Holiday
      </Heading>
      <Stack spacing={4}>
      <Flex gap={'10px'}>
      <Box width={'48%'}>
       <Text fontWeight="bold">Holiday Name:</Text>
        <Input
          type="text"
          value={holidayName}
          placeholder="Enter holiday name"
          onChange={(e) => setHolidayName(e.target.value)}
          focusBorderColor="teal.400"
          size="md"
        />
       </Box>
       <Box width={'48%'}>
       <Text fontWeight="bold">Select Date:</Text>
        <Input
          type="date"
          value={selectedHolidayDate}
          min={minDate} // Disable dates before the first day of the next month
          onChange={(e) => setSelectedHolidayDate(e.target.value)}
          focusBorderColor="teal.400"
          size="md"
        />
       </Box>
      </Flex>
      
        <Button 
          colorScheme="teal" 
          width="full" 
          onClick={handleAddHoliday}
        >
          Add Holiday
        </Button>
      </Stack>

      {/* Month Selector */}
      <Stack spacing={4} mt={6}>
        <Text fontWeight="bold">Select Month:</Text>
        <Input
          type="month"
          value={`${today.getFullYear()}-${String(selectedMonth).padStart(2, '0')}`}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value.split('-')[1]))}
          focusBorderColor="teal.400"
          size="md"
        />
      </Stack>

      {/* Holidays Table */}
      <Box mt={6}>
        <Heading as="h3" size="md" mb={4} color="teal.500">
          Holidays for {new Date(today.getFullYear(), selectedMonth - 1).toLocaleString('default', { month: 'long' })}
        </Heading>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Holiday Name</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getHolidaysForMonth(selectedMonth)?.map((holiday, index) => (
              <Tr key={index}>
                <Td>{holiday.name}</Td>
                <Td>{new Date(holiday.date).toLocaleDateString()}</Td>
              </Tr>
            ))}
            {getHolidaysForMonth(selectedMonth)?.length === 0 && (
              <Tr>
                <Td colSpan="2" textAlign="center">No holidays found for this month.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AddHoliday;
