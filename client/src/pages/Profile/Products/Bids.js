import { Modal, Table, message } from 'antd'
import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { GetAllBids } from '../../../apicalls/products';
import moment from "moment";
import Divider from "../../../Components/Divider";
import {useNavigate} from 'react-router-dom';

function Bids({showBidsModal, setShowBidsModal, selectedProduct}) {

  const [bids, setBids] = React.useState([]);

  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const getData = async () => {
    try {
        dispatch(SetLoader(true));
        const response = await GetAllBids({product : selectedProduct._id});
        dispatch(SetLoader(false));
        if(response.success){
          setBids(response.data);
        }else{
          localStorage.removeItem('token');
          navigate('/login');
          message.error(response.message);
        }
    } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
    }
  }

  const columns = [
    {
        title:"Name",
        dataIndex:"name",
        render : (text, record) => {
            return record.buyer.name;
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
    if(selectedProduct){
        getData();
    }
  }, [selectedProduct]);

  return (
    <Modal
       title=""
       open={showBidsModal}
       onCancel={() => setShowBidsModal(false)}
       width={1500}
       centered
       footer={null}
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-primary">Bids</h1>
        <Divider/>
        <h1 className="text-xl text-gray-500">
            Product Name: {selectedProduct.name}
        </h1>
        <Table columns={columns} dataSource={bids}></Table>
      </div>
    </Modal>
  )
}

export default Bids
