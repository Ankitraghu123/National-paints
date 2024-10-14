import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { addEmployee } from 'features/Employee/EmployeeSlice';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    empType: 'pandit', // Default employee type
  });

  const dispatch = useDispatch()

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addEmployee(formData))
    
  };

  return (
    <Box p={6} rounded="md" boxShadow="md" bg="gray.50" maxWidth="800px" mx="auto" mt='40'>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {/* Name Field */}
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
            />
          </FormControl>

          {/* Salary Field */}
          <FormControl id="salary" isRequired>
            <FormLabel>Salary</FormLabel>
            <Input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter employee salary"
            />
          </FormControl>

          {/* Employee Type Select */}
          <FormControl id="empType" isRequired>
            <FormLabel>Employee Type</FormLabel>
            <Select
              name="empType"
              value={formData.empType}
              onChange={handleChange}
              placeholder="Select employee type"
            >
              <option value="pandit">Pandit</option>
              <option value="staff">Staff</option>
              <option value="labour">Labour</option>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" colorScheme="teal" width="full">
            Add Employee
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddEmployee;
