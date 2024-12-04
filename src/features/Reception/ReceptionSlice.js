import {createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ReceptionService from "./ReceptionService";

export const ReceptionRegister = createAsyncThunk('reception/register',async(data,thunkApi)=>{
    try{
        return await ReceptionService.RegisterReception(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getAllReceptionist = createAsyncThunk('reception/all',async(thunkApi)=>{
    try{
        return await ReceptionService.getAllReceptionist()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const editReceptionist = createAsyncThunk('reception/edit',async(data,thunkApi)=>{
    try{
        return await ReceptionService.editReceptionist(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const deleteReceptionist = createAsyncThunk('reception/delete',async(id,thunkApi)=>{
    try{
        return await ReceptionService.deleteReceptionist(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})



export const AccountantRegister = createAsyncThunk('accountant/register',async(data,thunkApi)=>{
    try{
        return await ReceptionService.RegisterAccountant(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getAllAccountant = createAsyncThunk('accountant/all',async(thunkApi)=>{
    try{
        return await ReceptionService.getAllAccountant()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const editAccountant = createAsyncThunk('accountant/edit',async(data,thunkApi)=>{
    try{
        return await ReceptionService.editAccountant(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const deleteAccountant = createAsyncThunk('accountant/delete',async(id,thunkApi)=>{
    try{
        return await ReceptionService.deleteAccountant(id)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const HrRegister = createAsyncThunk('hr/register',async(data,thunkApi)=>{
    try{
        return await ReceptionService.RegisterHr(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const getAllHr = createAsyncThunk('hr/all',async(thunkApi)=>{
    try{
        return await ReceptionService.getAllHr()
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const editHr = createAsyncThunk('hr/edit',async(data,thunkApi)=>{
    try{
        return await ReceptionService.editHr(data)
    }catch(err){
        return thunkApi.rejectWithValue(err)
    }
})

export const deleteHr = createAsyncThunk('hr/delete',async(id,thunkApi)=>{
    try{
        return await ReceptionService.deleteHr(id)
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
        .addCase(ReceptionRegister.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(ReceptionRegister.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.receptionData = action.payload
        })
        .addCase(ReceptionRegister.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.receptionData = null
        })

        .addCase(getAllReceptionist.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getAllReceptionist.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.allReceptionist = action.payload
        })
        .addCase(getAllReceptionist.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.allReceptionist = null
        })

        .addCase(editReceptionist.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(editReceptionist.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.editedReceptionist = action.payload
        })
        .addCase(editReceptionist.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.editedReceptionist = null
        })

        .addCase(deleteReceptionist.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(deleteReceptionist.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.deletedReceptionist = action.payload
        })
        .addCase(deleteReceptionist.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.deletedReceptionist = null
        })

        .addCase(AccountantRegister.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(AccountantRegister.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.accountantData = action.payload
        })
        .addCase(AccountantRegister.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.accountantData = null
        })
        .addCase(getAllAccountant.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getAllAccountant.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.allAccountant = action.payload
        })
        .addCase(getAllAccountant.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.allAccountant = null
        })

        .addCase(editAccountant.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(editAccountant.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.editedAccountant = action.payload
        })
        .addCase(editAccountant.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.editedAccountant = null
        })

        .addCase(deleteAccountant.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(deleteAccountant.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.deletedAccountant = action.payload
        })
        .addCase(deleteAccountant.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.deletedAccountant = null
        })
        .addCase(HrRegister.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(HrRegister.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.hrData = action.payload
        })
        .addCase(HrRegister.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.hrData = null
        })
        .addCase(getAllHr.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getAllHr.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.allHr = action.payload
        })
        .addCase(getAllHr.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.allHr = null
        })

        .addCase(editHr.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(editHr.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.editedHr = action.payload
        })
        .addCase(editHr.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.editedHr = null
        })

        .addCase(deleteHr.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(deleteHr.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.deletedHr = action.payload
        })
        .addCase(deleteHr.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.deletedHr = null
        })
        .addCase(Login.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(Login.fulfilled,(state,action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.loginData = action.payload
        })
        .addCase(Login.rejected,(state,action)=>{
            state.isLoading = false
            state.isError=true
            state.isSuccess = false
            state.loginData = null
        })

       

       
        
       
    }
})

export default ReceptionSlice.reducer