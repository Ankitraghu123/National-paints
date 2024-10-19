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
import { allHoliday } from "features/Holiday/HolidaySlice";

const SalesAttendanceTable = () => {
  const dispatch = useDispatch();
 
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50); // Default entries per page
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input
  const allHolidays = useSelector(state => state.holiday.allHolidays)
  const [holidaysInMonth, setHolidaysInMonth] = useState([]);

  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter((employee) => employee.empType === 'sales');
  const today = new Date();
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

  useEffect(() => {
    const holidays = getHolidaysForMonth(month, year);
    setHolidaysInMonth(holidays);
  }, [month, year, allHolidays]);

  console.log(holidaysInMonth)


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

const getHolidayNameByDate = (day) => {
  const holiday = holidaysInMonth?.find(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getDate() === day && 
           holidayDate.getMonth() === month && // Assuming `month` is the current month
           holidayDate.getFullYear() === today.getFullYear(); // Assuming `today` is a Date object
  });

  return holiday ? holiday.name : "N/A"; // Return the name if found, otherwise null
};

  const isSunday = (date) => {
    return new Date(year, month, date).getDay() === 0; 
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal); // Whole hours
    const minutes = Math.round((totalHoursDecimal - hours) * 60); // Convert decimal to minutes
    return `${hours} : ${minutes}`; // Format as required
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

    const calculateTotalDays = (attendanceRecords) => {
        let totalDaysWorked = 0; // Total days worked
        let totalHalfDays = 0; // Count for half days
        let totalAbsences = 0; // Count for absences
    
        daysInMonth.forEach((day) => {
            const currentDate = new Date(year, month, day);
        
            const attendanceRecord = attendanceRecords.find((record) => {
                const recordDate = new Date(record.date);
                return (
                    recordDate.getDate() === currentDate.getDate() &&
                    recordDate.getFullYear() === currentDate.getFullYear() &&
                    recordDate.getMonth() === currentDate.getMonth()
                );
            });
    
            if (attendanceRecord && attendanceRecord.timeLogs.length > 0) {
                const checkOutTime = new Date(attendanceRecord.timeLogs[0].checkOut);
                const threePM = new Date(checkOutTime);
                threePM.setHours(15, 0, 0, 0); // Set 3 PM time
    
                // Check if the checkout time determines full or half day
                if (checkOutTime < threePM) {
                    totalHalfDays++; // Count as half day
                } else {
                    totalDaysWorked += 1; // Count as full day
                }
            } else {
                totalAbsences++; // Count as absence
            }

            if(isSunday(day) || isHoliday(day)){
                totalDaysWorked += 1
            }
        });
    
        totalDaysWorked += totalHalfDays * 0.5; 
    
        return totalDaysWorked.toFixed(1)
    }

    const calculateTotalSalary = (salary,attendanceRecords) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const totalDaysWorked = calculateTotalDays(attendanceRecords);
        const dailySalary = salary / daysInMonth;
        const totalSalary = dailySalary * totalDaysWorked;
        return totalSalary.toFixed(2)
    }
      
      

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
        <Text mb={2}>Search by Employee Name:</Text>
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

      {/* Attendance Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              {daysInMonth?.map((day) => (
                <Th
                  key={day}
                  style={isSunday(day) ? { color: "red" } : {}}
                >
                  {isSunday(day) ? day + '(Sun)' :isHoliday(day) ? day +`(${ getHolidayNameByDate(day)})` : day}
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
                {daysInMonth?.map((day) => {
  const attendanceRecord = employee.attendanceTime.find((record) => {
    const recordDate = new Date(record.date).getDate();
    return (
      recordDate === day &&
      new Date(record.date).getFullYear() === year &&
      new Date(record.date).getMonth() === month
    );
  });

  const isCurrentDaySunday = isSunday(day);
//   const { formattedHours, shouldDeductLunch } = getDailyHours(attendanceRecord, day);
  

  return (
    <Td key={day} style={isCurrentDaySunday ? { color: "red" } : {}}>
      {isCurrentDaySunday && !attendanceRecord
        ? formatHours(8) : isHoliday(day) && !attendanceRecord ? formatHours(8) :
          getAttendance(attendanceRecord)}
      <br />
    </Td>
  );
})}
                <Td>{calculateTotalDays(employee?.attendanceTime)}</Td>
                <Td> 
                    {calculateTotalSalary(employee.salary,employee?.attendanceTime)}
                  </Td>

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

export default SalesAttendanceTable;