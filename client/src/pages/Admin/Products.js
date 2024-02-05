import {Table, message} from 'antd';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SetLoader} from '../../redux/loadersSlice';
import {GetProducts, UpdateProductStatus} from '../../apicalls/products';
import {useEffect} from 'react';
const moment = require("moment");

function Products() {

  const [products, setProducts] = React.useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(null);
      dispatch(SetLoader(false));
      if(response.success){
         setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  }

  const onStatusUpdate = async (id, status) => {
      try {
        dispatch(SetLoader(true));
        const response = await UpdateProductStatus(id, status);
        dispatch(SetLoader(false));
        if(response.success){
            message.success(response.message);
            getData();
        }else{
            message.error(response.message);
        }
      } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
      }
  };

  const columns = [
    {
      title:"Product",
      dataIndex:"image",
      render : (data, record) =>{
        return (
          <img 
            src={record?.images?.length > 0 ? record.images[0] : ''} 
            alt=""
            className="w-20 h-20 object-cover rounded-md"
          >
          </img>
        )
      }
    },
    {
      title:"Name",
      dataIndex:"name"
    },
    {
      title:"Seller",
      dataIndex:"name",
      render: (text, record) => {
        return record.seller.name;
      }
    },
    {
      title:"Price",
      dataIndex:"price",
    },
    {
      title:"Category",
      dataIndex:"category",
    },
    {
      title:"Age",
      dataIndex:"age",
    },
    {
      title:"Status",
      dataIndex:"status",
      render:(text, record) => {
        return record.status.toUpperCase();
      }
    },
    {
      title:"Added On",
      dataIndex:"createdAt",
      render:(text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm A")
      }
    },
    {
      title:"Action",
      dataIndex:"action",
      render: (text, record) => {
         const {status, _id} = record;
         return <div className="flex gap-3">
            {status === "pending" && (
              <span 
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
            {status === "pending" && (
              <span 
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </span>
            )}
            {status === "approved" && (
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
                onClick={() => onStatusUpdate(_id, "approved")}
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
       <Table columns={columns} dataSource={products}></Table>
    </div>
  )
}

export default Products;