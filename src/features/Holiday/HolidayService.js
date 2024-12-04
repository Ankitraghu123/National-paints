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

const EditHoliday = async (data)=>{
    const response = await axios.put(`${base_url}holiday/${data.id}`,data)
    return response.data
}

const DeleteHoliday = async (id)=>{
    const response = await axios.delete(`${base_url}holiday/${id}`)
    return response.data
}

const HolidayService = {AddHoliday,AllHoliday,EditHoliday,DeleteHoliday}

export default HolidayService
