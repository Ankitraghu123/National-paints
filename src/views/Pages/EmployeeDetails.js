import React from 'react';
import {
  Box,
  Text,
  Stack,
  Divider,
  List,
  ListItem,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaUser, FaMoneyBill, FaRegCalendarAlt, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { employeeDetails } from 'features/Employee/EmployeeSlice';
import { useEffect } from 'react';
import { deleteSalary } from 'features/Employee/EmployeeSlice';
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
  const deletedSalary = useSelector((state) => state.employee?.deletedSalary);
  useEffect(() => {
    dispatch(employeeDetails(id));
  }, [dispatch, deletedSalary]);

  const employee = useSelector((state) => state.employee?.employeeDetails);

  const handleDeleteLoan = (loanId) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      console.log(`Delete loan with ID: ${loanId}`);
      // Add dispatch logic here if needed
    }
  };

  const handleDeleteSalary = (salaryId, employeeId) => {
    if (window.confirm("Are you sure you want to delete this salary?")) {

      dispatch(deleteSalary({ salaryId, employeeId }));
    }
  };

  return (
    <Box p={8} mt={5} backgroundColor="gray.50" borderRadius="lg" boxShadow="lg">
      <Text fontSize="3xl" mb={6} textAlign="center" color="teal.600" fontWeight="bold">
        Employee Details
      </Text>
      <Stack spacing={8}>
        <Box p={4} backgroundColor="white" borderRadius="md" boxShadow="sm">
          <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
            <Icon as={FaUser} mr={2} /> Personal Information
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontWeight="bold" color="gray.700">Name:</Text>
              <Text color="gray.600">{employee?.name}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.700">Base Salary:</Text>
              <Text color="gray.600">{employee?.editedSalary && employee?.editedSalary.length > 0 ? employee?.editedSalary[employee?.editedSalary.length - 1]?.amount : employee?.salary}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.700">Employee Type:</Text>
              <Text color="gray.600">{employee?.empType}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.700">Status:</Text>
              <Text color="gray.600">{employee?.status}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="gray.700">Employee Code:</Text>
              <Text color="gray.600">{employee?.employeeCode}</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box p={4} backgroundColor="white" borderRadius="md" boxShadow="sm">
          <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
            <Icon as={FaMoneyBill} mr={2} /> Financial Details
          </Text>
          <Accordion allowMultiple>
            {/* Loans Section */}
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="teal.500">
                  Loans Taken ({employee?.loans?.length || 0})
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Stack spacing={4}>
                  {employee?.loans?.map((loan, index) => (
                    <Box
                      key={index}
                      p={4}
                      backgroundColor="gray.100"
                      borderRadius="md"
                      boxShadow="sm"
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold" fontSize="lg" color="teal.600">
                          Loan {index + 1}
                        </Text>
                        {/* <button onClick={() => handleDeleteLoan(loan._id)}><FaTrash color='red' /></button> */}
                      </Flex>
                      <Divider borderColor="gray.300" my={2} />
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Text color="gray.600">
                          <b>Amount:</b> {loan?.totalAmount}
                        </Text>
                        <Text color="gray.600">
                          <b>Date Taken:</b>{' '}
                          {loan?.loanArray?.length > 0
                            ? new Date(loan?.loanArray[0]?.createdAt)?.toLocaleDateString()
                            : 'N/A'}
                        </Text>
                        <Text color="gray.600">
                          <b>Repayment Months:</b> {loan?.loanArray?.length}
                        </Text>
                        <Text color="gray.600">
                          <b>Starting Month:</b> {
                            (() => {
                              const date = new Date(loan?.loanArray[0]?.month);
                              const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1 for 1-12
                              const year = date.getFullYear();
                              return `${month}/${year}`;
                            })()
                          }
                        </Text>
                        <Text color="teal.500" fontWeight="bold">
                          <b>Remaining Amount:</b> {calculateAmountLeft(loan, employee?.loanObjects || [])}
                        </Text>
                      </SimpleGrid>
                    </Box>
                  ))}
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            {/* Salary Section */}
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="teal.500">
                  Salary Details
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Stack spacing={4}>
                  {employee?.salaryArray?.map((salary, index) => (
                    <Box
                      key={index}
                      p={4}
                      backgroundColor="gray.100"
                      borderRadius="md"
                      boxShadow="sm"
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold" fontSize="lg" color="teal.600">
                          Salary for {new Date(salary?.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </Text>
                        <button onClick={() => handleDeleteSalary(salary._id,employee._id)}><FaTrash color='red' /></button>
                      </Flex>
                      <Divider borderColor="gray.300" my={2} />
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Text color="gray.600">
                          <b>Month:</b> {new Date(salary?.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </Text>
                        <Text color="gray.600">
                          <b>Net Pay:</b> {(salary?.amount + salary?.bonus - salary?.deduction - salary?.loanAmount).toFixed(0)}
                        </Text>
                        <Text color="gray.600">
                          <b>Base Salary:</b> {salary?.amount.toFixed(0)}
                        </Text>
                        <Text color="gray.600">
                          <b>Paid?</b> {salary?.isPaid ? 'Yes' : 'No'}
                        </Text>
                        <Text color="gray.600">
                          <b>Leaves Taken:</b> {salary?.leavesTaken}
                        </Text>
                        <Text color="gray.600">
                          <b>Salary Approved?</b> {salary?.isSalaryApproved ? 'Yes' : 'No'}
                        </Text>
                        <Text color="gray.600">
                          <b>Advance:</b> {salary?.advance ? '500' : '00'}
                        </Text>
                        <Text color="gray.600">
                          <b>Loan Deduction:</b> {salary?.loanAmount.toFixed(0)}
                        </Text>
                        <Text color="gray.600">
                          <b>Bonus:</b> {salary?.bonus.toFixed(0)}
                        </Text>
                        <Text color="gray.600">
                          <b>Deduction:</b> {salary?.deduction.toFixed(0)}
                        </Text>
                      </SimpleGrid>
                    </Box>
                  ))}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </Stack>
    </Box>
  );
};

export default EmployeeDetails;