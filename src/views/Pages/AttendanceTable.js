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
import { putSalary, pullSalary } from "features/Employee/EmployeeSlice";
import { CSVLink } from "react-csv";
import { FaCross, FaDownload } from "react-icons/fa";
import { checkIn } from "features/Attendance/AttendanceSlice";
import { RxCrossCircled } from "react-icons/rx";
import { removeDay } from "features/Attendance/AttendanceSlice";
import { restoreDay } from "features/Attendance/AttendanceSlice";
import { TiTick } from "react-icons/ti";

const AttendanceTable = () => {
  const dispatch = useDispatch();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50); // Default entries per page
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input
  const allHolidays = useSelector((state) => state.holiday.allHolidays);
  const [holidaysInMonth, setHolidaysInMonth] = useState([]);

  const allEmployees = useSelector((state) => state.employee?.allEmployees);
  const employees = allEmployees?.filter(
    (employee) => employee.empType === "labour" && !employee.delete
  );
  const { monthSalary } = useSelector((state) => state.employee);
  const { removedDay, restoredDay } = useSelector((state) => state.attendance);

  const today = new Date();
  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday());
  }, [dispatch, monthSalary, removedDay, restoredDay]);

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

  const getHolidaysForMonth = (month) => {
    return allHolidays?.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getMonth() === month &&
        holidayDate.getFullYear() === today.getFullYear()
      ); // Check for current year
    });
  };

  const isHoliday = (day) => {
    return holidaysInMonth?.some((holiday) => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getDate() === day; // Check if the holiday's date matches the given day
    });
  };

  const getHolidayNameByDate = (day) => {
    const holiday = holidaysInMonth?.find((holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getDate() === day &&
        holidayDate.getMonth() === month && // Assuming `month` is the current month
        holidayDate.getFullYear() === today.getFullYear()
      ); // Assuming `today` is a Date object
    });

    return holiday ? holiday.name : "N/A"; // Return the name if found, otherwise null
  };

  // const isSunday = (date) => {
  //   return new Date(year, month, date).getDay() === 0; // Sunday is 0
  // };

  const roundMinutes = (minutes) => {
    if (minutes <= 10) return 0;
    if (minutes <= 25) return 15;
    if (minutes <= 40) return 30;
    if (minutes <= 55) return 45;
    return 60; // Minutes > 55 round to the next hour
  };

  const formatHours = (hours) => {
    const wholeHours = Math.floor(hours);
    const rawMinutes = (hours - wholeHours) * 60;

    const roundedMinutes = Math.round(rawMinutes);

    return `${wholeHours}:${roundedMinutes.toString().padStart(2, "0")}`;
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

  const getDailyHours = (attendanceRecord, day) => {
    // Helper function to check if it's Sunday
    // const isSunday = (day) => day === "sunday";
    // let totalHours = 0
    // console.log(attendanceRecord)
    if (!attendanceRecord) {
      const isSpecialDay = isHoliday(day);
      return {
        formattedHours: isSpecialDay ? "8:0" : "0:0",
        deductedLunch: "No",
      };
    }
    // Extract the first time log
    const firstLog = attendanceRecord?.timeLogs[0];
    const checkInTime = firstLog?.checkIn;
    const checkOutTime = firstLog?.checkOut;

    // If either check-in or check-out is missing
    if (!checkInTime || !checkOutTime) {
      return {
        formattedHours:
          isHoliday(day) && !attendanceRecord?.removeDay ? "8:0" : "0:0",
        deductedLunch: "No",
      };
    }

    // Convert check-in and check-out to Date objects
    let checkInDate = new Date(checkInTime);
    let checkOutDate = new Date(checkOutTime);

    checkInDate = roundTime(checkInDate);
    checkOutDate = roundTime(checkOutDate);

    if (checkInDate.getUTCHours() === 10 && checkInDate.getUTCMinutes() <= 10) {
      checkInDate.setUTCMinutes(0);
    }

    // Handle overnight shift by adjusting check-out date
    if (checkOutDate < checkInDate) {
      checkOutDate.setDate(checkOutDate.getDate() + 1);
    }

    // Calculate total hours worked
    const checkInMilliseconds = checkInDate.getTime();
    const checkOutMilliseconds = checkOutDate.getTime();
    let totalHours =
      (checkOutMilliseconds - checkInMilliseconds) / (1000 * 60 * 60); // Convert to hours

    // Deduct lunch break if applicable (check-in before 1 PM and check-out after 2 PM)
    const checkInHour = checkInDate.getUTCHours();
    const checkOutHour = checkOutDate.getUTCHours();

    const isLunchDeductible =
      (checkInHour < 14 && checkOutHour > 14) || checkOutTime < checkInTime;

    if (isLunchDeductible) {
      totalHours -= 0.5; // Deduct 30 minutes for lunch
    }

    // Add 8 hours for Sundays or holidays
    if (isHoliday(day) && !attendanceRecord.removeDay) {
      totalHours += 8;
    }

    return {
      formattedHours: formatHours(totalHours),
      deductedLunch: isLunchDeductible ? "Yes" : "No",
    };
  };

  const calculateTotalHours = (attendanceRecords) => {
    let totalHours = 0;
    let totalMinutes = 0;

    daysInMonth?.forEach((day) => {
      const currentDate = new Date(year, month, day);
      const dayString = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      // const isSunday = currentDate.getDay() === 0; // Check if it's Sunday

      const attendanceRecord = attendanceRecords?.find((record) => {
        const recordDate = new Date(record.date).getDate();
        return (
          recordDate === day &&
          new Date(record.date).getFullYear() === year &&
          new Date(record.date).getMonth() === month
        );
      });

      const { formattedHours } = getDailyHours(attendanceRecord, day);
      const [dailyHours, dailyMinutes] = formattedHours.split(":").map(Number);

      totalHours += dailyHours;
      totalMinutes += dailyMinutes;
      // console.log(formattedHours)
      // Convert minutes to hours if they exceed 60
      if (totalMinutes >= 60) {
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes %= 60; // Remaining minutes
      }
    });

    return `${totalHours}:${totalMinutes}`;
  };

  const calculateTotalOvertime = (attendanceRecords) => {
    let totalOvertimeHours = 0;

    // Loop through each day in the month
    daysInMonth?.forEach((day) => {
      // console.log(day)
      const currentDate = new Date(year, month, day);
      const dayString = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      // Find attendance record for the current day
      const attendanceRecord = attendanceRecords?.find((record) => {
        const recordDate = new Date(record.date)?.toISOString().split("T")[0];
        return recordDate === dayString;
      });

      // Calculate overtime for the day if attendance exists
      if (attendanceRecord) {
        const dailyOvertime = calculateOvertimeHours(attendanceRecord);
        const [hours, minutes] = dailyOvertime.split(":").map(Number);

        // Convert hours and minutes into fractional hours and sum up
        totalOvertimeHours += hours + minutes / 60;
      }
    });

    // Format total overtime into "hours:minutes"
    return formatHours(totalOvertimeHours);
  };

  const calculateOvertimeHours = (attendanceRecord) => {
    // Get the daily hours using your existing function
    const dailyHoursData = getDailyHours(attendanceRecord);

    // Parse the formatted hours returned from getDailyHours
    const [hours, minutes] = dailyHoursData.formattedHours
      .split(":")
      .map(Number);

    // Convert hours and minutes into total hours (fractional)
    const totalHours = hours + minutes / 60;

    // Calculate overtime (subtracting 8 hours)
    const overtime = totalHours > 8 ? totalHours - 8 : 0;

    // Format the overtime hours into "hours:minutes"
    return formatHours(overtime);
  };

  const calculateTotalSalary = (monthlySalary, hours, daysInMonth) => {
    const salaryPerMinute = monthlySalary / (daysInMonth * 8 * 60);

    const [hourPart, minutePart] = hours.split(":").map(Number);
    const totalMinutes = hourPart * 60 + minutePart;

    const totalSalary = salaryPerMinute * totalMinutes;

    // return Math.round(parseFloat(totalSalary.toFixed(2)));
    return Math.round(totalSalary / 10) * 10;
  };

  const getEffectiveSalary = (employee, month, year) => {
    const relevantSalaries = employee.editedSalary
      ?.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getFullYear() < year ||
          (recordDate.getFullYear() === year && recordDate.getMonth() <= month)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    return relevantSalaries?.length > 0
      ? relevantSalaries[0].amount
      : employee.salary;
  };

  const approveSalaryHandler = (emp, len) => {
    const totalSalary = calculateTotalSalary(
      getEffectiveSalary(emp, month, year),
      calculateTotalHours(emp.attendanceTime),
      len
    );

    const lastDay = new Date(year, month + 1, 0);

    dispatch(
      putSalary({
        month: lastDay,
        amount: totalSalary,
        empId: emp._id,
        leaveTaken: calculateTotalLeaves(emp?.attendanceTime),
      })
    );
  };

  const checkSalaryPaid = (employee) => {
    return employee?.salaryArray?.some((salaryRecord) => {
      const recordMonth = new Date(salaryRecord.month).getMonth();
      const recordYear = new Date(salaryRecord.month).getFullYear();
      return (
        recordMonth === month && recordYear === year && salaryRecord.isPaid
      );
    });
  };

  const disApproveSalaryHandler = (emp, len) => {
    dispatch(
      pullSalary({
        month: new Date(year, month + 1, 0),
        empId: emp._id,
        leaveTaken: calculateTotalLeaves(emp?.attendanceTime),
      })
    );
  };

  const isSalaryApproved = (emp) => {
    if (!emp.salaryArray || emp.salaryArray.length === 0) {
      return false;
    }
    const salaryFound = emp.salaryArray.some((salaryRecord) => {
      const recordMonth = new Date(salaryRecord.month).getMonth() + 1;
      const recordYear = new Date(salaryRecord.month).getFullYear();
      return (
        recordMonth === month + 1 &&
        recordYear === year &&
        salaryRecord.amount !== undefined &&
        salaryRecord.isSalaryApproved
      );
    });

    return salaryFound;
  };

  const calculateTotalLeaves = (attendanceRecords) => {
    let totalLeaves = 0;

    // Loop through each day of the month
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

      // Check if the day is a Sunday or a holiday
      // const isCurrentDaySunday = false
      const isCurrentDayHoliday = isHoliday(day);

      // Count as leave if there's no attendance record and it's not a Sunday or holiday
      if (!attendanceRecord && !isCurrentDayHoliday) {
        totalLeaves++;
      }
    });

    return totalLeaves;
  };

  const calculateTotalWorkingDays = (attendanceRecords) => {
    let totalDays = 0;

    // Loop through each day of the month
    daysInMonth.forEach((day) => {
      const currentDate = new Date(year, month, day);

      // Find the attendance record for the current day
      const attendanceRecord = attendanceRecords.find((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getDate() === currentDate.getDate() &&
          recordDate.getFullYear() === currentDate.getFullYear() &&
          recordDate.getMonth() === currentDate.getMonth()
        );
      });

      // Check conditions for adding the day
      if (
        (attendanceRecord && attendanceRecord.timeLogs.length > 0) || // If time logs have data
        (!attendanceRecord && isHoliday(day)) || // If no record and it's a holiday
        (attendanceRecord &&
          attendanceRecord.timeLogs.length === 0 &&
          attendanceRecord.removeDay === false) // If time logs are empty and removeDay is false
      ) {
        totalDays++;
      }
    });

    return totalDays;
  };

  const totalPages = Math.ceil(employees?.length / entriesPerPage);
  const currentEmployees = employees
    ?.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee._id.slice(-6).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const csvData = useMemo(() => {
    return currentEmployees?.map((employee, index) => {
      const dailyHours = daysInMonth?.map((day) => {
        const attendanceRecord = employee?.attendanceTime?.find((record) => {
          const recordDate = new Date(record.date).getDate();
          return (
            recordDate === day &&
            new Date(record.date).getFullYear() === year &&
            new Date(record.date).getMonth() === month
          );
        });

        // Use getDailyHours to get the formatted hours
        const { formattedHours } = getDailyHours(attendanceRecord, day);

        // If there's no attendance record, check if it's a holiday
        if (!attendanceRecord) {
          return isHoliday(day) ? "8:0" : "0:0"; // Ensure this logic matches the table logic
        }

        return formattedHours || "0:0"; // Ensure default value matches table logic
      });

      // Calculate totals
      const totalWorkingDays = calculateTotalWorkingDays(employee.attendanceTime);
      const totalOvertime = calculateTotalOvertime(employee.attendanceTime);
      const totalHours = calculateTotalHours(employee.attendanceTime);
      const totalSalary = calculateTotalSalary(
        getEffectiveSalary(employee, month, year),
        totalHours,
        daysInMonth.length
      );
      const salaryStatus = isSalaryApproved(employee) ? "Approved" : "Pending";

      return {
        "S. No.": index + 1,
        name: employee.name,
        employeeCode: employee.employeeCode,
        ...dailyHours.reduce((acc, hours, index) => {
          acc[`Day ${index + 1}`] = hours;
          return acc;
        }, {}),
        totalWorkingDays: totalWorkingDays,
        totalOvertime: totalOvertime,
        totalHours: totalHours,
        totalSalary: totalSalary,
        salaryStatus: salaryStatus,
      };
    });
  }, [currentEmployees, daysInMonth, year, month]);

  const removeDayPaid = (empId, day) => {
    let newDay = day < 10 ? `0${day}` : day;
    const date = `${year}-${month + 1}-${newDay}`;
    dispatch(removeDay({ empId, date }));
  };

  const restoreDayPaid = (empId, day) => {
    let newDay = day < 10 ? `0${day}` : day;
    const date = `${year}-${month + 1}-${newDay}`;
    dispatch(restoreDay({ empId, date }));
  };

  // Calculate the total salary for all employees
  const totalSalaryToBePaid = useMemo(() => {
    return currentEmployees?.reduce((acc, employee) => {
      const totalHours = calculateTotalHours(employee.attendanceTime);
      const totalSalary = calculateTotalSalary(
        getEffectiveSalary(employee, month, year),
        totalHours,
        daysInMonth.length
      );
      return acc + totalSalary;
    }, 0);
  }, [currentEmployees, daysInMonth, month, year]);

  // Ensure totalSalaryToBePaid is a number before calling toFixed
  const formattedTotalSalaryToBePaid = totalSalaryToBePaid ? totalSalaryToBePaid.toFixed(2) : "0.00";

  return (
    <Box p={8} mt={100} backgroundColor={"white"} borderRadius={"30px"}>
      {/* Display total salary to be paid */}
      <Box mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Total Salary to be Paid: ₹ {formattedTotalSalaryToBePaid}
        </Text>
      </Box>

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
            {Array?.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </Select>
        </Box>
        <Box width={"40%"} id="full-width">
          <Text mb={2}>Search</Text>
          <Input
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

      {/* Search Bar */}

      {/* Entries per page selection */}
      <Box
        display="flex"
        alignItems="end"
        justifyContent="space-between"
        gap={4}
        mb={4}
        id="table-col"
      >
        <Box mb={4}>
          <Text mb={2}>Entries per page:</Text>
          <Select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            width="150px"
          >
            {[50, 75, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Box>

        <Button colorScheme="green" display={"flex"} gap={3} mb={4}>
          <CSVLink
            data={
              csvData
                ? csvData.map((employee) => ({
                    "S. No.": employee["S. No."],
                    Name: employee.name,
                    EmployeeCode: employee.employeeCode,
                    ...daysInMonth.reduce((acc, _, index) => {
                      acc[`Day ${index + 1}`] =
                        employee[`Day ${index + 1}`] || 0; // Include daily hours
                      return acc;
                    }, {}),
                    TotalWorkingDays: employee.totalWorkingDays,
                    TotalOvertime: employee.totalOvertime,
                    TotalHours: employee.totalHours,
                    TotalSalary: employee.totalSalary,
                    SalaryStatus: employee.salaryStatus, // Include salary status if needed
                  }))
                : []
            }
            filename={`${year}-${month + 1}-labour-attendance.csv`}
            className="btn btn-primary"
            target="_blank"
          >
            Export to Excel
          </CSVLink>

          <FaDownload />
        </Button>
      </Box>
      {/* Attendance Table */}
      <TableContainer maxHeight={"100vh"} overflowY="auto">
        <Table>
          <Thead id="head-fixed">
            <Tr>
              <Th>S. No.</Th>
              <Th id="col-fixed">Employee Name</Th>
              <Th>Employee Code</Th>
              {daysInMonth.map((day) => (
                <Th key={day} style={isHoliday(day) ? { color: "red" } : {}}>
                  {day ? day + `(${getHolidayNameByDate(day)})` : day}
                </Th>
              ))}
              <Th>Total Working Days</Th>
              <Th>Overtime Hours</Th>
              <Th>Total Hours</Th>
              <Th>Total Salary</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((employee, idx) => (
              <Tr key={employee._id}>
                <Td>{idx + 1}</Td>
                <Td id="col-fixed">{employee.name}</Td>
                <Td>{employee?.employeeCode}</Td>
                {daysInMonth.map((day) => {
                  const attendanceRecord = employee.attendanceTime.find(
                    (record) => {
                      const recordDate = new Date(record.date).getDate();
                      return (
                        recordDate === day &&
                        new Date(record.date).getFullYear() === year &&
                        new Date(record.date).getMonth() === month
                      );
                    }
                  );

                  const { formattedHours } = getDailyHours(
                    attendanceRecord,
                    day
                  );

                  return (
                    <Td key={day}>
                      {formattedHours}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "5px",
                          gap: "5px",
                          fontSize: "20px",
                        }}
                      >
                        {isHoliday(day) ? (
                          <RxCrossCircled
                            color="red"
                            onClick={() => removeDayPaid(employee._id, day)}
                          />
                        ) : (
                          ""
                        )}
                        {isHoliday(day) ? (
                          <TiTick
                            color="green"
                            onClick={() => restoreDayPaid(employee._id, day)}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </Td>
                  );
                })}
                <Td>{calculateTotalWorkingDays(employee.attendanceTime)}</Td>
                <Td>{calculateTotalOvertime(employee.attendanceTime)}</Td>
                <Td>{calculateTotalHours(employee.attendanceTime)}</Td>
                <Td>
                  {calculateTotalSalary(
                    getEffectiveSalary(employee, month, year),
                    calculateTotalHours(employee.attendanceTime),
                    daysInMonth.length
                  )}
                </Td>
                <Td>
                  {checkSalaryPaid(employee) ? (
                    <div>
                      <Button
                        colorScheme="gray"
                        onClick={() =>
                          approveSalaryHandler(employee, daysInMonth.length)
                        }
                      >
                        Paid
                      </Button>
                    </div>
                  ) : (
                    <Button
                      colorScheme={isSalaryApproved(employee) ? "red" : "green"}
                      onClick={() =>
                        !isSalaryApproved(employee)
                          ? approveSalaryHandler(employee, daysInMonth.length)
                          : disApproveSalaryHandler(
                              employee,
                              daysInMonth.length
                            )
                      }
                    >
                      {isSalaryApproved(employee) ? "Disapprove" : "Approve"}
                    </Button>
                  )}
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

export default AttendanceTable;
