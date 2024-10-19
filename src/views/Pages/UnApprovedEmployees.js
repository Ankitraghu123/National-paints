import { getUnApprovedEmployees } from 'features/Employee/EmployeeSlice';
import React, { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Input, Box, Heading, Button, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter, VStack, Select } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { isHR } from 'utils/config';
import { CiEdit } from "react-icons/ci";
import { approveEmployee } from 'features/Employee/EmployeeSlice';
import { editEmployee } from 'features/Employee/EmployeeSlice';

const UnApprovedEmployees = () => {
    const dispatch = useDispatch();
    const employeesData = useSelector((state) => state.employee.unapprovedEmployees);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState(employeesData);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const {unapprovedEmployee} = useSelector(state => state.employee)
    useEffect(() => {
      dispatch(getUnApprovedEmployees());
    }, [dispatch]);
  
    useEffect(() => {
      setFilteredEmployees(employeesData);
    }, [employeesData]);
  
    const handleSearch = (event) => {
      const value = event.target.value.toLowerCase();
      setSearchTerm(value);
  
      const filtered = employeesData.filter((employee) =>
        Object.values(employee).some((field) =>
          String(field).toLowerCase().includes(value)
        )
      );
      setFilteredEmployees(filtered);
    };

    const handleApproveEmployees = (id) => {
        dispatch(approveEmployee(id))
    }

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedEmployee(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedEmployee) {
            dispatch(editEmployee({id:selectedEmployee._id, selectedEmployee}));
            handleCloseModal();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedEmployee(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <Box p={5} mt={40} bg="white" borderRadius="30px">
        <Heading mb={4}>UnApproved Employees</Heading>
  
        {/* Search Field */}
        <Input
          placeholder="Search by any field"
          value={searchTerm}
          onChange={handleSearch}
          mb={4}
          width="100%"
        />
  
        {/* Scrollable Table */}
        <Box overflowY="scroll" border="1px solid #E2E8F0" borderRadius="8px">
          <Table variant="striped" colorScheme="teal" size="sm">
            <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
              <Tr>
                <Th>Name</Th>
                <Th>Employee Type</Th>
                <Th>Date of Birth</Th>
                <Th>Location</Th>
                <Th>Total Experience</Th>
                <Th>Previous Employer</Th>
                <Th>Bank Account Number</Th>
                <Th>IFSC Code</Th>
                <Th>Bank Branch</Th>
                <Th>Mobile Number</Th>
                <Th>Alternate Number</Th>
                <Th>City</Th>
                <Th>Pin Code</Th>
                <Th>Current Address</Th>
                <Th>Permanent Address</Th>
                <Th>Email</Th>
                <Th>PAN Number</Th>
                <Th>Marital Status</Th>
                <Th>Blood Group</Th>
                <Th>Qualification</Th>
                <Th>Father's Name</Th>
                <Th>Salary</Th>
                <Th>Joining Date</Th>
                <Th>Registeration Date</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEmployees?.map((employee, index) => (
                <Tr key={index}>
                  <Td>{employee.name}</Td>
                  <Td>{employee.empType}</Td>
                  <Td>{employee.Dob}</Td>
                  <Td>{employee.location}</Td>
                  <Td>{employee.totalExp}</Td>
                  <Td>{employee.previousEmployer}</Td>
                  <Td>{employee.bankAccountNumber}</Td>
                  <Td>{employee.ifscCode}</Td>
                  <Td>{employee.bankBranch}</Td>
                  <Td>{employee.mobileNumber}</Td>
                  <Td>{employee.alternateNumber}</Td>
                  <Td>{employee.City}</Td>
                  <Td>{employee.pinCode}</Td>
                  <Td>{employee.currentAddress}</Td>
                  <Td>{employee.permanentAddress}</Td>
                  <Td>{employee.email}</Td>
                  <Td>{employee.panNumber}</Td>
                  <Td>{employee.maritalStatus}</Td>
                  <Td>{employee.bloodGroup}</Td>
                  <Td>{employee.qualification}</Td>
                  <Td>{employee.fathersName}</Td>
                  <Td>{employee.salary}</Td>
                  <Td>{employee.joiningDate}</Td>
                  <Td>{employee.registerationDate}</Td>
                  <Td >
                    <Flex gap={2} alignItems={"ceneter"}>
                    <Text fontSize={'30px'}><CiEdit onClick={() => handleEditClick(employee)}/></Text>
                    {isHR() ? <Button onClick={() => handleApproveEmployees(employee._id)}>Approve</Button> : ''}
                    </Flex>

                  </Td>

                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>


        {selectedEmployee && (
                <Modal isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Employee</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <Box>    
                        <form onClick={handleSubmit}>
                        <VStack spacing={4}>
          {/* Name Field */}
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={selectedEmployee.name}
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
                value={selectedEmployee.Dob}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="location">
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                name="location"
                value={selectedEmployee.location}
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
                value={selectedEmployee.totalExp}
                onChange={handleChange}
                placeholder="Enter total experience in years"
              />
            </FormControl>

            <FormControl id="previousEmployer">
              <FormLabel>Previous Employer</FormLabel>
              <Input
                type="text"
                name="previousEmployer"
                value={selectedEmployee.previousEmployer}
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
                value={selectedEmployee.bankAccountNumber}
                onChange={handleChange}
                placeholder="Enter bank account number"
              />
            </FormControl>

            <FormControl id="ifscCode">
              <FormLabel>IFSC Code</FormLabel>
              <Input
                type="text"
                name="ifscCode"
                value={selectedEmployee.ifscCode}
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
                value={selectedEmployee.bankBranch}
                onChange={handleChange}
                placeholder="Enter bank branch"
              />
            </FormControl>

            <FormControl id="mobileNumber">
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="number"
                name="mobileNumber"
                value={selectedEmployee.mobileNumber}
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
                value={selectedEmployee.alternateNumber}
                onChange={handleChange}
                placeholder="Enter alternate number"
              />
            </FormControl>

            <FormControl id="City">
              <FormLabel>City</FormLabel>
              <Input
                type="text"
                name="City"
                value={selectedEmployee.City}
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
                value={selectedEmployee.pinCode}
                onChange={handleChange}
                placeholder="Enter pin code"
              />
            </FormControl>

            <FormControl id="currentAddress">
              <FormLabel>Current Address</FormLabel>
              <Input
                type="text"
                name="currentAddress"
                value={selectedEmployee.currentAddress}
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
                value={selectedEmployee.permanentAddress}
                onChange={handleChange}
                placeholder="Enter permanent address"
              />
            </FormControl>

            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={selectedEmployee.email}
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
                value={selectedEmployee.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN number"
              />
            </FormControl>

            <FormControl id="maritalStatus">
              <FormLabel>Marital Status</FormLabel>
              <Select
                name="maritalStatus"
                value={selectedEmployee.maritalStatus}
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
                value={selectedEmployee.bloodGroup}
                onChange={handleChange}
                placeholder="Enter blood group"
              />
            </FormControl>

            <FormControl id="qualification">
              <FormLabel>Qualification</FormLabel>
              <Input
                type="text"
                name="qualification"
                value={selectedEmployee.qualification}
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
                value={selectedEmployee.fathersName}
                onChange={handleChange}
                placeholder="Enter father's name"
              />
            </FormControl>

            <FormControl id="salary">
              <FormLabel>Salary</FormLabel>
              <Input
                type="number"
                name="salary"
                value={selectedEmployee.salary}
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
                value={selectedEmployee.joiningDate}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="empType">
              <FormLabel>Department</FormLabel>
              <Select
                name="empType"
                value={selectedEmployee.empType}
                onChange={handleChange}
              >
                <option value="staff">Staff</option>
                <option value="labour">Labour</option>
                <option value="sales">Sales</option>
                <option value="pandit">Pandit</option>
              </Select>
            </FormControl>
          </Flex>
          <Flex spacing={4} width="100%" id='table-col' gap={5}>
            <FormControl id="registerationDate">
              <FormLabel>Registeration Date</FormLabel>
              <Input
                type="date"
                name="registerationDate"
                value={selectedEmployee.registerationDate}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="designation">
              <FormLabel>Designation</FormLabel>
              <Input
                type="String"
                name="designation"
                value={selectedEmployee.designation}
                onChange={handleChange}
              />
            </FormControl>

            
          </Flex>

                                      

                                        <Button colorScheme="teal" type="submit">Save Changes</Button>
                                    </VStack>
                        </form>
                                
                                    </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={() => setSelectedEmployee(null)}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
      </Box>
    );
}

export default UnApprovedEmployees