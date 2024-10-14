import axios from "axios";
import { base_url } from "../../utils/base_url";

const AddHoliday = async (data)=>{
    const response = await axios.post(`${base_url}holiday/add`,data)
    return response.data
}

const AllHoliday = async ()=>{
    const response = await axios.get(`${base_url}holiday/all`)
    return response.data
}

const HolidayService = {AddHoliday,AllHoliday}

export default HolidayService
