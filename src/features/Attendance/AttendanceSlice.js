import {createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AttendanceService from "./AttendanceService";

export const checkIn = createAsyncThunk('attendance/checkin',async(data,thunkApi)=>{
    try{
        return await AttendanceService.CheckIn(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const guardCheckIn = createAsyncThunk('attendance/guardcheckin',async(data,thunkApi)=>{
    try{
        return await AttendanceService.guardCheckIn(data)
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

// export const getAttendance = createAsyncThunk('attendance/empId',async(empId,thunkApi)=>{
//     try{
//         return await AttendanceService.GetAttendance(empId)
//     }catch(err){
//         return thunkApi.rejectWithValue(err)
//     }
// })


// export const getMonthlyAttendance = createAsyncThunk('attendance/monthly',async(data,thunkApi)=>{
//     try{
//         return await AttendanceService.GetMonthlyAttendance(data)
//     }catch(err){
//         return thunkApi.rejectWithValue(err)
//     }
// })

export const todaysPresent = createAsyncThunk('attendance/todays-present',async(thunkApi)=>{
    try{
        return await AttendanceService.TodaysPresent()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const todaysAbsent = createAsyncThunk('attendance/todays-absent',async(thunkApi)=>{
    try{
        return await AttendanceService.TodaysAbsent()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const todaysAvailable = createAsyncThunk('attendance/todays-avail',async(thunkApi)=>{
    try{
        return await AttendanceService.TodaysAvailable()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const todaysLeft = createAsyncThunk('attendance/todays-left',async(thunkApi)=>{
    try{
        return await AttendanceService.TodaysLeft()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const editAttendance = createAsyncThunk('attendance/edit-attendnace-time',async(data,thunkApi)=>{
    try{
        return await AttendanceService.EditAttendance(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const deleteAttendance = createAsyncThunk('attendance/delete',async(data,thunkApi)=>{
    try{
        console.log(data)
        return await AttendanceService.deleteAttendnace(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const removeDay = createAsyncThunk('attendance/remove-day',async(data,thunkApi)=>{
    try{
        return await AttendanceService.RemoveDay(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const restoreDay = createAsyncThunk('attendance/restore-day',async(data,thunkApi)=>{
    try{
        return await AttendanceService.RestoreDay(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const removeHalfDay = createAsyncThunk('attendance/remove-half-day',async(data,thunkApi)=>{
    try{
        return await AttendanceService.RemoveHalfDay(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const restoreHalfDay = createAsyncThunk('attendance/restore-half-day',async(data,thunkApi)=>{
    try{
        return await AttendanceService.RestoreHalfDay(data)
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
        .addCase(todaysPresent.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(todaysPresent.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.todaysPresentEmployee = action.payload
        })
        .addCase(todaysPresent.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.todaysPresentEmployee = null
        })
        .addCase(todaysAbsent.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(todaysAbsent.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.todaysAbsentEmployee = action.payload
        })
        .addCase(todaysAbsent.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.todaysAbsentEmployee = null
        })
        .addCase(todaysAvailable.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(todaysAvailable.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.todaysAvailableEmployee = action.payload
        })
        .addCase(todaysAvailable.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.todaysAvailableEmployee = null
        })
        .addCase(editAttendance.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(editAttendance.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.editedAttendnaceTime = action.payload
        })
        .addCase(editAttendance.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.editedAttendnaceTime = null
        })

        .addCase(todaysLeft.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(todaysLeft.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.todaysLeftEmployees = action.payload
        })
        .addCase(todaysLeft.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.todaysLeftEmployees = null
        })

        .addCase(deleteAttendance.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(deleteAttendance.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.deletedAttendance = action.payload
        })
        .addCase(deleteAttendance.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.deletedAttendance = null
        })

        .addCase(guardCheckIn.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(guardCheckIn.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.guardCheckedIn = action.payload
        })
        .addCase(guardCheckIn.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.guardCheckedIn = null
        })

        .addCase(removeDay.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(removeDay.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.removedDay = action.payload
        })
        .addCase(removeDay.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.removedDay = null
        })

        .addCase(restoreDay.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(restoreDay.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.restoredDay = action.payload
        })
        .addCase(restoreDay.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.restoredDay = null
        })

        .addCase(removeHalfDay.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(removeHalfDay.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.removedHalfDay = action.payload
        })
        .addCase(removeHalfDay.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.removedHalfDay = null
        })

        .addCase(restoreHalfDay.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(restoreHalfDay.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.removedHalfDay = action.payload
        })
        .addCase(restoreHalfDay.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.removedHalfDay = null
        })
    }
})

export default AttendanceSlice.reducer