import { getUnApprovedEmployees } from 'features/Employee/EmployeeSlice';
import React, { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Input, Box, Heading, Flex, Text, Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getUnpaidEmployees } from 'features/Employee/EmployeeSlice';
import { CiEdit } from 'react-icons/ci';
import { isHR } from 'utils/config';
import { transferToPaidEmployee } from 'features/Employee/EmployeeSlice';
import { Link } from 'react-router-dom';

const UnPaidEmployees = () => {
    const dispatch = useDispatch();
    const employeesData = useSelector((state) => state.employee.unpaidEmployees);
  
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState(employeesData);
  
    useEffect(() => {
      dispatch(getUnpaidEmployees());
    }, [dispatch,employeesData]);
  
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

    const handlePaidEmployee = (id) => {
        dispatch(transferToPaidEmployee(id))
    }
  
    return (
      <Box p={5} mt={40} bg="white" borderRadius="30px">
        <Heading mb={4}>Trainees</Heading>
  
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
                <Th>Action</Th>

              </Tr>
            </Thead>
            <Tbody>
              {filteredEmployees?.map((employee, index) => (
                <Tr key={index}>
                  <Td><Link to={`/admin/unpaid-employee-attendnace/${employee._id}`}>{employee.name}</Link></Td>
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
                  <Td >
                    <Flex gap={2} alignItems={"ceneter"}>
                    <Text fontSize={'30px'}><CiEdit /></Text>
                    {isHR() ? <Button onClick={() => handlePaidEmployee(employee._id)}>Paid</Button> : ''}
                    </Flex>

                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    );
}

export default UnPaidEmployees