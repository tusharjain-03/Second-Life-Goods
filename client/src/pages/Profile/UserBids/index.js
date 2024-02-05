import { Table, message } from 'antd'
import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {GetAllBids} from "../../../apicalls/products";
import {SetLoader} from "../../../redux/loadersSlice";
import moment from "moment";

function UserBids() {

  const [bids, setBids] = React.useState([]);
  
  const {user} = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
        dispatch(SetLoader(true));
        const response = await GetAllBids({buyer : user._id});
        dispatch(SetLoader(false));
        if(response.success){
          setBids(response.data);
        }
    } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
    }
  }

  const columns = [
    {
        title:"Product",
        dataIndex:"product",
        render: (text, record) => {
            return record.product.name;
        }
    },
    {
        title:"Seller",
        dataIndex:"seller",
        render : (text, record) => {
            return record.seller.name;
        }
    },
    {
        title:"Bid Amount",
        dataIndex:"bidAmount",
    },
    {
        title:"Bid Date",
        dataIndex:"createdAt",
        render : (text, record) => {
            return moment(text).format("DD-MM-YYYY hh:mm a")
        }
    },
    {
        title:"Message",
        dataIndex:"message",
    },
    {
        title:"Contact Details",
        dataIndex:"contactDetails",
        render : (text, record) => {
            return (
                <div>
                    <p>Phone: {record.mobile}</p>
                    <p>Email: {record.buyer.email}</p>
                </div>
            )
        }
    }
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
      <div className="flex flex-col gap-3">
        <Table columns={columns} dataSource={bids}></Table>
      </div>
  )
}

export default UserBids;
