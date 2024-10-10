import {createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AttendanceService from "./AttendanceService";

export const checkIn = createAsyncThunk('attendance/checkin',async(data,thunkApi)=>{
    try{
        return await AttendanceService.CheckIn(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})


export const checkOut = createAsyncThunk('attendance/checkout',async(data,thunkApi)=>{
    try{
        return await AttendanceService.CheckOut(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getAttendance = createAsyncThunk('attendance/empId',async(empId,thunkApi)=>{
    try{
        return await AttendanceService.GetAttendance(empId)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})


export const getMonthlyAttendance = createAsyncThunk('attendance/monthly',async(data,thunkApi)=>{
    try{
        return await AttendanceService.GetMonthlyAttendance(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

const initialState = {
    attendance:'',
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}

export const resetState=createAction('Reset_all')

export const AttendanceSlice = createSlice({
    name:"attendance",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(checkIn.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(checkIn.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.checkedIn = action.payload
        })
        .addCase(checkIn.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.checkedIn = null
        })
        .addCase(checkOut.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(checkOut.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.checkedOut = action.payload
        })
        .addCase(checkOut.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.checkedOut = null
        })
    }
})

export default AttendanceSlice.reducer