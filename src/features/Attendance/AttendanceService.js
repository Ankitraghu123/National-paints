import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "utils/config";

const CheckIn = async (data)=>{
    const response = await axios.post(`${base_url}attendance/checkin`,data,config)
    return response.data
}

const CheckOut = async (data)=>{
    const response = await axios.post(`${base_url}attendance/checkOut`,data)
    return response.data
}

const TodaysPresent = async ()=>{
    const response = await axios.get(`${base_url}attendance/todays-present`,)
    return response.data
}

const TodaysAbsent = async ()=>{
    const response = await axios.get(`${base_url}attendance/todays-absent`,)
    return response.data
}

const TodaysAvailable = async ()=>{
    const response = await axios.get(`${base_url}attendance/todays-avail`,)
    return response.data
}

const EditAttendance = async (data)=>{
    const response = await axios.put(`${base_url}attendance/edit-attendance-time`,data)
    return response.data
}





const AttendanceService = {CheckIn,CheckOut,TodaysPresent,TodaysAbsent,TodaysAvailable,EditAttendance}

export default AttendanceService
