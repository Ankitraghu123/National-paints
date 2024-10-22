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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allEmployee } from "features/Employee/EmployeeSlice";
import { allHoliday } from "features/Holiday/HolidaySlice";
import { putSalary } from "features/Employee/EmployeeSlice";
import { CSVLink } from 'react-csv';


const AttendanceTable = () => {
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
  const employees = allEmployees?.filter((employee) => employee.empType === 'labour');
  const {monthSalary} = useSelector(state => state.employee)
  const today = new Date();
  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday())
  }, [dispatch,monthSalary]);

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
    return new Date(year, month, date).getDay() === 0; // Sunday is 0
  };

  const formatHours = (totalHoursDecimal) => {
    const hours = Math.floor(totalHoursDecimal); // Whole hours
    const minutes = Math.round((totalHoursDecimal - hours) * 60); // Convert decimal to minutes
    return `${hours} : ${minutes}`; // Format as required
  };

  const calculateTotalHours = (attendanceRecords) => {
    let totalHours = 0;
    let totalMinutes = 0;
  
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
  
      let hoursForDay = attendanceRecord ? attendanceRecord.totalHours : 0;
      let shouldDeductLunch = false;
  
      if (attendanceRecord && attendanceRecord.timeLogs) {
        for (let i = 0; i < attendanceRecord.timeLogs.length; i++) {
          const checkInTime = new Date(attendanceRecord.timeLogs[i].checkIn);
          const checkOutTime = new Date(attendanceRecord.timeLogs[i].checkOut);
  
          if (checkInTime.getHours() < 13 && checkOutTime.getHours() > 14) {
            shouldDeductLunch = true;
            break; // No need to check further if lunch deduction already applies
          }
        }
      }
  
      if (shouldDeductLunch) {
        hoursForDay -= 0.5; // Deduct 30 minutes for lunch
      }
  
      // Convert hoursForDay into hours and minutes
      const currentHours = Math.floor(hoursForDay); // Integer part (hours)
      const currentMinutes = Math.round((hoursForDay - currentHours) * 60); // Decimal part (minutes)
  
      totalHours += currentHours;
      totalMinutes += currentMinutes;
  
      // Convert total minutes into hours if it exceeds 60
      if (totalMinutes >= 60) {
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60; // Remaining minutes after converting to hours
      }
  
      if ((!attendanceRecord && isSunday(day)) || (!attendanceRecord && isHoliday(day))) {
        totalHours += 8; // Default 8 hours for Sundays or holidays
      }
      return total;
    }, 0);
  
    // Format the final result as hours and minutes
    return `${totalHours} : ${totalMinutes} `;
  };


  // const calculateOvertime = (attendanceRecords) => {
  //   let totalOvertime = 0;
  
  //   attendanceRecords.forEach(record => {
  //     record.timeLogs.forEach(log => {
  //       const checkIn = new Date(log.checkIn);
  //       const checkOut = new Date(log.checkOut);
  
  //       // Ensure both checkIn and checkOut are valid
  //       if (checkIn && checkOut) {
  //         // Calculate total worked hours minus lunch (30 minutes)
  //         let workedHours = (checkOut - checkIn) / (60 * 60 * 1000); // Convert to hours
  
  //         // Deduct 0.5 hours for lunch if applicable
  //         if (checkIn.getHours() < 13 && checkOut.getHours() > 14) {
  //           workedHours -= 0.5; // Deduct 30 minutes (0.5 hours)
  //         }
  
  //         // Check if worked hours exceed 8.5 hours (after lunch deduction)
  //         if (workedHours > 8.5) {
  //           totalOvertime += workedHours - 8; // Add overtime beyond 8.5 hours
  //         }
  //       }
  //     });
  //   });
  
  //   return totalOvertime; // Return in hours
  // };
  
  const calculateTotalSalary = (monthlySalary, hours,daysInMonth) => {
    const salaryPerMinute = monthlySalary / (daysInMonth * 8 * 60); 
  
    const [hourPart, minutePart] = hours.split(':').map(Number); 
    const totalMinutes = hourPart * 60 + minutePart; 
  
    const totalSalary = salaryPerMinute * totalMinutes;
  
    return parseFloat(totalSalary.toFixed(2)); 
  };

  const calculateDailySalary = (monthlySalary, hours, daysInMonth) => {
    if (!hours || !hours.includes(':')) {
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
  // console.log(attendanceRecord.totalHours)
    const hoursForDay = attendanceRecord.totalHours || 0;
    const overtimeHours =
      attendanceRecord.checkIn && attendanceRecord.checkOut
        ? calculateOvertime(attendanceRecord.checkIn, attendanceRecord.checkOut)
        : 0;
  
    let totalDailyHours = hoursForDay ;
  
    // Variables to track if lunch deduction should be applied
    let shouldDeductLunch = false;
  
    // Iterate through all timeLogs to check for lunch deduction
    for (let i = 0; i < attendanceRecord.timeLogs.length; i++) {
      const checkInTime = new Date(attendanceRecord.timeLogs[i].checkIn);
      const checkOutTime = new Date(attendanceRecord.timeLogs[i].checkOut);
      // console.log(checkInTime.getHours(),checkOutTime.getHours())

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

    if(isHoliday(day)){
      totalDailyHours += 8
    }
  
    const formattedHours = formatHours(isCurrentDaySunday ? totalDailyHours + 8 : totalDailyHours);


  return {
    formattedHours,
    shouldDeductLunch, // Return this value to render conditionally
  };  
  };
  
  const approveSalaryHandler = (emp,len) => {
    const totalSalary = calculateTotalSalary(
      emp.salary,
      calculateTotalHours(emp.attendanceTime),
      len
    )

    const lastDay = new Date(year, month+1, 0)

    dispatch(putSalary({month:lastDay,amount:totalSalary,empId:emp._id}))

  }


  const isSalaryApproved = (emp) => {
    if (!emp.salaryArray || emp.salaryArray.length === 0) {
      return false;
    }
  
    const salaryFound = emp.salaryArray.some(salaryRecord => {
      // console.log(salaryRecord);
  
      const recordMonth = new Date(salaryRecord.month).getMonth() + 1;
      const recordYear = new Date(salaryRecord.month).getFullYear();
      return (recordMonth === month+1) && (recordYear === year);
    });
  
    return salaryFound;
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

    const csvData = useMemo(() => {
      return currentEmployees?.map((employee) => {
        const dailyHours = daysInMonth?.map((day) => {
          const attendanceRecord = employee.attendanceTime?.find((record) => {
            const recordDate = new Date(record.date).getDate();
            return (
              recordDate === day &&
              new Date(record.date).getFullYear() === year &&
              new Date(record.date).getMonth() === month
            );
          });
    
          // Use getDailyHours to get the formatted hours
          const { formattedHours } = getDailyHours(attendanceRecord, day);
    
          // If there's no attendance record, check if it's a holiday or Sunday
          if (!attendanceRecord) {
            return isHoliday(day) ? 8 : isSunday(day) ? 8 : 0;
          }
    
          return formattedHours || 0;
        });
    
        // Calculate total hours based on daily hours array
        const totalHours = calculateTotalHours(employee.attendanceTime);
    
        return {
          name: employee.name,
          totalHours,
          totalSalary: calculateTotalSalary(employee.salary, totalHours, daysInMonth.length),
          days: dailyHours,
        };
      });
    }, [currentEmployees, daysInMonth, year, month]);
    
    

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

      <CSVLink
        data={csvData?.map(employee => ({
          name: employee.name,
          ...employee.days.reduce((acc, hours, index) => {
            acc[`Day ${index + 1}`] = hours;
            return acc;
          }, {}),
          totalHours: employee.totalHours,
          totalSalary: employee.totalSalary,
        }))}
        filename={`labourAttendance.csv`}
        className="btn btn-primary"
        target="_blank"
      >
        Export CSV
      </CSVLink>

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
                  {isSunday(day) ? day + '(Sun)' :isHoliday(day) ? day +`(${ getHolidayNameByDate(day)})` : day}
                </Th>
              ))}
              {/* <Th>Overtime Hours</Th> */}
              <Th>Total Hours</Th>
              <Th>Total Salary</Th>
              <Th>Approve</Th>
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
        ? formatHours(8) : isHoliday(day) && !attendanceRecord ? formatHours(8) :
         formattedHours ? formattedHours : 0}
      <br />
      {/* Today's Salary: {isCurrentDaySunday && !attendanceRecord ?calculateDailySalary(employee.salary, getDailyHours(attendanceRecord, day), daysInMonth.length) :todaysSalary} */}
      {/* {shouldDeductLunch && <Text color="gray">Lunch: 30 min</Text>} */}
    </Td>
  );
})}
                {/* <Td>{calculateOvertime(employee.attendanceTime)}</Td> */}
                <Td>{calculateTotalHours(employee.attendanceTime)}</Td>
                <Td> {calculateTotalSalary(
                    employee.salary,
                    calculateTotalHours(employee.attendanceTime),
                    daysInMonth.length 
                  )}</Td>
                  <Td className={isSalaryApproved(employee) ? 'green' : 'red'} onClick={() => !isSalaryApproved(employee) ? approveSalaryHandler(employee,daysInMonth.length) : ''}> {isSalaryApproved(employee) ? "Already Approved" : "Approve Salary"}</Td>

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





