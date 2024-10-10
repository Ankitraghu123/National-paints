import {createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import EmployeeService from "./EmployeeService";

export const addEmployee = createAsyncThunk('employee/add',async(data,thunkApi)=>{
    try{
        return await EmployeeService.AddEmployee(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const allEmployee = createAsyncThunk('employee/all',async(thunkApi)=>{
    try{
        return await EmployeeService.AllEmployee()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})



const initialState = {
    employee:'',
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}

export const resetState=createAction('Reset_all')

export const EmployeeSlice = createSlice({
    name:"employee",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(addEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(addEmployee.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.employeeData = action.payload
        })
        .addCase(addEmployee.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.employeeData = null
        })
        .addCase(allEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(allEmployee.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.allEmployees = action.payload
        })
        .addCase(allEmployee.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.allEmployees = null
        })
        
       
    }
})

export default EmployeeSlice.reducer