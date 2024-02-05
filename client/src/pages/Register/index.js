import React from 'react'
import {Form, Input, Button, message} from 'antd'
import { Link } from 'react-router-dom';
import Divider from '../../Components/Divider';
import { RegisterUser } from '../../apicalls/users';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';

function Register() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const rules = [
    {
        required:true,
        message:'required'
    }
  ];

  const onFinish = async (values) => {
     try {
        dispatch(SetLoader(true));
        const response = await RegisterUser(values);
        dispatch(SetLoader(false));
        if(response.success){
           message.success(response.message);
           navigate("/login");
        }else{
           throw new Error(response.message);
        }
     } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
     }
  }

   useEffect(() => {
      if(localStorage.getItem("token")){
        navigate("/");
      }
   },[]); 


  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
         <h1 className="text-primary text-2xl">SLG - <span className="text-gray-400 text-2xl">REGISTER</span></h1>
         <Divider/>
         <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={rules}>
               <Input placeholder="Name"></Input>
            </Form.Item>
            <Form.Item label="Email" name="email" rules={rules}>
               <Input placeholder="Email"></Input>
            </Form.Item>
            <Form.Item label="Password" name="password" rules={rules}>
               <Input type="password" placeholder="Password"></Input>
            </Form.Item>

            <Button type="primary" htmlType="submit" block className="mt-2">Register</Button>

            <div className="mt-5 text-center">
               <span className="text-gray-500">
                 Already have an account? <Link className="text-primary" to="/login">Login</Link>
               </span>
            </div> 
         </Form>        
      </div>
    </div>
  )
}

export default Register;
