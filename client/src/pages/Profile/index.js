import React, { useEffect } from 'react'
import {Tabs} from 'antd';
import Products from './Products';
import UserBids from './UserBids';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';

function Profile() {

  const {user} = useSelector((state) => state.users);

  const navigate = useNavigate();

  useEffect(() => {
     if(user.role !== 'user'){
       navigate("/");
     }
  });

  return (
    <div>
      <Tabs defaultActiveKey='1'>
        <Tabs.TabPane tab="Products" key="1">
          <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Bids" key="2">
          <UserBids/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default Profile;
