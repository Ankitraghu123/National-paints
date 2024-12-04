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
import { payAdvance } from "features/Employee/EmployeeSlice";
import Papa from "papaparse"; // Import papaparse for CSV export
import { unpayAdvance } from "features/Employee/EmployeeSlice";

const PayAdvance = () => {
  const dispatch = useDispatch();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // New state for filtering

  const employees = useSelector((state) => state.employee?.allEmployees);
  const { advancePaid, unpaidAdvance } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch, advancePaid, unpaidAdvance]);

  const totalPages = Math.ceil(employees?.length / entriesPerPage);

  // Apply filters for search and paid/unpaid advance
  const filteredEmployees = employees?.filter((employee) => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.empType.toLowerCase().includes(searchTerm.toLowerCase());
    const salaryEntry = employee.salaryArray.find((salary) => {
      const salaryDate = new Date(salary.month);
      return (
        salaryDate.getMonth() === month &&
        salaryDate.getFullYear() === year
      );
    });

    if (filter === "paid") {
      return matchesSearch && salaryEntry?.advance;
    }
    if (filter === "unpaid") {
      return matchesSearch && !salaryEntry?.advance;
    }
    return matchesSearch; // For "all" filter
  });

  const currentEmployees = filteredEmployees?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePayAdvance = (empId, month) => {
    dispatch(payAdvance({ empId, month }));
  };

  const handleunPayAdvance = (empId, month) => {
    dispatch(unpayAdvance({ empId, month }));
  };

  // Function to export table to CSV
  const handleExportCSV = () => {
    const csvData = currentEmployees.map((emp) => {
      const salaryEntry = emp.salaryArray.find((salary) => {
        const salaryDate = new Date(salary.month);
        return (
          salaryDate.getMonth() === month &&
          salaryDate.getFullYear() === year
        );
      });
      return {
        "Employee Name": emp.name,
        "Employee Type": emp.empType,
        Amount: 500,
        Status: salaryEntry?.advance ? "Paid" : "Unpaid",
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Employee_Advance_${year}_${month + 1}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
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
        <Box width={"40%"} id="full-width">
          <Text mb={2}>Search</Text>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box>
          <Text mb={2}>Filter:</Text>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            width="150px"
          >
            <option value="all">All</option>
            <option value="paid">Paid Advance</option>
            <option value="unpaid">Unpaid Advance</option>
          </Select>
        </Box>
      </Box>

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

      <Button colorScheme="blue" mb={4} onClick={handleExportCSV}>
        Export to CSV
      </Button>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>Employee Type</Th>
              <Th>Amount</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((emp) => {
              const salaryEntry = emp.salaryArray.find((salary) => {
                const salaryDate = new Date(salary.month);
                return (
                  salaryDate.getMonth() === month &&
                  salaryDate.getFullYear() === year
                );
              });
              return (
                <Tr key={emp._id}>
                  <Td>{emp.name}</Td>
                  <Td>{emp.empType}</Td>
                  <Td>{500}</Td>
                  <Td>
                    {salaryEntry?.advance ? (
                                            <Button
                                            colorScheme="red"
                                            onClick={() =>
                                              handleunPayAdvance(emp._id, new Date(year, month + 1, 0))
                                            }
                                          >
                                            Remove Advance
                                          </Button>
                    ) : (
                      <Button
                        colorScheme="green"
                        onClick={() =>
                          handlePayAdvance(emp._id, new Date(year, month + 1, 0))
                        }
                      >
                        Pay Advance
                      </Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

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

export default PayAdvance;