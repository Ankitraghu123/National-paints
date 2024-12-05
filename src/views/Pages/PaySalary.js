import React, { useState, useEffect, useMemo } from "react";
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
  const [bonus, setBonus] = useState({});
  const [deduction, setDeduction] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50); // Default entries per page
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input

  const employees = useSelector((state) => state.employee?.allEmployees);
  // const employees = allEmployees?.filter((employee) => employee.empType === 'labour');
  const { salaryPaid } = useSelector((state) => state.employee);

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
        !salary.isPaid &&
        salary.isSalaryApproved // Only select employees where isPaid is false
      );
    })
  );

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = selectedEmployees
    ?.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.empType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handlePaySalary = async (empId, month) => {
    dispatch(paySalary({ 
      empId, 
      month, 
      bonus: bonus[empId] || 0, 
      deduction: deduction[empId] || 0 
    }));
  };

  const handleBonusChange = (empId, value) => {
    setBonus((prevBonus) => ({
      ...prevBonus,
      [empId]: value === "" ? 0 : Number(value),
    }));
  };

  const handleDeductionChange = (empId, value) => {
    setDeduction((prevDeduction) => ({
      ...prevDeduction,
      [empId]: value === "" ? 0 : Number(value),
    }));
  };

  // Calculate the total remaining salary for all employees
  const totalRemainingSalary = useMemo(() => {
    return selectedEmployees?.reduce((acc, employee) => {
      const salaryEntry = employee.salaryArray.find((salary) => {
        const salaryDate = new Date(salary.month);
        return (
          salaryDate.getMonth() === month &&
          salaryDate.getFullYear() === year &&
          !salary.isPaid &&
          salary.isSalaryApproved
        );
      });

      const remainingSalary = salaryEntry
        ? salaryEntry.amount - salaryEntry.loanAmount + bonus[employee._id] - deduction[employee._id]
        : 0;

      return acc + remainingSalary;
    }, 0);
  }, [selectedEmployees, month, year, bonus, deduction]);

  // Ensure totalRemainingSalary is a number before calling toFixed
  const formattedTotalRemainingSalary = totalRemainingSalary ? totalRemainingSalary.toFixed(2) : "0.00";

  // Calculate the total paid salaries for all employees
  const totalPaidSalaries = useMemo(() => {
    return employees?.reduce((acc, employee) => {
      const paidSalaries = employee.salaryArray.filter((salary) => {
        const salaryDate = new Date(salary.month);
        return (
          salaryDate.getMonth() === month &&
          salaryDate.getFullYear() === year &&
          salary.isPaid &&
          salary.isSalaryApproved
        );
      });

      const totalPaidForEmployee = paidSalaries.reduce((sum, salaryEntry) => {
        return sum + salaryEntry.amount - salaryEntry.loanAmount + salaryEntry.bonus - salaryEntry.deduction;
      }, 0);

      return acc + totalPaidForEmployee;
    }, 0);
  }, [employees, month, year]);

  // Ensure totalPaidSalaries is a number before calling toFixed
  const formattedTotalPaidSalaries = totalPaidSalaries ? totalPaidSalaries.toFixed(2) : "0.00";

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      {/* Display total remaining salary */}
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Total Remaining Salary: ₹ {formattedTotalRemainingSalary}
        </Text>
      </Box>
      {/* Display total paid salaries */}
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Total Paid Salaries: ₹ {formattedTotalPaidSalaries}
        </Text>
      </Box>
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
        <Box width={"40%"} id="full-width">
          <Text mb={2}>Search Employee</Text>
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
              <Th id="col-fixed">Employee Name</Th>
              <Th>Employee Code</Th>
              <Th>Employee Type</Th>
              <Th>Base Salary</Th>
              <Th>Loan deduction</Th>
              <Th>Advance Taken</Th>
              <Th>Give Bonus</Th>
              <Th>Cut Deduction</Th>
              <Th>Total Salary</Th>
              <Th>Action</Th>
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
                  !salary.isPaid &&
                  salary.isSalaryApproved
                );
              });

              return (
                <Tr key={emp._id}>
                  <Td id="col-fixed">{emp.name}</Td>
                  <Td>{emp.employeeCode}</Td>
                  <Td>{emp.empType}</Td>
                  <Td>{salaryEntry?.amount || "N/A"}</Td>
                  <Td>{salaryEntry?.loanAmount}</Td>
                  <Td>{salaryEntry?.advance ? 500 : 0}</Td>
                  <Td>
                    <Input
                      type="number"
                      value={bonus[emp._id] || ""}
                      onChange={(e) => handleBonusChange(emp._id, e.target.value)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={deduction[emp._id] || ""}
                      onChange={(e) => handleDeductionChange(emp._id, e.target.value)}
                    />
                  </Td>
                  <Td>
                    {salaryEntry?.advance
                      ? (
                          salaryEntry.amount -
                          500 -
                          salaryEntry.loanAmount +
                          (bonus[emp._id] || 0) -
                          (deduction[emp._id] || 0)
                        ).toFixed(2)
                      : (
                          salaryEntry.amount -
                          salaryEntry.loanAmount +
                          (bonus[emp._id] || 0) -
                          (deduction[emp._id] || 0)
                        ).toFixed(2)}
                  </Td>
                  <Td>
                    <Button
                      colorScheme="green"
                      onClick={() =>
                        handlePaySalary(emp._id, salaryEntry?.month)
                      }
                    >
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
