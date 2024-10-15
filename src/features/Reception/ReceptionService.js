import axios from "axios";
import { base_url } from "../../utils/base_url";

const Register = async (data)=>{
    const response = await axios.post(`${base_url}reception/register`,data)
    return response.data
}

const Login = async (data)=>{
    const response = await axios.post(`${base_url}reception/login`,data)
   
    const { token } = response.data;
    localStorage.setItem('receptionToken',token)
    return response.data
}

const ReceptionService = {Register,Login}

export default ReceptionService
