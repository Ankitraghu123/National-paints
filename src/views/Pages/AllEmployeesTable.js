import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table, Thead, Tbody, Tr, Th, Td, Input, Box, Heading, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, useDisclosure,
  Flex,
  Select,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee } from 'features/Employee/EmployeeSlice';
import { editSalary } from 'features/Employee/EmployeeSlice';
import { editEmployee } from 'features/Employee/EmployeeSlice';
import { CiEdit } from 'react-icons/ci';
import { FaDeleteLeft } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { isHR } from 'utils/config';
import { isAdmin } from 'utils/config';
import { deactivateEmployee } from 'features/Employee/EmployeeSlice';
import { CSVLink } from 'react-csv';

const AllEmployeesTable = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee.allEmployees);
  const employeesData = allEmployees?.filter((employee) => !employee.delete);


  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employeesData);
  const {editedEmployee,deletedEmployee,employeeApproved} = useSelector(state => state.employee)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [editFields, setEditFields] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;

  const currentEntries = filteredEmployees?.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredEmployees?.length / entriesPerPage);

  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch, editedEmployee, deletedEmployee, employeeApproved]);

  useEffect(() => {
    setFilteredEmployees(employeesData);
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    console.log("Search Term:", value);
    setSearchTerm(value);

    const filtered = employeesData?.filter((employee) =>
      Object.values(employee).some((field) =>
        String(field).toLowerCase().includes(value)
      )
    );
    console.log("Filtered Employees:", filtered);
    setFilteredEmployees(filtered);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const handleDeleteHandler = async (id) => {
    try {
       dispatch(deactivateEmployee(id));
      alert('employee is getting deleted');
    } catch (error) {
      alert('Failed to delete employee');
    }
  };

  const handleEditDetailsClick = (employee) => {
    setSelectedEmployee(employee);
    setEditFields(employee);  // Initialize fields with employee data
    onEditOpen();
  };

  const handleSaveDetails = () => {
    if (selectedEmployee) {
      dispatch(editEmployee({ ...editFields, id: selectedEmployee._id }));
      onEditClose();
    }
  };

  const handleFieldChange = (field, value) => {
    setEditFields((prevFields) => ({ ...prevFields, [field]: value }));
  };


  const handleEditSalaryClick = (employee) => {
    setSelectedEmployee(employee);
    onOpen();
  };

  const handleSave = () => {
    if (selectedEmployee) {
      const editedData = {
        amount,
        date,
        empId:selectedEmployee._id
      }
      dispatch(editSalary(editedData))
      onClose();
      setAmount('');
      setDate('');
    }
  };

  const csvHeaders = [
    { label: 'S.No', key: 'serial' },
    { label: 'Name', key: 'name' },
    { label: 'Employee Code', key: 'employeeCode' },
    { label: 'Employee Type', key: 'empType' },
    { label: 'Date of Birth', key: 'Dob' },
    { label: 'Location', key: 'location' },
    { label: 'Total Experience', key: 'totalExp' },
    { label: 'Previous Employer', key: 'previousEmployer' },
    { label: 'Bank Account Number', key: 'bankAccountNumber' },
    { label: 'IFSC Code', key: 'ifscCode' },
    { label: 'Bank Branch', key: 'bankBranch' },
    { label: 'Mobile Number', key: 'mobileNumber' },
    { label: 'Alternate Number', key: 'alternateNumber' },
    { label: 'City', key: 'City' },
    { label: 'Pin Code', key: 'pinCode' },
    { label: 'Current Address', key: 'currentAddress' },
    { label: 'Permanent Address', key: 'permanentAddress' },
    { label: 'Email', key: 'email' },
    { label: 'PAN Number', key: 'panNumber' },
    { label: 'Marital Status', key: 'maritalStatus' },
    { label: 'Blood Group', key: 'bloodGroup' },
    { label: 'Qualification', key: 'qualification' },
    { label: 'Father\'s Name', key: 'fathersName' },
    { label: 'Salary', key: 'salary' },
    { label: 'Joining Date', key: 'joiningDate' },
  ];

  const csvData = filteredEmployees?.map((employee, index) => ({
    serial: index + 1,
    ...employee,
    salary: employee?.salary ? employee?.salary : employee?.editedSalary[employee?.editedSalary?.length-1]?.amount
  }));

  return (
    <Box p={5} mt={40} bg="white" borderRadius="30px">
      <Heading mb={4}>All Employees</Heading>
      
      {/* Search Field */}
      <Input
        placeholder="Search...."
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
        width="100%"
      />

<Box width={'100%'} justify="space-between" mb={4}>
        <Flex justify={'space-between'} width={''}>
          <Flex>
          <Text>Show Enteries</Text>
        <Select width="auto" value={entriesPerPage} onChange={handleEntriesChange} ml={2} mr={2}>
          <option value={50}>50</option>
          <option value={75}>75</option>
          <option value={100}>100</option>
        </Select>
        </Flex>
        <CSVLink
          data={csvData || []}
          headers={csvHeaders}
          filename="employees_data.csv"
        >
          <Button colorScheme="blue">Export to CSV</Button>
        </CSVLink>
        </Flex>
      </Box>

      {/* Scrollable Table */}
      <Box maxHeight={'100vh'} overflowY="auto" border="1px solid #E2E8F0" borderRadius="8px">
        <Table variant="striped" colorScheme="teal" size="sm">
          <Thead  bg="gray.100" id='head-fixed'>
            <Tr>
              <Th>S.No</Th>
              <Th id="col-fixed">Name</Th>
              <Th id="col-fixed">Employee Code</Th>
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
              {isHR() || isAdmin() ? <Th>Action</Th> : ''}
            </Tr>
          </Thead>
          <Tbody>
            {currentEntries?.map((employee, index) => (
              <Tr key={index}>
                <Td >{index+1}</Td>
                <Td id="col-fixed"><Link to={`/admin/employee/${employee._id}`}>{employee.name}</Link></Td>
                <Td id="col-fixed">{employee?.employeeCode}</Td>
                <Td>{employee.empType}</Td>
                <Td>{employee.Dob ? new Date(employee.Dob).toLocaleDateString("en-US") : 'NA'}</Td>
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
                <Td>{employee.salary ? employee.salary : employee?.editedSalary[employee?.editedSalary?.length-1]?.amount}</Td>
                <Td>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString("en-US") : 'NA'}</Td>
                
                 {
                  isHR() || isAdmin() ? 
                  <Td >
                  <Flex>
                  <Tooltip label="Edit Salary" placement="top">
                  <Button colorScheme='blue' size="sm" onClick={() => handleEditSalaryClick(employee)}>
                  <CiEdit />
                  </Button>
                  </Tooltip>
                  <Tooltip label="Edit Employee" placement="top">
                  <Button colorScheme="blue" size="sm" onClick={() => handleEditDetailsClick(employee)} ml={2}>
                  <CiEdit />
                  </Button>
                  </Tooltip>

                 <Tooltip label="Deactivate Employee" placement="top">
                 <Button colorScheme="red" size="sm"  ml={2}  onClick={() => handleDeleteHandler(employee._id)} >
                  <MdDelete/>
                  </Button>
                 </Tooltip>
                  </Flex>
                  </Td> : ''
                 }
                
                  
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex mt={4} justify="space-between" align="center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>Page {currentPage} of {totalPages}</Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Salary</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Salary Amount</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Edit Employee Details</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={editFields.name || ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
        />
      </FormControl>
     <FormControl>
      <FormLabel>Employee Type</FormLabel>
        <Input
          value={editFields.empType || ''}
          onChange={(e) => handleFieldChange('empType', e.target.value)}
        />
      </FormControl>


      <FormControl mt={4}>
        <FormLabel>Date of Birth</FormLabel>
        <Input
          type="date"
          value={editFields.Dob || ''}
          onChange={(e) => handleFieldChange('Dob', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Location</FormLabel>
        <Input
          value={editFields.location || ''}
          onChange={(e) => handleFieldChange('location', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Total Experience</FormLabel>
        <Input
          value={editFields.totalExp || ''}
          onChange={(e) => handleFieldChange('totalExp', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Previous Employer</FormLabel>
        <Input
          value={editFields.previousEmployer || ''}
          onChange={(e) => handleFieldChange('previousEmployer', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Bank Account Number</FormLabel>
        <Input
          type="text"
          value={editFields.bankAccountNumber || ''}
          onChange={(e) => handleFieldChange('bankAccountNumber', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>IFSC Code</FormLabel>
        <Input
          value={editFields.ifscCode || ''}
          onChange={(e) => handleFieldChange('ifscCode', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Bank Branch</FormLabel>
        <Input
          value={editFields.bankBranch || ''}
          onChange={(e) => handleFieldChange('bankBranch', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Mobile Number</FormLabel>
        <Input
          type="tel"
          value={editFields.mobileNumber || ''}
          onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Alternate Number</FormLabel>
        <Input
          type="tel"
          value={editFields.alternateNumber || ''}
          onChange={(e) => handleFieldChange('alternateNumber', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>City</FormLabel>
        <Input
          value={editFields.City || ''}
          onChange={(e) => handleFieldChange('City', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Pin Code</FormLabel>
        <Input
          type="text"
          value={editFields.pinCode || ''}
          onChange={(e) => handleFieldChange('pinCode', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Current Address</FormLabel>
        <Input
          value={editFields.currentAddress || ''}
          onChange={(e) => handleFieldChange('currentAddress', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Permanent Address</FormLabel>
        <Input
          value={editFields.permanentAddress || ''}
          onChange={(e) => handleFieldChange('permanentAddress', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={editFields.email || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>PAN Number</FormLabel>
        <Input
          value={editFields.panNumber || ''}
          onChange={(e) => handleFieldChange('panNumber', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Marital Status</FormLabel>
        <Input
          value={editFields.maritalStatus || ''}
          onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Blood Group</FormLabel>
        <Input
          value={editFields.bloodGroup || ''}
          onChange={(e) => handleFieldChange('bloodGroup', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Qualification</FormLabel>
        <Input
          value={editFields.qualification || ''}
          onChange={(e) => handleFieldChange('qualification', e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Father's Name</FormLabel>
        <Input
          value={editFields.fathersName || ''}
          onChange={(e) => handleFieldChange('fathersName', e.target.value)}
        />
            </FormControl>
            <FormControl mt={4}>
        <FormLabel>Employee Code</FormLabel>
        <Input
          value={editFields?.employeeCode || ''}
          onChange={(e) => handleFieldChange('employeeCode', e.target.value)}
        />
      </FormControl>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={handleSaveDetails}>
        Save
      </Button>
      <Button variant="ghost" onClick={onEditClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
  );
};

export default AllEmployeesTable;
