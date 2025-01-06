import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "utils/config";

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

const rejectEmployee = async (id) => {
    const response = await axios.delete(`${base_url}employee/reject/${id}`)
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

const pullSalary = async (data)=> {
    const response = await axios.post(`${base_url}employee/pullSalary`,data)
    return response.data
}

const paySalary = async (data)=> {
    const response = await axios.post(`${base_url}employee/paySalary`,data)
    return response.data
}

const unpaySalary = async (data)=> {
    const response = await axios.post(`${base_url}employee/unpaySalary`,data)
    return response.data
}

const payAdvance = async (data)=> {
    const response = await axios.put(`${base_url}employee/payAdvance`,data)
    return response.data
}

const unpayAdvance = async (data)=> {
    const response = await axios.put(`${base_url}employee/unpayAdvance`, data)
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

const EditSalary = async (data)=> {
    const response = await axios.put(`${base_url}employee/edit-salary`,data,config)
    return response.data
}

const DeleteEmployee = async (id)=> {
    const response = await axios.delete(`${base_url}employee/delete/${id}`)
    return response.data
}

const DeactivateEmployee = async (id)=> {
    const response = await axios.put(`${base_url}employee/deactivate/${id}`)
    return response.data
}

const GetAgainEmployee = async (id)=> {
    const response = await axios.put(`${base_url}employee/get-again/${id}`)
    return response.data
}

const EmployeeDetails = async (id)=> {
    const response = await axios.get(`${base_url}employee/${id}`)
    return response.data
}

const AddTourDetails = async (data)=> {
    const response = await axios.post(`${base_url}tour/add-tour`,data)
    return response.data
}

const AllTourDetails = async ()=> {
    const response = await axios.get(`${base_url}tour/all-tour`)
    return response.data
}

const DeleteTourDetails = async (id)=> {
    const response = await axios.delete(`${base_url}tour/delete-tour/${id}`)
    return response.data
}

const DeleteSalary = async (data)=> {
    const response = await axios.delete(`${base_url}employee/delete-salary/${data.salaryId}/${data.employeeId}`)
    return response.data
}

const EmployeeService = {AddEmployee,AllEmployee,GetEmployeeAttendance,GetUnApprovedEmployees,GetUnpaidEmployees,approveEmployee,editEmployee,tranferToPaidEmployee,putSalary,paySalary,SingleEmployee,generateSalarySlip,payAdvance,GiveLoan,EditSalary,DeleteEmployee,rejectEmployee,GetAgainEmployee,DeactivateEmployee,pullSalary,unpayAdvance,EmployeeDetails,unpaySalary,AddTourDetails,AllTourDetails,DeleteTourDetails,DeleteSalary}

export default EmployeeService
