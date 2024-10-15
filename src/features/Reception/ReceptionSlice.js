import {createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ReceptionService from "./ReceptionService";

export const Register = createAsyncThunk('reception/register',async(data,thunkApi)=>{
    try{
        return await ReceptionService.Register(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const Login = createAsyncThunk('reception/login',async(data,thunkApi)=>{
    try{
        return await ReceptionService.Login(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})



const initialState = {
    reception:'',
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}

export const resetState=createAction('Reset_all')

export const ReceptionSlice = createSlice({
    name:"reception",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(Register.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(Register.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.receptionData = action.payload
        })
        .addCase(Register.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.receptionData = null
        })
        .addCase(Login.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(Login.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.receptionData = action.payload
        })
        .addCase(Login.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.receptionData = null
        })
        
       
    }
})

export default ReceptionSlice.reducer