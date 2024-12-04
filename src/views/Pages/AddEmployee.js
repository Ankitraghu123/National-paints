import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Flex,
  Stack,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { addEmployee } from 'features/Employee/EmployeeSlice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    Dob: '',
    location: '',
    totalExp: '',
    previousEmployer: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankBranch: '',
    mobileNumber: '',
    alternateNumber: '',
    City: '',
    pinCode: '',
    currentAddress: '',
    permanentAddress: '',
    email: '',
    panNumber: '',
    maritalStatus: '',
    bloodGroup: '',
    qualification: '',
    fathersName: '',
    salary: '',
    joiningDate: '',
    registerationDate:'',
    designation: '',
    empType: 'staff', // Default employee type
    employeeCode: ''
  });

  const dispatch = useDispatch();
  const history = useHistory()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addEmployee(formData));
      history.push('/admin/unapproved-employee'); 
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
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

          {/* Date of Birth and Location Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5} >
            <FormControl id="Dob">
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="Dob"
                value={formData.Dob}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="location">
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </FormControl>
          </Flex>

          {/* Total Experience and Previous Employer Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="totalExp">
              <FormLabel>Total Experience (Years)</FormLabel>
              <Input
                type="number"
                name="totalExp"
                value={formData.totalExp}
                onChange={handleChange}
                placeholder="Enter total experience in years"
              />
            </FormControl>

            <FormControl id="previousEmployer">
              <FormLabel>Previous Employer</FormLabel>
              <Input
                type="text"
                name="previousEmployer"
                value={formData.previousEmployer}
                onChange={handleChange}
                placeholder="Enter previous employer"
              />
            </FormControl>
          </Flex>

          {/* Bank Account Number and IFSC Code Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="bankAccountNumber">
              <FormLabel>Bank Account Number</FormLabel>
              <Input
                type="number"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                placeholder="Enter bank account number"
              />
            </FormControl>

            <FormControl id="ifscCode">
              <FormLabel>IFSC Code</FormLabel>
              <Input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
              />
            </FormControl>
          </Flex>

          {/* Bank Branch and Mobile Number Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="bankBranch">
              <FormLabel>Bank Branch</FormLabel>
              <Input
                type="text"
                name="bankBranch"
                value={formData.bankBranch}
                onChange={handleChange}
                placeholder="Enter bank branch"
              />
            </FormControl>

            <FormControl id="mobileNumber">
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
            </FormControl>
          </Flex>

          {/* Alternate Number and City Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="alternateNumber">
              <FormLabel>Alternate Number</FormLabel>
              <Input
                type="number"
                name="alternateNumber"
                value={formData.alternateNumber}
                onChange={handleChange}
                placeholder="Enter alternate number"
              />
            </FormControl>

            <FormControl id="City">
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                name="City"
                value={formData.City}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </FormControl>
          </Flex>

          {/* Pin Code and Current Address Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="pinCode">
              <FormLabel>Pin Code</FormLabel>
              <Input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter pin code"
              />
            </FormControl>

            <FormControl id="currentAddress">
              <FormLabel>Current Address</FormLabel>
              <Input
                type="text"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                placeholder="Enter current address"
              />
            </FormControl>
          </Flex>

          {/* Permanent Address and Email Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="permanentAddress">
              <FormLabel>Permanent Address</FormLabel>
              <Input
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                placeholder="Enter permanent address"
              />
            </FormControl>

            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </FormControl>
          </Flex>

          {/* PAN Number and Marital Status Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="panNumber">
              <FormLabel>PAN Number</FormLabel>
              <Input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN number"
              />
            </FormControl>

            <FormControl id="maritalStatus">
              <FormLabel>Marital Status</FormLabel>
              <Select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                placeholder="Select marital status"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
              </Select>
            </FormControl>
          </Flex>

          {/* Blood Group and Qualification Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="bloodGroup">
              <FormLabel>Blood Group</FormLabel>
              <Input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                placeholder="Enter blood group"
              />
            </FormControl>

            <FormControl id="qualification">
              <FormLabel>Qualification</FormLabel>
              <Input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Enter qualification"
              />
            </FormControl>
          </Flex>

          {/* Father's Name and Salary Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="fathersName">
              <FormLabel>Father's Name</FormLabel>
              <Input
                type="text"
                name="fathersName"
                value={formData.fathersName}
                onChange={handleChange}
                placeholder="Enter father's name"
              />
            </FormControl>

            <FormControl id="salary">
              <FormLabel>Salary</FormLabel>
              <Input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
              />
            </FormControl>
          </Flex>

          {/* Joining Date and Employee Type Fields in a Row */}
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="joiningDate">
              <FormLabel>Joining Date</FormLabel>
              <Input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="empType">
              <FormLabel>Department</FormLabel>
              <Select
                name="empType"
                value={formData.empType}
                onChange={handleChange}
              >
                <option value="staff">Staff</option>
                <option value="labour">Labour</option>
                <option value="sales">Sales</option>
                <option value="officeboy">OfficeBoy</option>
                <option value="guard">Guard</option>
              </Select>
            </FormControl>
          </Flex>
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="registerationDate">
              <FormLabel>Registeration Date</FormLabel>
              <Input
                type="date"
                name="registerationDate"
                value={formData.registerationDate}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="designation">
              <FormLabel>Designation</FormLabel>
              <Input
                type="String"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              />
            </FormControl>

            
          </Flex>

          <FormControl id="employeeCode"> 
            <FormLabel>Employee Code</FormLabel>
            <Input
              type="String"
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              placeholder='Enter Employee Code'
            />
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" colorScheme="blue" width="full">
            Add Employee
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddEmployee;
