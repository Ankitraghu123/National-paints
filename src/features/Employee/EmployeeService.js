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

const SingleEmployee = async (id)=>{
    const response = await axios.get(`${base_url}employee/${id}`)
    return response.data
}

const GetEmployeeAttendance = async (data) => {
    const response = await axios.get(`${base_url}employee/${data.id}/${data.month}`)
    return response.data
}

const GetUnApprovedEmployees = async () => {
    const response = await axios.get(`${base_url}employee/unapproved`)
    return response.data
}

const GetUnpaidEmployees = async () => {
    const response = await axios.get(`${base_url}employee/unpaid`)
    return response.data
}

const approveEmployee = async (id) => {
    const response = await axios.put(`${base_url}employee/approve/${id}`)
    return response.data
}

const editEmployee = async (data) => {
    const response = await axios.put(`${base_url}employee/edit/${data.id}`,data)
    return response.data
}

const tranferToPaidEmployee = async (id)=> {
    const response = await axios.post(`${base_url}employee/transfer-to-paid/${id}`,)
    return response.data
}


const putSalary = async (data)=> {
    const response = await axios.post(`${base_url}employee/putSalary`,data)
    return response.data
}

const paySalary = async (data)=> {
    const response = await axios.post(`${base_url}employee/paySalary`,data)
    return response.data
}

const payAdvance = async (data)=> {
    const response = await axios.put(`${base_url}employee/payAdvance`,data)
    return response.data
}

const generateSalarySlip = async (data)=> {
    const response = await axios.post(`${base_url}employee/generate-salary-slip`,data)
    return response.data
}

const GiveLoan = async (data)=> {
    const response = await axios.post(`${base_url}employee/give-loan`,data)
    return response.data
}

const EmployeeService = {AddEmployee,AllEmployee,GetEmployeeAttendance,GetUnApprovedEmployees,GetUnpaidEmployees,approveEmployee,editEmployee,tranferToPaidEmployee,putSalary,paySalary,SingleEmployee,generateSalarySlip,payAdvance,GiveLoan}

export default EmployeeService
