import { Box, Flex, Text, Table, Tbody, Tr, Td, Th, Button } from '@chakra-ui/react';
import { generateSalarySlip } from 'features/Employee/EmployeeSlice';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const SalarySlip = () => {
    const { id, month } = useParams();
    const dispatch = useDispatch();
    const printRef = useRef(); // useRef to reference the salary slip container

    const formatDate = (date) => {
        const dateObject = new Date(date);
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const day = String(dateObject.getDate()).padStart(2, '0');
        const month = monthNames[dateObject.getMonth()];
        const year = dateObject.getFullYear();

        return `${day} ${month} ${year}`;
    };

    const employee = useSelector((state) => state.employee.salarySlip);
    const totalSalary = employee?.salaryDetails?.amount;

    useEffect(() => {
        dispatch(generateSalarySlip({ empId: id, month }));
    }, [dispatch, id, month]);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Salary Slip</title>');
        printWindow.document.write(`
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .salary-slip {
                    max-width: 800px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    background-color: white;
                }
                .flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2px;
                    border-bottom: 2px solid black;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f9f9f9;
                }
                .text-end {
                    text-align: end;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    };

    return (
        <Box mt={20} maxW="800px" mx="auto" p="4" borderWidth="1px" borderRadius="md" boxShadow="md" bg="white">
            <Box ref={printRef} id="salary-slip" className="salary-slip">
                <Flex className='flex' justifyContent="space-between" alignItems="center" mb="4" borderBottom="2px solid" pb="2">
                    <Text fontSize="2xl" fontWeight="bold">SALARY SLIP</Text>
                    <Text fontSize="2xl" fontWeight="bold">{formatDate(employee?.salaryDetails?.month)}</Text>
                    <Text fontSize="lg" fontWeight="bold" color="green.600">CONFIDENTIAL</Text>
                </Flex>

                <Flex className='flex' justifyContent="space-between" mb="4">
                    <Box>
                        <Text><strong>Name :</strong> {employee?.employeeDetails?.name}</Text>
                        <Text><strong>Employee ID :</strong> {employee?.employeeDetails?._id}</Text>
                    </Box>
                    <Box>
                        <Text><strong>Designation :</strong> {employee?.employeeDetails.designation}</Text>
                        <Text><strong>Department :</strong> {employee?.employeeDetails.empType}</Text>
                    </Box>
                </Flex>

                <Table variant="simple" mb="4">
                    <Tbody>
                        <Tr>
                            <Th>Description</Th>
                            <Th>Earnings</Th>
                            <Th>Deductions</Th>
                        </Tr>
                        <Tr>
                            <Td>Basic Salary</Td>
                            <Td>{employee?.salaryDetails?.amount}</Td>
                            <Td></Td>
                        </Tr>
                        <Tr>
                            <Td>Transportation Allowance</Td>
                            <Td>0.00</Td>
                            <Td></Td>
                        </Tr>
                        <Tr>
                            <Td>Medical Allowance</Td>
                            <Td>0.00</Td>
                            <Td></Td>
                        </Tr>
                        <Tr>
                            <Td>Retirement Insurance</Td>
                            <Td></Td>
                            <Td>0.00</Td>
                        </Tr>
                        <Tr>
                            <Td>Tax</Td>
                            <Td></Td>
                            <Td>0.00</Td>
                        </Tr>
                    </Tbody>
                </Table>

                <Flex className='flex' justifyContent="space-between" mb="4">
                    <Text><strong>Total :</strong> {totalSalary}</Text>
                    <Text><strong>Deductions :</strong> 0.00</Text>
                </Flex>

                <Text className='text-end' fontWeight="bold" color="green.600" fontSize="xl" textAlign="right" mb="4">NET PAY: {totalSalary}</Text>

                <Text className='text-end' textAlign="right" fontSize="sm"><strong>Payment Date:</strong> {formatDate(new Date())}</Text>
            </Box>

            <Flex justifyContent="flex-end" mt={4}>
                <Button colorScheme="teal" className="no-print" onClick={handlePrint}>
                    Print Slip
                </Button>
            </Flex>
        </Box>
    );
};

export default SalarySlip;
