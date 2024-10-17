// import
import React, { Component }  from 'react';
import Dashboard from "views/Dashboard/Dashboard.js";
import Tables from "views/Dashboard/Tables.js";
import Billing from "views/Dashboard/Billing.js";
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
} from "components/Icons/Icons";
import AddEmployee from 'views/Pages/AddEmployee';
import AllEmployee from 'views/Pages/AllEmployee';
import AttendanceTable from 'views/Pages/AttendanceTable';
import EmployeeMonthAttendanceTable from 'views/Pages/EmployeeMonthAttendanceTable';
import DateWiseAttendance from 'views/Pages/DateWiseAttendance';
import ReceptionLogin from 'views/Pages/ReceptionLogin';
import TodaysAttendance from 'views/Pages/TodaysAttendance';
import AddHoliday from 'views/Pages/AddHoliday';
import TodaysPresent from 'views/Pages/TodaysPresent';
import TodaysAbsent from 'views/Pages/TodaysAbsent';
import { todaysAvailable } from 'features/Attendance/AttendanceSlice';
import AvailableEmployees from 'views/Pages/AvailableEmployees';
import SalesAttendanceTable from 'views/Pages/SalesAttendanceTable';
import StaffAttendanceTable from 'views/Pages/StaffAttendanceTable';
import SalesDateWiseAttendanceTable from 'views/Pages/SalesDateWiseAttendance';
import SalesMonthAttendanceTable from 'views/Pages/SalesEmployeeWiseAttendnace';
import StaffDateWiseAttendanceTable from 'views/Pages/StaffDateWiseAttendanceTable';
import StaffMonthAttendanceTable from 'views/Pages/StaffEmployeeWiseAttendance';
import AllEmployeesTable from 'views/Pages/AllEmployeesTable';

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color='inherit' />,
    component: Billing,
    layout: "/admin",
  },
  {
    path: "/rtl-support-page",
    name: "RTL",
    rtlName: "آرتيإل",
    icon: <SupportIcon color='inherit' />,
    component: RTLPage,
    layout: "/rtl",
  },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color='inherit' />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color='inherit' />,
        component: SignIn,
        layout: "/auth",
      },
      {
        path: "/signup",
        name: "Sign Up",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color='inherit' />,
        component: SignUp,
        layout: "/auth",
      },
    ],
  },
  {
    path: "/add-employee",
    name: "AddEmployee",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: AddEmployee,
    layout: "/admin",
  },
  {
    path: "/all-employee",
    name: "Add Attendance",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: AllEmployee,
    layout: "/admin",
  },
  {
    path: "/all-employee-table",
    name: "All Employees",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: AllEmployeesTable,
    layout: "/admin",
  },
  {
    path: "/attendance-table",
    name: "Attendance Table",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: AttendanceTable,
    layout: "/admin",
  },
  {
    path: "/employee-attendnace",
    name: "Month Wise Labour Attendnace",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: EmployeeMonthAttendanceTable,
    layout: "/admin",
  },

  {
    path: "/sales-attendance-table",
    name: "Sales Attendance Table",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: SalesAttendanceTable,
    layout: "/admin",
  },

  {
    path: "/sales-datewise-attendance-table",
    name: "Sales DateWise Attendance Table",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: SalesDateWiseAttendanceTable,
    layout: "/admin",
  },

  {
    path: "/sales-monthwise-attendance-table",
    name: " Month Wise Sales Attendance",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: SalesMonthAttendanceTable,
    layout: "/admin",
  },

  {
    path: "/staff-attendance-table",
    name: "Staff Attendance Table",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: StaffAttendanceTable,
    layout: "/admin",
  },

  {
    path: "/staff-datewise-attendance-table",
    name: "Staff DateWise Attendance Table",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: StaffDateWiseAttendanceTable,
    layout: "/admin",
  },

  {
    path: "/staff-monthwise-attendance-table",
    name: "Staff MonthWise Attendance Table",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: StaffMonthAttendanceTable,
    layout: "/admin",
  },
  
  {
    path: "/employee-date-attendance",
    name: "Date Wise Attendance",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: DateWiseAttendance,
    layout: "/admin",
  },
  {
    path: "/reception-login",
    name: "Reception Login",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: ReceptionLogin,
    layout: "/admin",
  },
  {
    path: "/todays-attendance",
    name: "Todays Attendance",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: TodaysAttendance,
    layout: "/admin",
  },
  {
    path: "/add-holiday",
    name: "Add Holidays",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: AddHoliday,
    layout: "/admin",
  },
 
  {
    path: "/todays-present",
    name: "Todays Present",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: TodaysPresent,
    layout: "/admin",
  },
  {
    path: "/todays-absent",
    name: "Todays Absent",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: TodaysAbsent,
    layout: "/admin",
  },
  {
    path: "/todays-avail",
    name: "Todays Available",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color='inherit' />,
    component: AvailableEmployees,
    layout: "/admin",
  },
];
export default dashRoutes;
