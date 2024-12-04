import React, { useEffect, useState } from 'react';
import { addHoliday, allHoliday } from "features/Holiday/HolidaySlice";
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Input, Text, Heading, VStack, useToast,
  Stack, Table, Thead, Tbody, Tr, Th, Td, Flex, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter
} from '@chakra-ui/react';

import { deleteHoliday } from 'features/Holiday/HolidaySlice';
import { editHoliday } from 'features/Holiday/HolidaySlice';
import { MdDelete, MdEdit } from 'react-icons/md';

const AddHoliday = () => {
  const [holidays, setHolidays] = useState([]);
  const [selectedHolidayDate, setSelectedHolidayDate] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [editingHolidayId, setEditingHolidayId] = useState(null); // State to hold the id of the holiday being edited
  const [isEditing, setIsEditing] = useState(false); 
  const dispatch = useDispatch();
  const toast = useToast();

  const allHolidays = useSelector(state => state.holiday.allHolidays);
  const {editedHoliday,deletedHoliday} = useSelector(state => state.holiday)

  useEffect(() => {
    dispatch(allHoliday());
  }, [dispatch,editedHoliday,deletedHoliday]);

  // Get today's date
  const today = new Date();
  
  // Calculate the first day of the next month
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const minDate = nextMonth.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format

  const handleAddHoliday = () => {
    const selectedDate = new Date(selectedHolidayDate);

    // Check if both holiday name and selected date are valid
    if (holidayName && selectedHolidayDate) {
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

  const handleEditHoliday = (holiday) => {
    setHolidayName(holiday.name);
    setSelectedHolidayDate(holiday.date);
    setEditingHolidayId(holiday._id); 
    setIsEditing(true)
  };

  const handleDeleteHoliday = (id) => {
    dispatch(deleteHoliday(id));
    toast({
      title: 'Holiday deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateHoliday = () => {
    if (holidayName && selectedHolidayDate) {
      dispatch(editHoliday({ id: editingHolidayId, name: holidayName, date: selectedHolidayDate }));

      // Clear fields and close modal
      resetFields();
      setIsEditing(false);

      // Show a success toast message
      toast({
        title: 'Holiday updated.',
        description: `${holidayName} updated for ${selectedHolidayDate}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error.',
        description: 'Please enter a holiday name and select a valid date.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetFields = () => {
    setSelectedHolidayDate('');
    setHolidayName('');
    setEditingHolidayId(null);
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
          // min={minDate} // Disable dates before the first day of the next month
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
       <Box overflowX='auto'>
       <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Holiday Name</Th>
              <Th>Date</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getHolidaysForMonth(selectedMonth)?.map((holiday, index) => (
              <Tr key={index}>
                <Td>{holiday.name}</Td>
                <Td>{new Date(holiday.date).toLocaleDateString()}</Td>
                <Td display='flex'>
                  <Button 
                    colorScheme="blue" 
                    size="sm" 
                    onClick={() => handleEditHoliday(holiday)}
                  >
                    <MdEdit />
                  </Button>
                  <Button 
                    colorScheme="red" 
                    size="sm" 
                    ml={2}
                    onClick={() => handleDeleteHoliday(holiday._id)}
                  >
                    <MdDelete/>
                  </Button>
                </Td>
              </Tr>
            ))}
            {getHolidaysForMonth(selectedMonth)?.length === 0 && (
              <Tr>
                <Td colSpan="3" textAlign="center">No holidays found for this month.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
       </Box>
      </Box>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Holiday</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">Holiday Name:</Text>
            <Input
              type="text"
              value={holidayName}
              placeholder="Enter holiday name"
              onChange={(e) => setHolidayName(e.target.value)}
              focusBorderColor="teal.400"
              size="md"
            />
            <Text fontWeight="bold" mt={4}>Select Date:</Text>
            <Input
              type="date"
              value={selectedHolidayDate}
              onChange={(e) => setSelectedHolidayDate(e.target.value)}
              focusBorderColor="teal.400"
              size="md"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleUpdateHoliday}>
              Update Holiday
            </Button>
            <Button ml={3} onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddHoliday;
