import React from 'react';
import {
  Box,
  Text,
  Stack,
  Divider,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { employeeDetails } from 'features/Employee/EmployeeSlice';
import { useEffect } from 'react';

// Function to calculate the amount left for each loan
function calculateAmountLeft(loan, loanObjects) {
  const amountReceived = loan.loanArray.reduce((sum, loanObjId) => {
    const loanObj = loanObjects.find(obj => obj._id.$oid === loanObjId.$oid && obj.installmentPaid);
    return sum + (loanObj ? loanObj.amount : 0);
  }, 0);
  return loan.totalAmount - amountReceived;
}

const EmployeeDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(employeeDetails(id));
    }, [dispatch, id]);

    const employee = useSelector((state) => state.employee?.employeeDetails);
  return (
    <Box p={8} mt={5} backgroundColor="gray.50" borderRadius="lg" boxShadow="lg">
      <Text fontSize="3xl" mb={6} textAlign="center" color="teal.600" fontWeight="bold">
        Employee Details
      </Text>
      <Stack spacing={5}>
        <Box>
          <Text fontWeight="bold" color="gray.700">Name:</Text>
          <Text color="gray.600">{employee?.name}</Text>
        </Box>
        <Divider borderColor="gray.300" />
        <Box>
          <Text fontWeight="bold" color="gray.700">Base Salary:</Text>
          <Text color="gray.600">{employee?.salary}</Text>
        </Box>
        <Divider borderColor="gray.300" />
        <Box>
          <Text fontWeight="bold" color="gray.700">Employee Type:</Text>
          <Text color="gray.600">{employee?.empType}</Text>
        </Box>
        <Divider borderColor="gray.300" />
        <Box>
          <Text fontWeight="bold" color="gray.700">Status:</Text>
          <Text color="gray.600">{employee?.status}</Text>
        </Box>
        <Divider borderColor="gray.300" />
        <Box>
          <Text fontWeight="bold" color="gray.700">Employee Code:</Text>
          <Text color="gray.600">{employee?.employeeCode}</Text>
        </Box>
        <Divider borderColor="gray.300" />
        <Box>
          <Text fontWeight="bold" color="gray.700">Edited Salaries:</Text>
          <List spacing={2}>
            {employee?.editedSalary?.map((salary, index) => (
              <ListItem key={index} color="gray.600">{salary}</ListItem>
            ))}
          </List>
        </Box>
        <Divider borderColor="gray.300" />
        <Box>
          <Text fontWeight="bold" color="gray.700">Loans Taken:</Text>
          <Text color="gray.600">{employee?.loans?.length || 0} loans</Text>
          <List spacing={3}>
            {employee?.loans?.map((loan, index) => (
              <ListItem key={index}>
                <Text fontWeight="bold" color="teal.500">Loan {index + 1}:</Text>
                <Text color="gray.600">Amount: {loan.totalAmount}</Text>
                <Text color="gray.600">Date Taken: {new Date(loan.loanArray[0].createdAt).toLocaleDateString()}</Text>
                <Text color="gray.600">Repayment Months: {loan.loanArray.length}</Text>
                <Text color="gray.600">
                  Amount Left: {calculateAmountLeft(loan, employee?.loanObjects || [])}
                </Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </Stack>
    </Box>
  );
}

export default EmployeeDetails;