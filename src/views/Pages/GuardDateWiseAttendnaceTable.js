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
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { allHoliday } from "features/Holiday/HolidaySlice";
import { CSVLink } from 'react-csv';
import { editAttendance } from "features/Attendance/AttendanceSlice";
import { checkOut } from "features/Attendance/AttendanceSlice";
import { FaDownload, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { deleteAttendance } from "features/Attendance/AttendanceSlice";

const GuardDateWiseAttendanceTable = () => {
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

  const allEmployees = useSelector((state) => state.employee?.allEmployees);

  const employees = allEmployees?.filter((employee) => employee.empType === 'guard' && !employee.delete);

  const {editedAttendnaceTime,deletedAttendance} = useSelector(state => state.attendance)

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday());
  }, [dispatch,editedAttendnaceTime,deletedAttendance]);


  

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

  const calculateTotalHours = (attendanceRecords) => {
    const totalHoursDecimal = daysInMonth.reduce((total, day) => {
      const currentDate = new Date(year, month, day);
      const attendanceRecord = attendanceRecords.find((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getDate() === currentDate.getDate() &&
          recordDate.getFullYear() === currentDate.getFullYear() &&
          recordDate.getMonth() === currentDate.getMonth()
        );
      });
      const hoursForDay = attendanceRecord ? attendanceRecord.totalHours : 0;
      const overtimeHours =
        attendanceRecord && attendanceRecord.checkIn && attendanceRecord.checkOut
          ? calculateOvertime(attendanceRecord.checkIn, attendanceRecord.checkOut)
          : 0;

      if (isSunday(day)) {
        return total + 12 + overtimeHours; // 12 hours for Sunday plus overtime
      }

      return total + hoursForDay + overtimeHours;
    }, 0);

    return formatHours(totalHoursDecimal);
  };

  const extractTime = (isoString)=> {
    // Create a Date object from the ISO string
    const dateObject = new Date(isoString);
  
    // Extract hours, minutes, and seconds in UTC
    let hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const seconds = dateObject.getUTCSeconds();
  
    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
  
    // Format the time as HH:MM:SS AM/PM
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
  }


  const calculateOvertime = (checkIn, checkOut) => {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const diffInHours =
      (checkOutTime - checkInTime) / (1000 * 60 * 60);
    return diffInHours > 12 ? diffInHours - 12 : 0;
  };

  const calculateDailySalary = (monthlySalary, hours, daysInMonth) => {
    if (!hours || !hours.includes(':')) {
      console.error("Invalid hours format:", hours);
      return 0; // Return a fallback value like 0 in case of invalid input
    }

    const salaryPerMinute = monthlySalary / (daysInMonth * 12 * 60);
    const [hourPart, minutePart] = hours.split(':').map(Number);
    const totalMinutes = (hourPart || 0) * 60 + (minutePart || 0); // Default to 0 if NaN
    const totalSalary = salaryPerMinute * totalMinutes;

    return parseFloat(totalSalary.toFixed(2));
  };

  const getDailyHours = (attendanceRecord) => {
    if (!attendanceRecord || !attendanceRecord.timeLogs || attendanceRecord.timeLogs.length === 0) {
      return {
        formattedHours: "0:0",
        deductedLunch: "No",
      };
    }
  
    const firstLog = attendanceRecord.timeLogs[0];
    const checkInTime = firstLog.checkIn;
    const checkOutTime = firstLog.checkOut;
  
    if (!checkInTime || !checkOutTime) {
      return {
        formattedHours: "0:0",
        deductedLunch: "No",
      };
    }
  
    // Convert checkInTime and checkOutTime to Date objects
    let checkInDate = new Date(checkInTime);
    let checkOutDate = new Date(checkOutTime);
  
    // Round check-in and check-out times
    checkInDate = roundTime(checkInDate);
    checkOutDate = roundTime(checkOutDate);
  
    // If the checkOutTime is earlier than the checkInTime, it means the checkout is on the next day
    if (checkOutDate < checkInDate) {
      checkOutDate.setDate(checkOutDate.getDate() + 1); // Add 1 day to checkOutTime
    }
  
    // Calculate total hours worked (difference between check-out and check-in)
    const checkInMilliseconds = checkInDate.getTime();
    const checkOutMilliseconds = checkOutDate.getTime();
  
    let totalHours = (checkOutMilliseconds - checkInMilliseconds) / (1000 * 60 * 60); // Convert milliseconds to hours
  
    // Deduct lunch if conditions are met (check-in before 1 PM and check-out after 2 PM)
    const checkInHour = checkInDate.getUTCHours();
    const checkOutHour = checkOutDate.getUTCHours();
    
    return {
      formattedHours: formatHours(totalHours),
      deductedLunch: "No",
    };
  };

  const roundTime = (date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = roundMinutes(minutes);
  
    // Adjust hours if rounded minutes go to 60
    if (roundedMinutes === 60) {
      date.setHours(date.getHours() + 1, 0, 0, 0); // Increment the hour and set minutes to 0
    } else {
      date.setMinutes(roundedMinutes, 0, 0); // Set rounded minutes
    }
  
    return date;
  };

  const formatHours = (hours) => {
    const wholeHours = Math.floor(hours);
    const rawMinutes = (hours - wholeHours) * 60;
  
    const roundedMinutes = Math.round(rawMinutes);
  
    return `${wholeHours}:${roundedMinutes.toString().padStart(2, "0")}`;
  };
  
  // Custom rounding function for minutes
  const roundMinutes = (minutes) => {
    if (minutes <= 10) return 0;
    if (minutes <= 25) return 15;
    if (minutes <= 40) return 30;
    if (minutes <= 55) return 45;
    return 60; // Minutes > 55 round to the next hour
  };

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = employees
    ?.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())||
    employee._id.slice(-6).toLowerCase().includes(searchTerm.toLowerCase()) 
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

    const handleDeleteTime = (employee) => {
      dispatch(deleteAttendance({empId:employee._id,date:selectedDate}))
    };

    const saveNewTimes = () => {
      dispatch(editAttendance({empId:selectedEmployee._id,date:selectedDate,checkIn:newCheckInTime,checkOut:newCheckOutTime}))
      onClose();
    };

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    const exportToCSV = () => {
      const headers = ["S. No.", "Employee Name", "Employee Code", "Check In", "Check Out", "Total Hours"];
      const csvRows = [];
  
      // Add headers to csvRows
      csvRows.push(headers.join(","));
  
      currentEmployees.forEach((employee, idx) => {
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
  
        const { formattedHours } = getDailyHours(attendanceRecord);
  
        // Create a row for the current employee
        const row = [idx + 1, employee.name, employee.employeeCode, checkInTime, checkOutTime, formattedHours];
        csvRows.push(row.join(","));
      });
  
      // Create a Blob from the CSV data and trigger a download
      const csvData = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(csvData);
      const a = document.createElement("a");
      a.href = url;
      a.download = `guard_attendance_${selectedDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  

  return (
    <Box p={12} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
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
        <Text mb={2}>Search Employee</Text>
        <Input
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      </Flex>

      {/* Entries per page selection */}
      <Box display="flex" alignItems="end" justifyContent='space-between' gap={4} mb={4} id="table-col">
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
     <Button colorScheme="green" display={'flex'} gap={3} mb={4} onClick={exportToCSV}>
        Export to Excel <FaDownload />
      </Button>
     </Box>
      {/* Attendance Table */}
      <TableContainer maxHeight={'100vh'} overflowY="auto">
        <Table>
          <Thead id="head-fixed">
            <Tr>
              <Th>S.No</Th>
              <Th id="col-fixed">Employee Name</Th>
              <Th>Employee Code</Th>
              <Th>In</Th>
              <Th>Out</Th>
              {/* <Th>Lunch Deducted</Th> */}
              <Th>{new Date(selectedDate).getDate()} (Today's Working Hours) {new Date(selectedDate).getDay()  == 0 ? "Sunday" : ''}</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
  {currentEmployees?.map((employee,idx) => {
    const attendanceRecord = employee.attendanceTime.find((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getDate() === new Date(selectedDate).getDate() &&
        recordDate.getFullYear() === new Date(selectedDate).getFullYear() &&
        recordDate.getMonth() === new Date(selectedDate).getMonth()
      );
    });

    const {formattedHours,deductedLunch} = getDailyHours(attendanceRecord);

    return (
      <Tr key={employee._id}>
        <Td>{idx+1}</Td>
        <Td id="col-fixed">{employee.name}</Td>
        <Td>{employee.employeeCode}</Td>
        <Td>
          {attendanceRecord && attendanceRecord.timeLogs.length > 0 ? (
            attendanceRecord.timeLogs.map((log, index) => (
              <Text key={index}>
                {extractTime(log.checkIn)}
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
                               {extractTime(log.checkOut)}

              </Text>
            ))
          ) : (
            "A"
          )}
        </Td>
       
        {/* <Td>
          {deductedLunch ? deductedLunch : "No"}
        </Td> */}
        <Td>{formattedHours}
        </Td>
        <Td >
        <Tooltip label='Edit Attendance Time' placement="top">
          <Button me={2} colorScheme="blue" onClick={() => handleEditTime(employee, attendanceRecord)}>
          <FaEdit />
          </Button>
        </Tooltip>
        <Tooltip label='Delete Attendance Time' placement="top">
          <Button colorScheme="red" onClick={() => handleDeleteTime(employee, attendanceRecord)}>
          <MdDelete />
          </Button>
        </Tooltip>
                    </Td>
      </Tr>
    );
  })}
</Tbody>
        </Table>
      </TableContainer>

      <Flex mt={4} justify="space-between" align="center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>Page {currentPage} of {totalPages}</Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>



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

export default GuardDateWiseAttendanceTable;
