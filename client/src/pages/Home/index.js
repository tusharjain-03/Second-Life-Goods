import React, { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { message, Input} from 'antd';
import {GetProducts} from '../../apicalls/products';
import {SetLoader} from '../../redux/loadersSlice';
import Divider from '../../Components/Divider';
import {useNavigate} from 'react-router-dom';
import Filters from './Filters';
import moment from "moment";
const {Search} = Input;

function Home() {
  
  const [products, setProducts] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status:'approved',
    name:'',
    category:[],
    age:[],
  });
  const [showFilters, setShowFilters] = React.useState(true);
  
  const {user} = useSelector(state => state.users);
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if(response.success){
        setProducts(response.data);
      }else{
        localStorage.removeItem('token');
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters]);

  return (
    <div className="flex gap-5">
      {showFilters && <Filters showFilters={showFilters} setShowFilters={setShowFilters} filters={filters} setFilters={setFilters}/>}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center gap-5">
           {!showFilters && <i className="ri-equalizer-line text-xl cursor-pointer" onClick={() => setShowFilters(!showFilters)}></i>}
           {/* <Input 
             type="text" 
             placeholder="Search Products..." 
             className="border border-gray-300 rounded border-solid px-2 py-1 h-14"
           ></Input> */}
           <Search
              placeholder="Search Products by name..."
              onSearch={value => setFilters({...filters, name:value})}
              className="rounded border-gray-300 px-2 py-1 h-14"
            />
        </div>
        <div className={`grid gap-5 ${showFilters ? "grid-cols-4" : "grid-cols-5"}`}>
          {products?.map((product) => {
            return (<div className="border border-solid border-gray-300 rounded flex flex-col gap-2 pb-2 cursor-pointer"
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
            >
              <img src={product.images[0]} alt="" className="w-full h-72 p-2 rounded-md object-cover"/>
              <div className="px-2 flex flex-col">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-sm">{product.age} {product.age === 1 ? "year" : "years"} old</p>
                <Divider/>
                <span className="text-xl font-semibold text-green-700">$ {product.price}</span>
              </div>
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}

export default Home;
