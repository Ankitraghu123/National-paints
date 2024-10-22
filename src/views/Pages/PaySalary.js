import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { paySalary } from "features/Employee/EmployeeSlice";

const PaySalary = () => {
  const dispatch = useDispatch();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50); // Default entries per page
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input

  const employees = useSelector((state) => state.employee?.allEmployees);
  // const employees = allEmployees?.filter((employee) => employee.empType === 'labour');
  const { salaryPaid } = useSelector(state => state.employee);

  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch, salaryPaid]);

  // Filter employees whose salary for the selected month/year has isPaid set to false
  const selectedEmployees = employees?.filter((employee) =>
    employee.salaryArray.some((salary) => {
      const salaryDate = new Date(salary.month);
      return (
        salaryDate.getMonth() === parseInt(month) &&
        salaryDate.getFullYear() === parseInt(year) &&
        !salary.isPaid  // Only select employees where isPaid is false
      );
    })
  );

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = selectedEmployees
    ?.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())||
    employee.empType.toLowerCase().includes(searchTerm.toLowerCase())

    )
    .slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );

  const handlePaySalary = async (empId, month) => {
    dispatch(paySalary({ empId, month }));
  };

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      {/* Year and Month Selection */}
      <Box display="flex" alignItems="center" gap={4} mb={4} id="table-col">
        <Box>
          <Text mb={2}>Year:</Text>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="2000"
            max="2100"
            width="100px"
            id="full-width"
          />
        </Box>
        <Box>
          <Text mb={2}>Month:</Text>
          <Select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            width="150px"
            id="full-width"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </Select>
        </Box>
        <Box width={'40%'} id="full-width">
          <Text mb={2}>Search by Employee Name:</Text>
          <Input
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

      {/* Entries per page selection */}
      <Box mb={4}>
        <Text mb={2}>Entries per page:</Text>
        <Select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          width="150px"
        >
          {[50, 75, 100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>

      {/* Attendance Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>Employee Type</Th>
              <Th>Total Salary</Th>
              <Th>Pay</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((emp) => {
              // Find the salary entry for the current month/year
              const salaryEntry = emp.salaryArray.find((salary) => {
                const salaryDate = new Date(salary.month);
                return (
                  salaryDate.getMonth() === month &&
                  salaryDate.getFullYear() === year &&
                  !salary.isPaid // Only show salaries where isPaid is false
                );
              });

              return (
                <Tr key={emp._id}>
                  <Td>{emp.name}</Td>
                  <Td>{emp.empType}</Td>
                  <Td>{salaryEntry?.amount || "N/A"}</Td>
                  <Td>
                    <Button colorScheme="teal" onClick={() => handlePaySalary(emp._id, salaryEntry?.month)}>
                      Pay
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <HStack justifyContent="space-between" mt={4}>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default PaySalary;
