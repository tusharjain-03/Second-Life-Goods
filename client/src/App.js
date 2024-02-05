import Login from './pages/Login/index';
import Home from './pages/Home/index';
import Register from './pages/Register/index';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedPage from './Components/ProtectedPage';
import Spinner from './Components/Spinner';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ProductInfo from './pages/ProductInfo';

function App() {
  const {loading} = useSelector(state => state.loaders);
  return (
     <div>
       {loading && <Spinner/>}
       <BrowserRouter>
         <Routes>
            <Route path="/" element={<ProtectedPage><Home/></ProtectedPage>} />
            <Route path="/products/:id" element={<ProtectedPage><ProductInfo/></ProtectedPage>} />
            <Route path="/profile" element={<ProtectedPage><Profile/></ProtectedPage>} />
            <Route path="/admin" element={<ProtectedPage><Admin/></ProtectedPage>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
         </Routes>
       </BrowserRouter>
     </div>
  );
}

export default App;
