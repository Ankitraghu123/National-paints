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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { addHoliday } from "features/Holiday/HolidaySlice";
import { allHoliday } from "features/Holiday/HolidaySlice";

const AttendanceTable = () => {
  const dispatch = useDispatch();
  // const [holidays,setHolidays] = useState([])
  // const [selectedHolidayDate, setSelectedHolidayDate] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5); // Default entries per page
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input

  const employees = useSelector((state) => state.employee?.allEmployees);

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday())
  }, [dispatch]);

  useEffect(() => {
    const days = Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );
    setDaysInMonth(days);
  }, [year, month]);

  // const handleAddHoliday = () => {
  //   if (selectedHolidayDate) {
  //     // Dispatch action to add holiday
  //     dispatch(addHoliday({ date: selectedHolidayDate }));
  //     // Add selected date to holiday dates array
  //     setHolidays([...holidays, selectedHolidayDate]);
  //     setSelectedHolidayDate(''); // Clear the input after dispatch
  //   }
  // };

  const isSunday = (date) => {
    return new Date(year, month, date).getDay() === 0; // Sunday is 0
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal); // Whole hours
    const minutes = Math.round((totalHoursDecimal - hours) * 60); // Convert decimal to minutes
    return `${hours} : ${minutes}`; // Format as required
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
        return total + 8 + overtimeHours; // 8 hours for Sunday plus overtime
      }
  
      return total + hoursForDay + overtimeHours; 
    }, 0);
  
    return formatHours(totalHoursDecimal); 
  };

  const calculateOvertime = (checkIn, checkOut) => {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const diffInHours =
      (checkOutTime - checkInTime) / (1000 * 60 * 60); 
    return diffInHours > 8 ? diffInHours - 8 : 0; 
  };

  const calculateTotalSalary = (monthlySalary, hours,daysInMonth) => {
    const salaryPerMinute = monthlySalary / (daysInMonth * 8 * 60); 
  
    const [hourPart, minutePart] = hours.split(':').map(Number); 
    const totalMinutes = hourPart * 60 + minutePart; 
  
    const totalSalary = salaryPerMinute * totalMinutes;
  
    return parseFloat(totalSalary.toFixed(2)); 
  };

  const calculateDailySalary = (monthlySalary, hours, daysInMonth) => {
    console.log(hours)
    if (!hours || !hours.includes(':')) {
      console.error("Invalid hours format:", hours);
      return 0;  // Return a fallback value like 0 in case of invalid input
    }
  
    const salaryPerMinute = monthlySalary / (daysInMonth * 8 * 60); 
    
    const [hourPart, minutePart] = hours.split(':').map(Number); 
    const totalMinutes = (hourPart || 0) * 60 + (minutePart || 0);  // Default to 0 if NaN
  const totalSalary = salaryPerMinute * totalMinutes
    ;  
    return parseFloat(totalSalary.toFixed(2)); 
  };
  

  const getDailyHours = (attendanceRecord, day) => {
    const isCurrentDaySunday = isSunday(day); 
  
    if (!attendanceRecord) return isCurrentDaySunday ? formatHours(8) : "0 : 0";
  
    const hoursForDay = attendanceRecord.totalHours || 0;
    const overtimeHours =
      attendanceRecord.checkIn && attendanceRecord.checkOut
        ? calculateOvertime(attendanceRecord.checkIn, attendanceRecord.checkOut)
        : 0;
  
    let totalDailyHours = hoursForDay + overtimeHours;
  
    // Variables to track if lunch deduction should be applied
    let shouldDeductLunch = false;
  
    // Iterate through all timeLogs to check for lunch deduction
    for (let i = 0; i < attendanceRecord.timeLogs.length; i++) {
      const checkInTime = new Date(attendanceRecord.timeLogs[i].checkIn);
      const checkOutTime = new Date(attendanceRecord.timeLogs[i].checkOut);
  
      // Check if lunch deduction should apply
      if (checkInTime.getHours() < 13 && checkOutTime.getHours() > 14) {
        shouldDeductLunch = true;
        break; // No need to check further if lunch deduction already applies
      }
    }
  
    // Deduct lunch time if applicable
    if (shouldDeductLunch) {
      totalDailyHours -= 0.5; // Deduct 30 minutes (0.5 hours)
    }
  
    const formattedHours = formatHours(isCurrentDaySunday ? totalDailyHours + 8 : totalDailyHours);


  return {
    formattedHours,
    shouldDeductLunch, // Return this value to render conditionally
  };  
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

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      {/* Year and Month Selection */}
      <Box display="flex" alignItems="center" gap={4} mb={4}>
        <Box>
          <Text mb={2}>Year:</Text>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="2000"
            max="2100"
            width="100px"
          />
        </Box>
        <Box>
          <Text mb={2}>Month:</Text>
          <Select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            width="150px"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </Select>
        </Box>
      </Box>

      {/* <Box mb={4}>
        <Text mb={2}>Select Holiday Date:</Text>
        <Input
          type="date"
          value={selectedHolidayDate}
          onChange={(e) => setSelectedHolidayDate(e.target.value)}
        />
        <Button mt={2} onClick={handleAddHoliday}>
          Add Holiday
        </Button>
      </Box> */}

      {/* Search Bar */}
      <Box mb={4}>
        <Text mb={2}>Search by Employee Name:</Text>
        <Input
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Entries per page selection */}
      <Box mb={4}>
        <Text mb={2}>Entries per page:</Text>
        <Select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          width="150px"
        >
          {[5, 10, 15, 20].map((option) => (
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
              <Th>Employee Name</Th>
              {daysInMonth.map((day) => (
                <Th
                  key={day}
                  style={isSunday(day) ? { color: "red" } : {}}
                >
                  {isSunday(day) ? day + '(Sun)' : day}
                </Th>
              ))}
              <Th>Total Hours</Th>
              <Th>Total Salary</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((employee) => (
              <Tr key={employee._id}>
                <Td>{employee.name}</Td>
                {daysInMonth.map((day) => {
  const attendanceRecord = employee.attendanceTime.find((record) => {
    const recordDate = new Date(record.date).getDate();
    return (
      recordDate === day &&
      new Date(record.date).getFullYear() === year &&
      new Date(record.date).getMonth() === month
    );
  });

  const isCurrentDaySunday = isSunday(day);
  const { formattedHours, shouldDeductLunch } = getDailyHours(attendanceRecord, day);
  const todaysSalary = calculateDailySalary(employee.salary, formattedHours, daysInMonth.length);

  return (
    <Td key={day} style={isCurrentDaySunday ? { color: "red" } : {}}>
      {isCurrentDaySunday && !attendanceRecord
        ? formatHours(8)
        : formattedHours ? formattedHours : 0}
      <br />
      {/* Today's Salary: {isCurrentDaySunday && !attendanceRecord ?calculateDailySalary(employee.salary, getDailyHours(attendanceRecord, day), daysInMonth.length) :todaysSalary} */}
      {shouldDeductLunch && <Text color="gray">Lunch: 30 min</Text>}
    </Td>
  );
})}
                <Td>{calculateTotalHours(employee.attendanceTime)}</Td>
                <Td> {calculateTotalSalary(
                    employee.salary,
                    calculateTotalHours(employee.attendanceTime),
                    daysInMonth.length 
                  )}</Td>

              </Tr>
            ))}
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

export default AttendanceTable;





