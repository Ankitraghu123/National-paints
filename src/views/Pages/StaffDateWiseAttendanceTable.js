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
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { allHoliday } from "features/Holiday/HolidaySlice";
import { editAttendance } from "features/Attendance/AttendanceSlice";
import { FaCross, FaDownload, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { deleteAttendance } from "features/Attendance/AttendanceSlice";
import { removeHalfDay } from "features/Attendance/AttendanceSlice";
import { restoreHalfDay } from "features/Attendance/AttendanceSlice";
import { TiTick } from "react-icons/ti";
import { RxCrossCircled } from "react-icons/rx";

const StaffDateWiseAttendanceTable = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [holidaysInMonth, setHolidaysInMonth] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [newCheckInTime, setNewCheckInTime] = useState("");
  const [newCheckOutTime, setNewCheckOutTime] = useState("");
  const allHolidays = useSelector(state => state.holiday.allHolidays)
  const today = new Date();

  const allEmployees = useSelector((state) => state.employee?.allEmployees);

  const employees = allEmployees?.filter((employee) => employee.empType === 'staff' && !employee.delete);
  const {editedAttendnaceTime,deletedAttendance} = useSelector(state => state.attendance)


  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday());
  }, [dispatch,editedAttendnaceTime,deletedAttendance]);

  useEffect(() => {
    const holidays = getHolidaysForMonth(month, year);
    setHolidaysInMonth(holidays);
  }, [month, year, allHolidays]);



  const getHolidaysForMonth = (month) => {
    return allHolidays?.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getMonth() === month && holidayDate.getFullYear() === today.getFullYear(); // Check for current year
    });
  };


  const isHoliday = (day) => {
    return holidaysInMonth?.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getDate() === day; // Check if the holiday's date matches the given day
    });
  };

  useEffect(() => {
    const days = Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );
    setDaysInMonth(days);
  }, [year, month]);

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal);
    const minutes = Math.round((totalHoursDecimal - hours) * 60);
    return `${hours} : ${minutes}`;
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

  const extractTime2 = (isoString) => {
    if (!isoString) {
      return "N/A"; // Return a default value or handle the case when isoString is undefined
    }
    // Split the ISO string into date and time parts
    const [date, time] = isoString.split("T");

    // Extract only the HH:mm part from the time
    const [hours, minutes] = time.split(":");

    return `${hours}:${minutes}`;
  };

  let consecutiveDailyLateDays = 0; 
    const getAttendance = (attendanceRecord) => {
      // Check if there are no attendance records
      const date = new Date(selectedDate);
      const day = date.getDate()
      
      if (!attendanceRecord) {
          const isSpecialDay = isHoliday(day);
          return isSpecialDay ? "P" : "A";
      }
  
      if (attendanceRecord?.timeLogs?.length > 0) {
          const { checkIn, checkOut } = attendanceRecord.timeLogs[0];
  
          // Define time boundaries as "HH:mm"
          const tenAM = "10:00";
          const threePM = "14:00";
          let checkInDate = new Date(checkIn);
          let checkOutDate = new Date(checkOut);
          // Extract only the time part (HH:mm) from the checkIn and checkOut
          const checkInHour = checkInDate.getUTCHours();
          const checkOutHour = checkOutDate.getUTCHours()
        // console.log(checkIn)
          // Check if the employee is late

          const isLate = checkInHour > 10;
          if (isLate) {
            consecutiveDailyLateDays++;
          } else {
            consecutiveDailyLateDays = 0;
          }
            // console.log(checkInHour)
          // Show "Half day" option only if late for 3 consecutive days
          if (consecutiveDailyLateDays >= 3) {
            return !attendanceRecord.removeHalfDay ? "Half day" : "P";
          }
          if ((checkInHour <= 14 && checkOutHour <= 14) || checkInHour > 14) {
            return !attendanceRecord.removeHalfDay ? "Half day" : "P";
          } else if (checkInHour <= 13) {
            return "P";
          }
      }
      
      if (!attendanceRecord.removeDay) {
        return "P";
    }

      return "A";
  };

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = employees
    ?.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) 

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

    const exportToCSV = () => {
      const headers = ["S. No.", "Employee Name", "Employee Code", "Check In", "Check Out", "Attendance"];
      const csvRows = [];

      // Add headers to csvRows
      csvRows.push(headers.join(","));

      currentEmployees.forEach((employee, index) => {
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
        const row = [
          index + 1, // S. No.
          employee.name,
          employee.employeeCode,
          checkInTime,
          checkOutTime,
          attendance
        ];
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

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

    const removeHalfPaid = (empId) => {
    
      dispatch(removeHalfDay({empId,date:selectedDate}))
    }

    const restoreHalfPaid = (empId) => {
      
      dispatch(restoreHalfDay({empId,date:selectedDate}))
    }

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

      <Button colorScheme="green" onClick={exportToCSV} mb={4} gap={3}>
        Export to Exel <FaDownload />
      </Button>
      </Box>

      {/* Attendance Table */}
      <TableContainer maxHeight={'100vh'} overflowY="auto">
        <Table>
          <Thead id='head-fixed'>
            <Tr>
            <Th>S.No</Th>
              <Th id="col-fixed">Employee Name</Th>
              <Th>Employee Code</Th>
              <Th>In</Th>
              <Th>Out</Th>
              {/* <Th>Lunch Deducted</Th> */}
              <Th>{new Date(selectedDate).getDate()} (Today's Attendnace) {new Date(selectedDate).getDay()  == 0 ? "Sunday" : ''}</Th>
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


    return (
      <Tr key={employee._id}>
        <Td>{idx + 1}</Td>
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
       
        <Td>{getAttendance(attendanceRecord)}
        </Td>
        <Td >
                      <Tooltip label='Edit Attendance' placement='top'>
                        <Button me={2} colorScheme="blue" onClick={() => handleEditTime(employee, attendanceRecord)}>
                        <FaEdit/>
                        </Button>
                      </Tooltip>
                      <Tooltip label='Delete Attendance Time' placement="top">
          <Button me={2} colorScheme="red" onClick={() => handleDeleteTime(employee, attendanceRecord)}>
          <MdDelete />
          </Button>
        </Tooltip>
        <Tooltip label='Change to Present' placement="top">
          <Button me={2} colorScheme="red" onClick={() => removeHalfPaid(employee._id)}>
          <RxCrossCircled  />
          </Button>
        </Tooltip>
        <Tooltip label='Change to Half Day' placement="top">
          <Button me={2} colorScheme="green" onClick={() => restoreHalfPaid(employee._id)}>
          <TiTick />
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

export default StaffDateWiseAttendanceTable;
