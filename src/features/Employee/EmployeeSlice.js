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

export const singleEmployee = createAsyncThunk('employee/singleEmployee',async(id,thunkApi)=>{
    try{
        return await EmployeeService.SingleEmployee(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getUnApprovedEmployees = createAsyncThunk('employee/unapproved',async(thunkApi)=>{
    try{
        return await EmployeeService.GetUnApprovedEmployees()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getUnpaidEmployees = createAsyncThunk('employee/unpaid',async(thunkApi)=>{
    try{
        return await EmployeeService.GetUnpaidEmployees()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const approveEmployee = createAsyncThunk('employee/approve',async(id,thunkApi)=>{
    try{
        return await EmployeeService.approveEmployee(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const transferToPaidEmployee = createAsyncThunk('employee/tranfertopaid',async(id,thunkApi)=>{
    try{
        return await EmployeeService.tranferToPaidEmployee(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const editEmployee = createAsyncThunk('employee/edit',async(data,thunkApi)=>{
    try{
        return await EmployeeService.editEmployee(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const putSalary = createAsyncThunk('employee/putSalary',async(data,thunkApi)=>{
    try{
        return await EmployeeService.putSalary(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const paySalary = createAsyncThunk('employee/paySalary',async(data,thunkApi)=>{
    try{
        return await EmployeeService.paySalary(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const payAdvance = createAsyncThunk('employee/payAdvance',async(data,thunkApi)=>{
    try{
        return await EmployeeService.payAdvance(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const generateSalarySlip = createAsyncThunk('employee/generate-salary-slip',async(data,thunkApi)=>{
    try{
        return await EmployeeService.generateSalarySlip(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})


export const getEmployeeAttendance = createAsyncThunk('employee/attendnace',async(data,thunkApi)=>{
    try{
        return await EmployeeService.GetEmployeeAttendance(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const giveLoan = createAsyncThunk('employee/give-loan',async(data,thunkApi)=>{
    try{
        return await EmployeeService.GiveLoan(data)
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
        .addCase(getEmployeeAttendance.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getEmployeeAttendance.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.employeeAttendnace = action.payload
        })
        .addCase(getEmployeeAttendance.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.employeeAttendnace = null
        })

        .addCase(getUnApprovedEmployees.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getUnApprovedEmployees.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.unapprovedEmployees = action.payload
        })
        .addCase(getUnApprovedEmployees.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.unapprovedEmployees = null
        })

        .addCase(getUnpaidEmployees.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getUnpaidEmployees.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.unpaidEmployees = action.payload
        })
        .addCase(getUnpaidEmployees.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.unpaidEmployees = null
        })

        .addCase(approveEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(approveEmployee.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.employeeApproved = action.payload
        })
        .addCase(approveEmployee.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.employeeApproved = null
        })
        .addCase(transferToPaidEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(transferToPaidEmployee.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.transferedToPaid = action.payload
        })
        .addCase(transferToPaidEmployee.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.transferedToPaid = null
        })

        .addCase(editEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(editEmployee.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.editedEmployee = action.payload
        })
        .addCase(editEmployee.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.editedEmployee = null
        })

        .addCase(putSalary.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(putSalary.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.monthSalary = action.payload
        })
        .addCase(putSalary.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.monthSalary = null
        })

        .addCase(paySalary.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(paySalary.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.salaryPaid = action.payload
        })
        .addCase(paySalary.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.salaryPaid = null
        })

        .addCase(singleEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(singleEmployee.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.singleEmployee = action.payload
        })
        .addCase(singleEmployee.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.singleEmployee = null
        })

        .addCase(generateSalarySlip.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(generateSalarySlip.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.salarySlip = action.payload
        })
        .addCase(generateSalarySlip.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.salarySlip = null
        })

        .addCase(payAdvance.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(payAdvance.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.advancePaid = action.payload
        })
        .addCase(payAdvance.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.advancePaid = null
        })

        .addCase(giveLoan.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(giveLoan.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.loanGiven = action.payload
        })
        .addCase(giveLoan.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.loanGiven = null
        })
        
        
       
    }
})

export default EmployeeSlice.reducer