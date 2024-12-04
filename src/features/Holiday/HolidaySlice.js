import {createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HolidayService from "./HolidayService";

export const addHoliday = createAsyncThunk('holiday/add',async(data,thunkApi)=>{
    try{
        return await HolidayService.AddHoliday(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const allHoliday = createAsyncThunk('holiday/all',async(thunkApi)=>{
    try{
        return await HolidayService.AllHoliday()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const editHoliday = createAsyncThunk('holiday/edit',async(data,thunkApi)=>{
    try{
        console.log(data)
        return await HolidayService.EditHoliday(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const deleteHoliday = createAsyncThunk('holiday/delete',async(id,thunkApi)=>{
    try{
        return await HolidayService.DeleteHoliday(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})



const initialState = {
    holiday:'',
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}

export const resetState=createAction('Reset_all')

export const HolidaySlice = createSlice({
    name:"holiday",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(addHoliday.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(addHoliday.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.HolidayData = action.payload
        })
        .addCase(addHoliday.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.HolidayData = null
        })
        .addCase(allHoliday.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(allHoliday.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.allHolidays = action.payload
        })
        .addCase(allHoliday.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.allHolidays = null
        })

        .addCase(editHoliday.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(editHoliday.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.editedHoliday = action.payload
        })
        .addCase(editHoliday.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.editedHoliday = null
        })
        

        .addCase(deleteHoliday.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(deleteHoliday.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.deletedHoliday = action.payload
        })
        .addCase(deleteHoliday.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.deletedHoliday = null
        })
       
    }
})

export default HolidaySlice.reducer