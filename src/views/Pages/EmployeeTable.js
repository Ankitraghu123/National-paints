import React, { useState, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
  Flex,
  Box,
  Button
} from '@chakra-ui/react';

const EmployeeTable = ({employeeData}) => {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    return employeeData?.filter((employee) =>
      employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.salary?.toString().includes(searchTerm)
    );
  }, [searchTerm, employeeData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees?.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentEntries = filteredEmployees?.slice(startIndex, startIndex + entriesPerPage);

  // Handlers
  const handleSearch = (event) => setSearchTerm(event.target.value);
  const handleEntriesChange = (event) => setEntriesPerPage(parseInt(event.target.value, 10));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <Box p={5} style={{backgroundColor:"white"}} mt={100} borderRadius={'30px'}>
      {/* Search and Entries per page */}
      <Flex justifyContent="space-between" mb={4}>
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          maxW="300px"
        />
        <Flex alignItems="center">
          <Box mr={2}>Show entries:</Box>
          <Select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            maxW="100px"
          >
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </Select>
        </Flex>
      </Flex>

      {/* Table */}
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>Salary</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEntries?.map((employee, index) => (
              <Tr key={index}>
                <Td>{employee.name}</Td>
                <Td>{employee.salary}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Box>
          Page {currentPage} of {totalPages}
        </Box>
        <Flex>
          <Button
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            mr={2}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default EmployeeTable;