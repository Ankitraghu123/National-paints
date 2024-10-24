import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { allEmployee } from 'features/Employee/EmployeeSlice'; // Adjust the import path as necessary
import { giveLoan } from 'features/Employee/EmployeeSlice';

const Loan = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee?.allEmployees);
  const toast = useToast(); 
  
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [monthlyDeduction, setMonthlyDeduction] = useState(''); // New state for monthly deduction
  const [repaymentMonths, setRepaymentMonths] = useState('');

  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      empId: selectedEmployee,
      totalAmount: loanAmount,
      monthlyDeduction,
      months: repaymentMonths,
    };

    try {
      await dispatch(giveLoan(data)).unwrap(); // Unwrap to handle rejected promises

      // Show success toast
      toast({
        title: "Loan Added.",
        description: "The loan has been successfully added for the employee.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
    } catch (error) {
      // Show error toast
      toast({
        title: "Loan Submission Failed.",
        description: "An error occurred while adding the loan. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      <Text fontSize="2xl" mb={4}>Loan Application</Text>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Select Employee</FormLabel>
          <Select 
            placeholder="Select employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            {employees?.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Total Loan Amount</FormLabel>
          <Input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter total loan amount"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Monthly Deduction</FormLabel>
          <Input
            type="number"
            value={monthlyDeduction}
            onChange={(e) => setMonthlyDeduction(e.target.value)}
            placeholder="Enter monthly deduction"
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Repayment Months</FormLabel>
          <Input
            type="number"
            value={repaymentMonths}
            onChange={(e) => setRepaymentMonths(e.target.value)}
            placeholder="Enter number of months"
          />
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Submit Loan
        </Button>
      </form>
    </Box>
  );
};

export default Loan;
