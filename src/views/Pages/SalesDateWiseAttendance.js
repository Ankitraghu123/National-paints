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
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { allHoliday } from "features/Holiday/HolidaySlice";
import { editAttendance } from "features/Attendance/AttendanceSlice";
import { FaDownload, FaEdit } from "react-icons/fa";

const SalesDateWiseAttendanceTable = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [newCheckInTime, setNewCheckInTime] = useState("");
  const [newCheckOutTime, setNewCheckOutTime] = useState("");
  const editedAttendanceTime = useSelector(state=> state.attendance.editedAttendanceTime?.attendance)

  const allEmployees = useSelector((state) => state.employee?.allEmployees);

  const employees = allEmployees?.filter((employee) => employee.empType === 'sales');

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday());
  }, [dispatch,editedAttendanceTime]);

  

  useEffect(() => {
    const days = Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );
    setDaysInMonth(days);
  }, [year, month]);

  const isSunday = (date) => {
    return new Date(date).getDay() === 0;
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal);
    const minutes = Math.round((totalHoursDecimal - hours) * 60);
    return `${hours} : ${minutes}`;
  };

  const getAttendance = (attendanceRecord) => {
    // Check if there are timeLogs and at least one checkIn
    if (attendanceRecord?.timeLogs?.length > 0) {
        const { checkIn, checkOut } = attendanceRecord.timeLogs[0];

        // Convert checkOut time to a Date object and compare with 3 PM
        const checkOutTime = new Date(checkOut);
        const threePM = new Date(checkOutTime);
        threePM.setHours(15, 0, 0, 0); // Set 3:00 PM

        if (checkIn && checkOut && checkOutTime < threePM) {
            // If there's a checkIn and checkOut is before 3 PM, it's half day
            return "Half day";
        } else if (checkIn) {
            // If there's a checkIn but not before 3 PM, it's a full present
            return "P";
        }
    }

    // If no checkIn, it's absent
    return "A";
};

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = employees
    ?.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    );

    const handleEditTime = (employee, attendanceRecord) => {
      setSelectedEmployee(employee);
      setSelectedAttendanceRecord(attendanceRecord);
      setNewCheckInTime(attendanceRecord?.checkIn || "");
      setNewCheckOutTime(attendanceRecord?.checkOut || "");
      onOpen();
    };

    const saveNewTimes = () => {
      dispatch(editAttendance({empId:selectedEmployee._id,date:selectedDate,checkIn:newCheckInTime,checkOut:newCheckOutTime}))
      onClose();
    };

    const exportToCSV = () => {
      const headers = ["Employee Name", "Check In", "Check Out", "Attendance"];
      const csvRows = [];
  
      // Add headers to csvRows
      csvRows.push(headers.join(","));
  
      currentEmployees.forEach((employee) => {
        const attendanceRecord = employee.attendanceTime.find((record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getDate() === new Date(selectedDate).getDate() &&
            recordDate.getFullYear() === new Date(selectedDate).getFullYear() &&
            recordDate.getMonth() === new Date(selectedDate).getMonth()
          );
        });
  
        const checkInTime = attendanceRecord && attendanceRecord.timeLogs.length > 0
          ? attendanceRecord.timeLogs.map(log => new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).join("; ")
          : "A";
  
        const checkOutTime = attendanceRecord && attendanceRecord.timeLogs.length > 0
          ? attendanceRecord.timeLogs.map(log => new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })).join("; ")
          : "A";
  
        const attendance = getAttendance(attendanceRecord);
  
        // Create a row for the current employee
        const row = [employee.name, checkInTime, checkOutTime, attendance];
        csvRows.push(row.join(","));
      });
  
      // Create a Blob from the CSV data and trigger a download
      const csvData = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(csvData);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${selectedDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      {/* Year and Month Selection */}
      

      {/* Date Selection */}
      <Flex justifyContent={'space-between'} id="table-col">
      <Box width={'48%'} mb={4} id="full-width">
        <Text mb={2}>Select Date:</Text>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Box>

      {/* Search Bar */}
      <Box width={'48%'} mb={4} id="full-width">
        <Text mb={2}>Search by Employee Name:</Text>
        <Input
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      </Flex>

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

      <Button colorScheme="green" gap={3} onClick={exportToCSV} mb={4}>
        Export to Exel <FaDownload />
      </Button>

      {/* Attendance Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>In</Th>
              <Th>Out</Th>
              {/* <Th>Lunch Deducted</Th> */}
              <Th>{new Date(selectedDate).getDate()} (Today's Attendnace) {new Date(selectedDate).getDay()  == 0 ? "Sunday" : ''}</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
  {currentEmployees?.map((employee) => {
    const attendanceRecord = employee.attendanceTime.find((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === new Date(selectedDate).getDate() &&
        recordDate.getFullYear() === new Date(selectedDate).getFullYear() &&
        recordDate.getMonth() === new Date(selectedDate).getMonth()
      );
    });


    return (
      <Tr key={employee._id}>
        <Td>{employee.name}</Td>
       
        <Td>
          {attendanceRecord && attendanceRecord.timeLogs.length > 0 ? (
            attendanceRecord.timeLogs.map((log, index) => (
              <Text key={index}>
                {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            ))
          ) : (
            "A"
          )}
        </Td>
        <Td>
          {attendanceRecord && attendanceRecord.timeLogs.length > 0 ? (
            attendanceRecord.timeLogs.map((log, index) => (
              <Text key={index}>
                {new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            ))
          ) : (
            "A"
          )}
        </Td>
       
        <Td>{getAttendance(attendanceRecord)}
        </Td>
        <Td onClick={() => handleEditTime(employee, attendanceRecord)}>
                      <FaEdit/>
                    </Td>
      </Tr>
    );
  })}
</Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit In/Out Times</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>In Time:</Text>
            <Input
              type="time"
              value={newCheckInTime}
              onChange={(e) => setNewCheckInTime(e.target.value)}
            />

            <Text mb={2} mt={4}>Out Time:</Text>
            <Input
              type="time"
              value={newCheckOutTime}
              onChange={(e) => setNewCheckOutTime(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveNewTimes}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SalesDateWiseAttendanceTable;
