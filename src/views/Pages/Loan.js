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
  const [amountForMonth, setAmountForMonth] = useState([]);
  const [isSpecificAmount, setIsSpecificAmount] = useState(false); // New state to track user's choice
  const [startingMonth, setStartingMonth] = useState(''); // New state for starting month

  useEffect(() => {
    dispatch(allEmployee());
  }, [dispatch]);

  const handleAmountChange = (index, value) => {
    const updatedAmounts = [...amountForMonth];
    updatedAmounts[index] = parseFloat(value) || 0; // Ensure the value is a number
    setAmountForMonth(updatedAmounts);
  };

  const handleRepaymentMonthsChange = (value) => {
    const months = Math.max(parseInt(value, 10) || 0, 0);
    setRepaymentMonths(months);
    if (!isSpecificAmount) {
      const equalAmount = loanAmount / months || 0;
      setAmountForMonth(new Array(months).fill(equalAmount));
    } else {
      setAmountForMonth(new Array(months).fill(0));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(amountForMonth);
    if (repaymentMonths > 0 && amountForMonth.length !== repaymentMonths) {
      toast({
        title: "Please enter amount for all months.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (loanAmount < 0 || monthlyDeduction < 0 || repaymentMonths < 0) {
      toast({
        title: "Please enter valid values.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (amountForMonth.some(amount => amount < 0)) {
      toast({
        title: "Amount for each month cannot be negative.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (amountForMonth.some(amount => amount === 0)) {
      toast({
        title: "Amount for each month cannot be zero.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let monthlyAmount = amountForMonth.reduce((acc, curr) => acc + curr, 0);
    console.log(monthlyAmount, loanAmount);

    if (monthlyAmount != loanAmount) {
      toast({
        title: "Total amount for all months must match the total loan amount.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const data = {
      empId: selectedEmployee,
      totalAmount: loanAmount,
      monthlyDeduction,
      months: repaymentMonths,
      amountForMonth,
      startingMonth, // Include starting month in the data
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
            onChange={(e) => handleRepaymentMonthsChange(e.target.value)}
            placeholder="Enter number of months"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Do you want specific amounts for each month?</FormLabel>
          <Select
            value={isSpecificAmount ? "yes" : "no"}
            onChange={(e) => setIsSpecificAmount(e.target.value === "yes")}
          >
            <option value="no">No, use equal monthly deductions</option>
            <option value="yes">Yes, specify each month's amount</option>
          </Select>
        </FormControl>

        {isSpecificAmount && repaymentMonths > 0 &&
          Array.from({ length: repaymentMonths }, (_, index) => (
            <FormControl mb={4} key={index}>
              <FormLabel>Amount for month {index + 1}</FormLabel>
              <Input
                type="number"
                value={amountForMonth[index] || 0}
                onChange={(e) => handleAmountChange(index, e.target.value)}
                placeholder="Enter amount for month"
              />
            </FormControl>
          ))
        }

        <FormControl mb={4} isRequired>
          <FormLabel>Starting Month of Repayment</FormLabel>
          <Input
            type="month" // Use month input type for better UX
            value={startingMonth}
            onChange={(e) => setStartingMonth(e.target.value)}
            placeholder="Select starting month"
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
