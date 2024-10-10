import axios from "axios";
import { base_url } from "../../utils/base_url";

const CheckIn = async (data)=>{
    const response = await axios.post(`${base_url}attendance/checkin`,data)
    return response.data
}

const CheckOut = async (data)=>{
    const response = await axios.post(`${base_url}attendance/checkOut`,data)
    return response.data
}




const AttendanceService = {CheckIn,CheckOut}

export default AttendanceService
