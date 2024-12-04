import axios from "axios";
import { base_url } from "../../utils/base_url";

const RegisterReception = async (data)=>{
    const response = await axios.post(`${base_url}reception/register`,data)
    return response.data
}

const getAllReceptionist = async ()=>{
  const response = await axios.get(`${base_url}reception/all`)
  return response.data
}

const editReceptionist = async (data)=>{
  const response = await axios.put(`${base_url}reception/edit/${data.id}`,data)
  return response.data
}

const deleteReceptionist = async (id)=>{
  const response = await axios.delete(`${base_url}reception/delete/${id}`)
  return response.data
}


const RegisterAccountant = async (data)=>{
  const response = await axios.post(`${base_url}accountant/register`,data)
  return response.data
}

const getAllAccountant = async ()=>{
  const response = await axios.get(`${base_url}accountant/all`)
  return response.data
}

const editAccountant = async (data)=>{
  const response = await axios.put(`${base_url}accountant/edit/${data.id}`,data)
  return response.data
}

const deleteAccountant = async (id)=>{
  const response = await axios.delete(`${base_url}accountant/delete/${id}`)
  return response.data
}

const RegisterHr = async (data)=>{
  const response = await axios.post(`${base_url}hr/register`,data)
  return response.data
}

const getAllHr = async ()=>{
  const response = await axios.get(`${base_url}hr/all`)
  return response.data
}

const editHr = async (data)=>{
  const response = await axios.put(`${base_url}hr/edit/${data.id}`,data)
  return response.data
}

const deleteHr = async (id)=>{
  const response = await axios.delete(`${base_url}hr/delete/${id}`)
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

const ReceptionService = {RegisterReception,RegisterAccountant,RegisterHr,Login,getAllAccountant,getAllReceptionist,getAllHr,editAccountant,deleteAccountant,editHr,deleteHr,editReceptionist,deleteReceptionist}

export default ReceptionService
