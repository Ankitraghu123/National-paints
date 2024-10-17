import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Input, Box, Heading } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee } from 'features/Employee/EmployeeSlice';

const AllEmployeesTable = () => {
  const dispatch = useDispatch();
  const employeesData = useSelector((state) => state.employee.allEmployees);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employeesData);

  useEffect(() => {
    dispatch(allEmployee());
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

  return (
    <Box p={5} mt={20} bg="white" borderRadius="30px">
      <Heading mb={4}>All Employees</Heading>

      {/* Search Field */}
      <Input
        placeholder="Search by any field"
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
        width="400px"
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
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AllEmployeesTable;
