import {Button, Table, message} from 'antd';
import React from 'react';
import ProductsForm from './ProductsForm';
import {useDispatch, useSelector} from 'react-redux';
import {SetLoader} from '../../../redux/loadersSlice';
import {GetProducts} from '../../../apicalls/products';
import {useEffect} from 'react';
import {DeleteProduct} from '../../../apicalls/products';
import Bids from './Bids';
const moment = require("moment");

function Products() {

  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const [products, setProducts] = React.useState([]);
  
  const [showProductForm, setShowProductForm] = React.useState(false);

  const [showBids, setShowBids] = React.useState(false);

  const dispatch = useDispatch();

  const {user} = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts({seller:user._id});
      dispatch(SetLoader(false));
      if(response.success){
         setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  }

  const deleteProduct = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
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
 }

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
         return <div className="flex items-center gap-5">
           <i className="ri-delete-bin-line" onClick={() => {
             deleteProduct(record._id);
           }}></i>
           <i className="ri-pencil-line" onClick={() => {
             setSelectedProduct(record);
             setShowProductForm(true);
           }}></i>
           <span className="underline cursor-pointer" onClick={() => {
             setSelectedProduct(record);
             setShowBids(true);
           }}>Show Bids</span>
         </div>
      }
    }
  ];

  useEffect(() => {
     getData();
  }, [])

  return (
    <div>
       <div className="flex justify-end mb-2">
        <Button type="default" onClick={() =>{ 
          setSelectedProduct(null);
          setShowProductForm(true);}}>Add Product</Button>
       </div>

       <Table columns={columns} dataSource={products}></Table>
       {showProductForm && <ProductsForm showProductForm={showProductForm} setShowProductForm={setShowProductForm} selectedProduct={selectedProduct} getData={getData}/>}
       {showBids && <Bids showBidsModal={showBids} setShowBidsModal={setShowBids} selectedProduct={selectedProduct}/>}
    </div>
  )
}

export default Products;
