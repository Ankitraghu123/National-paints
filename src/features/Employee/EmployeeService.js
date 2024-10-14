import axios from "axios";
import { base_url } from "../../utils/base_url";

const AddEmployee = async (data)=>{
    const response = await axios.post(`${base_url}employee/add`,data)
    return response.data
}

const AllEmployee = async ()=>{
    const response = await axios.get(`${base_url}employee/all`)
    return response.data
}

const GetEmployeeAttendance = async (data) => {
    const response = await axios.get(`${base_url}employee/${data.id}/${data.month}`)
    return response.data
}

const EmployeeService = {AddEmployee,AllEmployee,GetEmployeeAttendance}

export default EmployeeService
