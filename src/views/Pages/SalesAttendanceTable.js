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
import { FaDownload } from "react-icons/fa";
import { removeDay } from "features/Attendance/AttendanceSlice";
import { restoreDay } from "features/Attendance/AttendanceSlice";
import { RxCrossCircled } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { removeHalfDay } from "features/Attendance/AttendanceSlice";
import { restoreHalfDay } from "features/Attendance/AttendanceSlice";

const SalesAttendanceTable = () => {
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
    (employee) => employee.empType === "sales" && !employee.delete
  );
  const today = new Date();
  const { monthSalary } = useSelector((state) => state.employee);

  const {
    removedDay,
    restoredDay,
    removedHalfDay,
    restoredHalfDay,
  } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(allEmployee());
    dispatch(allHoliday());
  }, [
    dispatch,
    monthSalary,
    removedDay,
    restoredDay,
    removedHalfDay,
    restoredHalfDay,
  ]);

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

  console.log(holidaysInMonth);

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
    ?.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const extractTime = (isoString) => {
    if (!isoString) {
      return ""; // Return an empty string or handle the case as needed
    }
    const [date, time] = isoString.split("T");
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  let consecutiveDailyLateDays = 0;
  const getAttendance = (attendanceRecord, day) => {
    if (!attendanceRecord) {
      const isSpecialDay = isHoliday(day);
      return isSpecialDay ? "P" : "A";
    }

    if (attendanceRecord?.timeLogs?.length > 0) {
      const firstLog = attendanceRecord.timeLogs[0];
      const checkInTime = firstLog.checkIn;
      const checkOutTime = firstLog.checkOut;
      let checkInDate = new Date(checkInTime);
      let checkOutDate = new Date(checkOutTime);

      const checkInHour = checkInDate.getUTCHours();
      const checkOutHour = checkOutDate.getUTCHours();
      
      if (checkInHour <= 14 && checkOutHour <= 14) {
        return "Half day";
      } else if (checkInHour >= 14 && checkOutHour >= 14) {
        return "Half day";
      } else if (checkInHour <= 13) {
        return "P";
      }
    }

    if (!attendanceRecord.removeDay) {
      return "P";
  }

    return "A";
  };

  const calculateTotalDays = (attendanceRecords) => {
    let totalDaysWorked = 0; // Total days worked
    let totalHalfDays = 0; // Count for half days
    let totalAbsences = 0; // Count for absences
    let LateDays = 0; // Track consecutive late check-ins

    // Define 10 AM for checking late arrivals

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

      const attend = getAttendance(attendanceRecord, day);

      if (attend === "P") {
        totalDaysWorked++;
      } else if (attend === "A") {
        totalAbsences++;
      } else {
        totalHalfDays++;
      }
    });

    // Add half days to total days worked (half days count as 0.5)
    // console.log(totalDaysWorked , totalHalfDays)

    totalDaysWorked += totalHalfDays * 0.5;
    return totalDaysWorked.toFixed(1); // Return total days worked as a string
  };

  const calculateTotalSalary = (salary, attendanceRecords) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysWorked = calculateTotalDays(attendanceRecords);
    const dailySalary = salary / daysInMonth;
    const totalSalary = dailySalary * totalDaysWorked;
    // return totalSalary.toFixed(2);
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
      emp.attendanceTime
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
      // console.log(salaryRecord);

      const recordMonth = new Date(salaryRecord.month).getMonth() + 1;
      const recordYear = new Date(salaryRecord.month).getFullYear();
      return (
        recordMonth === month + 1 &&
        recordYear === year &&
        salaryRecord.amount !== undefined &&
        salaryRecord?.isSalaryApproved 
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
      // const isCurrentDaySunday = isSunday(day);
      const isCurrentDayHoliday = isHoliday(day);

      // Count as leave if there's no attendance record and it's not a Sunday or holiday
      if (
        (!attendanceRecord && !isCurrentDayHoliday) ||
        attendanceRecord?.removeDay
      ) {
        totalLeaves++;
      }
    });

    return totalLeaves;
  };

  const calculateTotalHalfDays = (attendanceRecords) => {
    let totalHalfDays = 0; // Total half days
    let consecutiveLateDays = 0; // Track consecutive late check-ins

    // Loop through each day in the month
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

      const attend = getAttendance(attendanceRecord, day);

      if (attend != "P" && attend != "A") {
        totalHalfDays++;
      }
    });

    return totalHalfDays; // Return the total half days
  };

  const csvHeaders = [
    { label: "S. No.", key: "serialNo" },
    { label: "Name", key: "name" },
    { label: "Employee Code", key: "employeeCode" },
    // Add other headers here in the desired order
    ...daysInMonth.map((day) => ({ label: `Day ${day}`, key: `day${day}` })),
    { label: "Total Leaves", key: "totalLeaves" },
    { label: "Total Half Days", key: "totalHalfDays" },
    { label: "Total Days", key: "totalDays" },
    { label: "Total Salary", key: "totalSalary" },
    // Add dynamic day headers
  ];

  const csvData = useMemo(() => {
    if (!employees) return []; // Ensure employees is defined

    return employees.map((employee, index) => {
      const attendance = daysInMonth.reduce((acc, day) => {
        const attendanceRecord = employee.attendanceTime?.find((record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getDate() === day &&
            recordDate.getFullYear() === year &&
            recordDate.getMonth() === month
          );
        });

        const isCurrentDaySunday = isSunday(day);
        const isCurrentDayHoliday = isHoliday(day);
        let status;

        if (isCurrentDaySunday && !attendanceRecord) {
          status = "P"; // If it's Sunday and no attendance record, treat as full day worked
        } else if (isCurrentDayHoliday && !attendanceRecord) {
          status = "P"; // If it's a holiday and no attendance record, treat as full day worked
        } else if (attendanceRecord) {
          status = getAttendance(attendanceRecord, day); // Use the existing logic to determine attendance status
        } else {
          status = "A"; // Absence
        }

        return { ...acc, [`day${day}`]: status };
      }, {});

      return {
        serialNo: index + 1, // Add S. No. to CSV data
        name: employee.name, // Add Name to CSV data
        employeeCode: employee.employeeCode,
        ...attendance,
        totalLeaves: calculateTotalLeaves(employee.attendanceTime),
        totalHalfDays: calculateTotalHalfDays(employee.attendanceTime),
        totalDays: calculateTotalDays(employee.attendanceTime || []),
        totalSalary: calculateTotalSalary(
          employee.salary,
          employee.attendanceTime || []
        ),
      };
    });
  }, [employees, daysInMonth, year, month]);

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

  const removeHalfPaid = (empId, day) => {
    let newDay = day < 10 ? `0${day}` : day;
    const date = `${year}-${month + 1}-${newDay}`;
    dispatch(removeHalfDay({ empId, date }));
  };

  const restoreHalfPaid = (empId, day) => {
    let newDay = day < 10 ? `0${day}` : day;
    const date = `${year}-${month + 1}-${newDay}`;
    dispatch(restoreHalfDay({ empId, date }));
  };

  // Calculate the total salary for all employees
  const totalSalaryToBePaid = useMemo(() => {
    return currentEmployees?.reduce((acc, employee) => {
      const totalSalary = calculateTotalSalary(
        getEffectiveSalary(employee, month, year),
        employee.attendanceTime
      );
      return acc + parseFloat(totalSalary);
    }, 0);
  }, [currentEmployees, month, year]);

  // Ensure totalSalaryToBePaid is a number before calling toFixed
  const formattedTotalSalaryToBePaid = totalSalaryToBePaid
    ? totalSalaryToBePaid.toFixed(2)
    : "0.00";

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
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </Select>
        </Box>
        <Box width={"40%"} id="full-width">
          <Text mb={2}>Search Employee</Text>
          <Input
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

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

        <Button colorScheme="green" mb={4} display={"flex"} gap={3}>
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={`salesAttendance.csv`}
            className="btn btn-primary"
            target="_blank"
          >
            Export to Excel
          </CSVLink>
          <FaDownload />
        </Button>
      </Box>

      <TableContainer maxHeight={"100vh"} overflowY="auto">
        <Table>
          <Thead id="head-fixed">
            <Tr>
              <Th>S.No</Th>
              <Th id="col-fixed">Employee Name</Th>
              <Th>Employee Code</Th>
              {daysInMonth?.map((day) => (
                <Th key={day} style={isSunday(day) ? { color: "red" } : {}}>
                  {isSunday(day)
                    ? day + "(Sun)"
                    : isHoliday(day)
                    ? day + `(${getHolidayNameByDate(day)})`
                    : day}
                </Th>
              ))}
              <Th>Leaves</Th>
              <Th>Half Days</Th>
              <Th>Present Days</Th>
              <Th>Total Salary</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentEmployees?.map((employee, idx) => (
              <Tr key={employee._id}>
                <Td>{idx + 1}</Td>
                <Td id="col-fixed">{employee.name}</Td>
                <Td>{employee.employeeCode}</Td>
                {daysInMonth?.map((day) => {
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

                  const isCurrentDaySunday = isSunday(day);
                  //   const { formattedHours, shouldDeductLunch } = getDailyHours(attendanceRecord, day);

                  return (
                    <Td
                      key={day}
                      style={isCurrentDaySunday ? { color: "red" } : {}}
                    >
                      {getAttendance(attendanceRecord, day)}
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
                <Td>{calculateTotalLeaves(employee?.attendanceTime)}</Td>
                <Td>{calculateTotalHalfDays(employee?.attendanceTime)}</Td>
                <Td>{calculateTotalDays(employee?.attendanceTime)}</Td>
                <Td>
                  {calculateTotalSalary(
                    getEffectiveSalary(employee, month, year),
                    employee?.attendanceTime
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

export default SalesAttendanceTable;
