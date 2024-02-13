import {Table, message} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SetLoader} from '../../redux/loadersSlice';
import {GetAllUsers, UpdateUserStatus} from '../../apicalls/users';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
const moment = require("moment");

function Users() {

  const [users, setUsers] = React.useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllUsers();
      dispatch(SetLoader(false));
      if(response.success){
         setUsers(response.data);
      }else{
         localStorage.removeItem('token');
         navigate("/login");
         message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  }

  const onStatusUpdate = async (id, status) => {
      try {
        dispatch(SetLoader(true));
        const response = await UpdateUserStatus(id, status);
        dispatch(SetLoader(false));
        if(response.success){
            message.success(response.message);
            getData();
        }else{
            localStorage.removeItem('token');
            navigate('/login');
            message.error(response.message);
        }
      } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
      }
  };

  const columns = [
    {
      title:"Name",
      dataIndex:"name"
    },
    {
      title:"Email",
      dataIndex:"email",
    },
    {
      title:"Role",
      dataIndex:"role",
      render:(text, record) => {
        return record.role.toUpperCase();
      }
    },
    {
        title:"Created At",
        dataIndex:"createdAt",
        render:(text, record) => {
          return moment(record.createdAt).format("DD-MM-YYYY hh:mm A")
        }
      },
    {
      title:"Status",
      dataIndex:"status",
      render:(text, record) => {
        return record.status.toUpperCase();
      }
    },
    {
      title:"Action",
      dataIndex:"action",
      render: (text, record) => {
         const {status, _id} = record;
         return <div className="flex gap-3">
            {status === "active" && (
              <span 
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span 
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "active")}
              >
                Unblock
              </span>
            )}
         </div>
      }
    }
  ];

  useEffect(() => {
     getData();
  }, [])

  return (
    <div>
       <Table columns={columns} dataSource={users}></Table>
    </div>
  )
}

export default Users;
