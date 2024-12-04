import { getUnApprovedEmployees } from "features/Employee/EmployeeSlice";
import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Box,
  Heading,
  Button,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  VStack,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { isHR } from "utils/config";
import { CiEdit } from "react-icons/ci";
import { approveEmployee } from "features/Employee/EmployeeSlice";
import { editEmployee } from "features/Employee/EmployeeSlice";
import { isAdmin } from "utils/config";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { rejectEmployee } from "features/Employee/EmployeeSlice";
import { CSVLink } from "react-csv";

const UnApprovedEmployees = () => {
  const dispatch = useDispatch();
  const employeesData = useSelector(
    (state) => state.employee.unapprovedEmployees
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employeesData);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { editedEmployee, rejectedEmployee, employeeApproved } = useSelector(
    (state) => state.employee
  );
  useEffect(() => {
    dispatch(getUnApprovedEmployees());
  }, [dispatch, editedEmployee, rejectedEmployee, employeeApproved]);

  useEffect(() => {
    setFilteredEmployees(employeesData);
  }, [employeesData]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();

    setSearchTerm(value);

    const filtered = employeesData.filter((employee) => {
      const empCode = employee._id.slice(-6);
      return (
        Object.values(employee).some((field) =>
          String(field).toLowerCase().includes(value)
        ) || empCode.toLowerCase().includes(value)
      );
    });
    setFilteredEmployees(filtered);
  };

  const handleApproveEmployees = (id) => {
    dispatch(approveEmployee(id));
  };

  const handleRejectEmployees = (id) => {
    dispatch(rejectEmployee(id));
  };

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
      dispatch(editEmployee({ id: selectedEmployee._id, ...selectedEmployee }));
      handleCloseModal();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const csvHeaders = [
    { label: "Serial No.", key: "serial" },
    { label: "Name", key: "name" },
    { label: "Employee Code", key: "employeeCode" },
    { label: "Employee Type", key: "empType" },
    { label: "Date of Birth", key: "Dob" },
    { label: "Location", key: "location" },
    { label: "Total Experience", key: "totalExp" },
    { label: "Previous Employer", key: "previousEmployer" },
    { label: "Bank Account Number", key: "bankAccountNumber" },
    { label: "IFSC Code", key: "ifscCode" },
    { label: "Bank Branch", key: "bankBranch" },
    { label: "Mobile Number", key: "mobileNumber" },
    { label: "Alternate Number", key: "alternateNumber" },
    { label: "City", key: "City" },
    { label: "Pin Code", key: "pinCode" },
    { label: "Current Address", key: "currentAddress" },
    { label: "Permanent Address", key: "permanentAddress" },
    { label: "Email", key: "email" },
    { label: "PAN Number", key: "panNumber" },
    { label: "Marital Status", key: "maritalStatus" },
    { label: "Blood Group", key: "bloodGroup" },
    { label: "Qualification", key: "qualification" },
    { label: "Father's Name", key: "fathersName" },
    { label: "Salary", key: "currentSalary" },
    { label: "Joining Date", key: "joiningDate" },
  ];

  const csvData = filteredEmployees?.map((employee, index) => ({
    serial: index + 1,
    ...employee,
  }));

  return (
    <Box p={5} mt={40} bg="white" borderRadius="30px">
      <Heading mb={4}>Pending Employees</Heading>

      {/* Search Field */}
      <Input
        placeholder="Search Employee"
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
        width="100%"
      />

      <CSVLink
        data={csvData || []}
        headers={csvHeaders}
        filename="unapproved_employees_data.csv"
      >
        <Button colorScheme="blue" mb={4}>Export to CSV</Button>
      </CSVLink>

      {/* Scrollable Table */}
      <Box overflowY="scroll" border="1px solid #E2E8F0" borderRadius="8px">
        <Table variant="striped" colorScheme="teal" size="sm">
          <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
            <Tr>
              <Th>Serial No.</Th>
              <Th id="col-fixed">Employee Name</Th>
              <Th>Employee Code</Th>
              <Th>Department</Th>
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
              <Th>Designation</Th>
              <Th>Father's Name</Th>
              <Th>Salary</Th>
              <Th>Joining Date</Th>
              <Th>Registeration Date</Th>
              {isHR() || isAdmin() ? <Th>Action</Th> : ""}
            </Tr>
          </Thead>
          <Tbody>
            {filteredEmployees?.map((employee, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td id="col-fixed">{employee.name}</Td>
                <Td>{employee.employeeCode}</Td>
                <Td>{employee.empType}</Td>
                <Td>
                  {employee.Dob
                    ? new Date(employee.Dob).toLocaleDateString("en-US")
                    : "NA"}
                </Td>
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
                <Td>{employee.designation}</Td>
                <Td>{employee.fathersName}</Td>
                <Td>{employee.salary}</Td>
                <Td>
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString("en-US")
                    : "NA"}
                </Td>
                <Td>
                  {employee.registerationDate
                    ? new Date(employee.registerationDate).toLocaleDateString(
                        "en-US"
                      )
                    : "NA"}
                </Td>
                {isHR() || isAdmin() ? (
                  <Td>
                    <Flex gap={2} alignItems={"ceneter"}>
                      <Tooltip label="Edit Employee" placement="top">
                        <Button colorScheme="blue">
                          <CiEdit onClick={() => handleEditClick(employee)} />
                        </Button>
                      </Tooltip>
                      <Tooltip label="Approve Employee" placement="top">
                        <Button
                          colorScheme="green"
                          onClick={() => handleApproveEmployees(employee._id)}
                        >
                          <TiTick />
                        </Button>
                      </Tooltip>

                      <Tooltip label="Reject Employee" placement="top">
                        <Button
                          colorScheme="red"
                          onClick={() => handleRejectEmployees(employee._id)}
                        >
                          <RxCross2 />
                        </Button>
                      </Tooltip>
                    </Flex>
                  </Td>
                ) : (
                  ""
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {selectedEmployee && (
        <Modal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Employee</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <form>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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
                          {/* <option value="pandit">Pandit</option> */}
                        </Select>
                      </FormControl>
                    </Flex>
                    <Flex spacing={4} width="100%" id="table-col" gap={5}>
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

                    <FormControl id="employeeCode">
                      <FormLabel>Employee Code</FormLabel>
                      <Input
                        type="String"
                        name="employeeCode"
                        value={selectedEmployee.employeeCode}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </VStack>
                </form>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" me={5} onClick={handleSubmit}>
                Save Changes
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default UnApprovedEmployees;
