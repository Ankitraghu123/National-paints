import axios from "axios";
import { base_url } from "../../utils/base_url";

const Register = async (data)=>{
    const response = await axios.post(`${base_url}reception/register`,data)
    return response.data
}

const Login = async (data)=>{
    const response = await axios.post(`${base_url}admin/login`,data)
   
    const { token ,role} = response.data;
    if (role === 'Admin') {
        localStorage.setItem('adminToken', token);
      } else if (role === 'Accountant') {
        localStorage.setItem('accountantToken', token);
      } else if (role === 'HR') {
        localStorage.setItem('hrToken', token);
      } else if (role === 'Reception') {
        localStorage.setItem('receptionistToken', token);
      } else {
        localStorage.setItem('genericToken', token); 
      }
      localStorage.setItem('data', JSON.stringify(response.data));
    return response.data
}

const ReceptionService = {Register,Login}

export default ReceptionService
