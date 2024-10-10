import { configureStore } from '@reduxjs/toolkit';
import AttendanceReducer  from 'features/Attendance/AttendanceSlice';
import EmployeeReducer  from 'features/Employee/EmployeeSlice';

export const store = configureStore({
  reducer: {
    employee:EmployeeReducer,
    attendance:AttendanceReducer
  }
});
    