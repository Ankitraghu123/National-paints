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
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getUnpaidEmployees } from "features/Employee/EmployeeSlice";
import { CiEdit } from "react-icons/ci";
import { isHR } from "utils/config";
import { transferToPaidEmployee } from "features/Employee/EmployeeSlice";
import { Link } from "react-router-dom";
import { isAdmin } from "utils/config";
import { editEmployee } from "features/Employee/EmployeeSlice";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { rejectEmployee } from "features/Employee/EmployeeSlice";
import { CSVLink } from "react-csv";

const UnPaidEmployees = () => {
  const dispatch = useDispatch();
  const employeesData = useSelector((state) => state.employee.unpaidEmployees);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employeesData);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { editedEmployee, transferedToPaid } = useSelector(
    (state) => state.employee
  );

  useEffect(() => {
    dispatch(getUnpaidEmployees());
  }, [dispatch, editedEmployee, transferedToPaid]);

  useEffect(() => {
    setFilteredEmployees(employeesData);
  }, [employeesData]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = employeesData.filter((employee) => {
      const empCode = employee.employeeCode;
      return (
        Object.values(employee).some((field) =>
          String(field).toLowerCase().includes(value)
        ) || empCode.toLowerCase().includes(value)
      );
    });
    setFilteredEmployees(filtered);
  };

  const handlePaidEmployee = (id) => {
    dispatch(transferToPaidEmployee(id));
  };

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = () => {
    if (selectedEmployee) {
      dispatch(editEmployee({ ...selectedEmployee, id: selectedEmployee._id })); // Assuming you have an action to update employee
    }
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleRejectEmployees = (id) => {
    dispatch(rejectEmployee(id));
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
      <Heading mb={4}>Trainees</Heading>

      {/* Search Field */}
      <Input
        placeholder="Search by any field"
        value={searchTerm}
        onChange={handleSearch}
        mb={4}
        width="100%"
      />

      <CSVLink
        data={csvData || []}
        headers={csvHeaders}
        filename="trainees_data.csv"
      >
        <Button colorScheme="blue" mb={4}>
          Export to CSV
        </Button>
      </CSVLink>

      {/* Scrollable Table */}
      <Box overflowY="scroll" border="1px solid #E2E8F0" borderRadius="8px">
        <Table variant="striped" colorScheme="teal" size="sm">
          <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
            <Tr>
              <Th>Serial No.</Th>
              <Th id="col-fixed">Employee Name</Th>
              <Th>EmpCode</Th>
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
              <Th>Designation</Th>
              <Th>Father's Name</Th>
              <Th>Salary</Th>
              <Th>Joining Date</Th>
              {isHR() || isAdmin() ? <Th>Action</Th> : ""}
            </Tr>
          </Thead>
          <Tbody>
            {filteredEmployees?.map((employee, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td id="col-fixed">
                  <Link
                    to={`/admin/unpaid-employee-attendnace/${employee._id}`}
                  >
                    {employee.name}
                  </Link>
                </Td>
                <Td>{employee?.employeeCode}</Td>
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
                {isHR() || isAdmin() ? (
                  <Td>
                    <Flex gap={2} alignItems={"ceneter"}>
                      <Tooltip label="Edit Trainee" placement="top">
                        <Button
                          colorScheme="blue"
                          onClick={() => openModal(employee)}
                          cursor="pointer"
                        >
                          <CiEdit />
                        </Button>
                      </Tooltip>
                      <Tooltip label="Make Paid" placement="top">
                        <Button
                          colorScheme="green"
                          onClick={() => handlePaidEmployee(employee._id)}
                        >
                          <TiTick />
                        </Button>
                      </Tooltip>

                      <Tooltip label="Remove Trainee" placement="top">
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={selectedEmployee?.name || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="Dob"
                value={selectedEmployee?.Dob || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={selectedEmployee?.location || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Total Experience</FormLabel>
              <Input
                name="totalExp"
                value={selectedEmployee?.totalExp || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Previous Employer</FormLabel>
              <Input
                name="previousEmployer"
                value={selectedEmployee?.previousEmployer || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Bank Account Number</FormLabel>
              <Input
                name="bankAccountNumber"
                value={selectedEmployee?.bankAccountNumber || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>IFSC Code</FormLabel>
              <Input
                name="ifscCode"
                value={selectedEmployee?.ifscCode || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Bank Branch</FormLabel>
              <Input
                name="bankBranch"
                value={selectedEmployee?.bankBranch || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                name="mobileNumber"
                value={selectedEmployee?.mobileNumber || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Alternate Number</FormLabel>
              <Input
                name="alternateNumber"
                value={selectedEmployee?.alternateNumber || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>City</FormLabel>
              <Input
                name="City"
                value={selectedEmployee?.City || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Pin Code</FormLabel>
              <Input
                name="pinCode"
                value={selectedEmployee?.pinCode || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Current Address</FormLabel>
              <Input
                name="currentAddress"
                value={selectedEmployee?.currentAddress || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Permanent Address</FormLabel>
              <Input
                name="permanentAddress"
                value={selectedEmployee?.permanentAddress || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={selectedEmployee?.email || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>PAN Number</FormLabel>
              <Input
                name="panNumber"
                value={selectedEmployee?.panNumber || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Marital Status</FormLabel>
              <Input
                name="maritalStatus"
                value={selectedEmployee?.maritalStatus || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Blood Group</FormLabel>
              <Input
                name="bloodGroup"
                value={selectedEmployee?.bloodGroup || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Qualification</FormLabel>
              <Input
                name="qualification"
                value={selectedEmployee?.qualification || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Father's Name</FormLabel>
              <Input
                name="fathersName"
                value={selectedEmployee?.fathersName || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Salary</FormLabel>
              <Input
                name="salary"
                value={selectedEmployee?.salary || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Joining Date</FormLabel>
              <Input
                type="date"
                name="joiningDate"
                value={selectedEmployee?.joiningDate || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Employee Code</FormLabel>
              <Input
                type="String"
                name="employeeCode"
                value={selectedEmployee?.employeeCode || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" me={5} onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UnPaidEmployees;
