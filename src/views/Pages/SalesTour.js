import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Heading,
  Stack,
  Flex,
  Textarea,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addTourDetails, allTourDetails, deleteTourDetails } from "../../features/Employee/EmployeeSlice";
import { allEmployee } from "../../features/Employee/EmployeeSlice";

const SalesTour = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // This is a placeholder - replace with actual employee data from your API/Redux store
  const allEmployees =
    useSelector((state) => state?.employee?.allEmployees) || [];
  const salesEmployee = allEmployees.filter(
    (employee) => employee.empType === "sales"
  );
  const tours =
    useSelector((state) => state?.employee?.allTourDetails?.tours) || [];

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allTourDetails());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!selectedEmployee || !startDate || !endDate || !remarks) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    dispatch(
      addTourDetails({
        employeeId: selectedEmployee,
        employeeName: salesEmployee.find((emp) => emp._id === selectedEmployee)
          ?.name,
        startDate,
        endDate,
        remark: remarks,
      })
    ).then(() => {
      // Reset form after successful addition
      setSelectedEmployee("");
      setStartDate("");
      setEndDate("");
      setRemarks("");

      toast({
        title: "Success",
        description: "Tour details added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh tours
      dispatch(allTourDetails());
    });
  };

  // Filter tours based on search term
  const filteredTours = Array.isArray(tours)
    ? tours.filter(
        (tour) =>
          tour.employeeName &&
          tour.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredTours.length / entriesPerPage);
  const currentTours = filteredTours.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleDelete = (id) => {
    dispatch(deleteTourDetails(id)).then(() => {
      toast({
        title: "Deleted",
        description: "Tour details deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh tours
      dispatch(allTourDetails());
    });
  };

  return (
    <Box mt="90px" mx="auto" maxWidth="1200px" p={6}>
      {/* Form Section */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        backgroundColor="white"
        p={6}
        mb={6}
      >
        <Heading as="h2" size="lg" textAlign="center" mb={4} color="teal.500">
          Sales Tour
        </Heading>

        <Stack spacing={4}>
          <Box>
            <Text fontWeight="bold">Select Employee:</Text>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              placeholder="Select employee"
              focusBorderColor="teal.400"
              size="md"
            >
              {salesEmployee.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </Select>
          </Box>

          <Flex gap={"10px"}>
            <Box width={"48%"}>
              <Text fontWeight="bold">Start Date:</Text>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                focusBorderColor="teal.400"
                size="md"
              />
            </Box>
            <Box width={"48%"}>
              <Text fontWeight="bold">End Date:</Text>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                focusBorderColor="teal.400"
                size="md"
              />
            </Box>
          </Flex>

          <Box>
            <Text fontWeight="bold">Remarks:</Text>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks here"
              focusBorderColor="teal.400"
              size="md"
              rows={4}
            />
          </Box>

          <Button colorScheme="teal" width="full" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Box>

      {/* Table Section */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        backgroundColor="white"
        p={6}
      >
        <Flex justifyContent="space-between" mb={4}>
          <Box width="300px">
            <Text mb={2}>Search:</Text>
            <Input
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Flex>

        <TableContainer maxHeight="600px" overflowY="auto">
          <Table variant="simple">
            <Thead position="sticky" top={0} bg="white">
              <Tr>
                <Th>S.No</Th>
                <Th>Employee Name</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Remarks</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentTours.map((tour, index) => (
                <Tr key={tour._id}>
                  <Td>{(currentPage - 1) * entriesPerPage + index + 1}</Td>
                  <Td>{tour.employeeName}</Td>
                  <Td>{new Date(tour.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(tour.endDate).toLocaleDateString()}</Td>
                  <Td>{tour.remark}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(tour._id)}
                    >
                      <MdDelete />
                    </Button>
                  </Td>
                </Tr>
              ))}
              {currentTours.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    No records found
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <HStack justifyContent="space-between" mt={4}>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages || 1}
          </Text>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            isDisabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default SalesTour;
