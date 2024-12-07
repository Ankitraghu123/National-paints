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
import { allHoliday } from "features/Holiday/HolidaySlice";
import { putSalary } from "features/Employee/EmployeeSlice";
import { paySalary } from "features/Employee/EmployeeSlice";
import { Link } from "react-router-dom";
import Papa from "papaparse";

const PaidSalaries = () => {
  const dispatch = useDispatch();
 
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50); // Default entries per page
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input

  const employees = useSelector((state) => state.employee?.allEmployees);
  // const employees = allEmployees?.filter((employee) => employee.empType === 'labour');
  const {salaryPaid} = useSelector(state => state.employee)
  const today = new Date();
  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch,salaryPaid]);

  const selectedEmployees = employees?.filter((employee) =>
    employee.salaryArray.some((salary) => {
      const salaryDate = new Date(salary.month);
      return (
        salaryDate.getMonth() === parseInt(month) &&
        salaryDate.getFullYear() === parseInt(year) && 
        salary.isPaid && salary.isSalaryApproved 
      );
    })
  );

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = selectedEmployees
    ?.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.empType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) 
    )
    .slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );


    const handlePaySalary = async (empId, month) => {
        
          dispatch(paySalary({empId,month}))
      
      };

      const handleExportCSV = () => {
        const csvData = currentEmployees.map((emp) => {
          const salaryEntry = emp.salaryArray.find((salary) => {
            const salaryDate = new Date(salary.month);
            return (
              salaryDate.getMonth() === month &&
              salaryDate.getFullYear() === year &&
              salary.isPaid
            );
          });
    
          return {
            "Employee Name": emp.name,
            "Employee Type": emp.empType,
            "Base Salary": salaryEntry?.amount || "N/A",
            "Loan Deduction": salaryEntry?.loanAmount || 0,
            "Advance Taken": salaryEntry?.advance ? 500 : 0,
            "Bonus": salaryEntry?.bonus || 0,
            "Deduction": salaryEntry?.deduction || 0,
            "Total Salary": salaryEntry?.advance
              ? (salaryEntry.amount - 500 - salaryEntry.loanAmount + salaryEntry.bonus - salaryEntry.deduction).toFixed(2)
              : (salaryEntry.amount - salaryEntry.loanAmount + salaryEntry.bonus - salaryEntry.deduction).toFixed(2),
          };
        });
    
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `salaries_${year}_${month + 1}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

  // Calculate the total paid salaries for all employees
  const totalPaidSalaries = useMemo(() => {
    return selectedEmployees?.reduce((acc, employee) => {
      const salaryEntry = employee.salaryArray.find((salary) => {
        const salaryDate = new Date(salary.month);
        return (
          salaryDate.getMonth() === month &&
          salaryDate.getFullYear() === year &&
          salary.isPaid &&
          salary.isSalaryApproved
        );
      });

      const paidSalary = salaryEntry
        ? salaryEntry.amount - salaryEntry.loanAmount + salaryEntry.bonus - salaryEntry.deduction
        : 0;

      return acc + paidSalary;
    }, 0);
  }, [selectedEmployees, month, year]);

  // Ensure totalPaidSalaries is a number before calling toFixed
  const formattedTotalPaidSalaries = totalPaidSalaries ? totalPaidSalaries.toFixed(2) : "0.00";

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"} >
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
        <Text mb={2}>Search Employee</Text>
        <Input
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      </Box>

      

      {/* Search Bar */}
      
      {/* Entries per page selection */}
      <Box mb={4}>
        <Text mb={2}>Entries per page:</Text>
        <Select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          width="150px"
        >
          {[50,75,100].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>

      <Box mb={4}>
        <Button colorScheme="green" onClick={handleExportCSV}>
          Export to Exel
        </Button>
      </Box>

      {/* Display total paid salaries */}
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Total Paid Salaries: ₹ {formattedTotalPaidSalaries}
        </Text>
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
              <Th>Bonus</Th>
              <Th>Deduction</Th>
              <Th>Total Salary</Th>
              <Th>Action</Th>
              <Th>Generate Salary Slip</Th>
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
            salary.isPaid
          );
        });
        return (
            <Tr key={emp._id}> {/* Assuming emp._id is unique */}
              <Td id="col-fixed">{emp.name}</Td>
              <Td>{emp.employeeCode}</Td>
              <Td>{emp.empType}</Td>
              <Td>{salaryEntry?.amount || "N/A"}</Td>
              <Td>{salaryEntry?.loanAmount }</Td>
            <Td>{salaryEntry?.advance ? 500 : 0}</Td>
            <Td>{salaryEntry?.bonus ? salaryEntry.bonus : 0}</Td>
            <Td>{salaryEntry?.deduction ? salaryEntry.deduction : 0}</Td>
              <Td>
  {salaryEntry?.advance 
    ? (salaryEntry?.amount - 500 - salaryEntry?.loanAmount + salaryEntry?.bonus - salaryEntry?.deduction).toFixed(2) 
    : (salaryEntry?.amount - salaryEntry?.loanAmount + salaryEntry?.bonus - salaryEntry?.deduction).toFixed(2)}
</Td>
              <Td>
                {salaryEntry?.isPaid ? (
                  <Text color="green.500">Paid</Text> // You can customize this message/style
                ) : (
                  <Button colorScheme="green" onClick={() => handlePaySalary(emp._id, salaryEntry?.month)}>
                    Pay
                  </Button>
                )}
              </Td>
              <Td > <Link to={`/admin/salary-slip/${emp._id}/${salaryEntry?.month}`} colorScheme="teal" >
                    Generate Salary Slip
                  </Link></Td>
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

export default PaidSalaries;





