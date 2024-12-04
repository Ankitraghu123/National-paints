import { configureStore } from '@reduxjs/toolkit';
import AttendanceReducer  from 'features/Attendance/AttendanceSlice';
import EmployeeReducer  from 'features/Employee/EmployeeSlice';
import HolidayReducer  from 'features/Holiday/HolidaySlice';
import ReceptionReducer from 'features/Reception/ReceptionSlice';

export const store = configureStore({
  reducer: {
    employee:EmployeeReducer,
    attendance:AttendanceReducer,
    holiday:HolidayReducer,
    reception:ReceptionReducer
  }
});
    