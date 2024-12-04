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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Flex,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { editSalary } from "features/Employee/EmployeeSlice";
import { editEmployee } from "features/Employee/EmployeeSlice";
import { CiEdit } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { deleteEmployee } from "features/Employee/EmployeeSlice";
import { isHR } from "utils/config";
import { isAdmin } from "utils/config";
import { getAgainEmployee } from "features/Employee/EmployeeSlice";
import { TiTick } from "react-icons/ti";
import { CSVLink } from "react-csv";

const AllDeletedEmployee = () => {
  const dispatch = useDispatch();
  const allEmployees = useSelector((state) => state.employee.allEmployees);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(allEmployees);
  const { editedEmployee, deletedEmployee, employeeApproved } = useSelector(
    (state) => state.employee
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editFields, setEditFields] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEmployees?.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const totalPages = Math.ceil(filteredEmployees?.length / entriesPerPage);
  const employeesData = allEmployees?.filter((employee) => employee.delete);

  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch, editedEmployee, deletedEmployee, employeeApproved]);

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

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeleteHandler = async (id) => {
    try {
      dispatch(deleteEmployee(id));
      alert("employee is getting deleted");
    } catch (error) {
      alert("Failed to delete employee");
    }
  };

  const handleGetAgain = async (id) => {
    try {
      dispatch(getAgainEmployee(id));
      alert("employee is adding again");
    } catch (error) {
      alert("Failed to add employee");
    }
  };

  const csvHeaders = [
    { label: "S.No", key: "serial" },
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
      <Heading mb={4}>All De-activated Employees</Heading>

      {/* Search Field */}
      <Input
        placeholder="Search by any field"
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
        width="100%"
      />

      <Box width={"100%"} justify="space-between" mb={4}>
        <Flex width={"100%"} justify="space-between">
          <Flex>
            <Text>Show Enteries</Text>
            <Select
              width="auto"
              value={entriesPerPage}
              onChange={handleEntriesChange}
              ml={2}
              mr={2}
            >
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </Select>
          </Flex>
          <CSVLink
            data={csvData || []}
            headers={csvHeaders}
            filename="De-activated-employees.csv"
          >
            <Button colorScheme="blue" mb={4}>
              Export to CSV
            </Button>
          </CSVLink>
        </Flex>
      </Box>

      {/* Scrollable Table */}
      <Box
        maxHeight={"100vh"}
        overflowY="auto"
        border="1px solid #E2E8F0"
        borderRadius="8px"
      >
        <Table variant="striped" colorScheme="teal" size="sm">
          <Thead bg="gray.100" id="head-fixed">
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
              {isHR() || isAdmin() ? <Th>Action</Th> : ""}
            </Tr>
          </Thead>
          <Tbody>
            {currentEntries?.map((employee, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td id="col-fixed">{employee.name}</Td>
                <Td id="col-fixed">{employee?.employeeCode}</Td>
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
                <Td>{employee.fathersName}</Td>
                <Td>
                  {employee.currentSalary
                    ? employee.currentSalary
                    : employee.salary}
                </Td>
                <Td>
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString("en-US")
                    : "NA"}
                </Td>

                {isHR() || isAdmin() ? (
                  <Td>
                    <Flex>
                      <Tooltip label="Add Employee Again" placement="top">
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleGetAgain(employee._id)}
                        >
                          <TiTick />
                        </Button>
                      </Tooltip>
                      <Tooltip label="Add Employee Again" placement="top">
                        <Button
                          ms={2}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDeleteHandler(employee._id)}
                        >
                          <MdDelete />
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

      <Flex mt={4} justify="space-between" align="center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default AllDeletedEmployee;
