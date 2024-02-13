import { Form, Input, Modal, message } from 'antd'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { PlaceNewBid } from '../../apicalls/products';
import { AddNotification } from '../../apicalls/notifications';
import { useNavigate } from 'react-router-dom';

function BidModal({
    showBidModal,
    setShowBidModal,
    product,
    reloadData,
}) {

  const {user} = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const formRef = React.useRef(null);

  const navigate = useNavigate();

  const rules = [{required:"true", message:"required"}];

  const onFinish = async (values) => {
     try {
       dispatch(SetLoader(true));
       const response = await PlaceNewBid({
        ...values,
        product : product._id,
        seller : product.seller._id,
        buyer : user._id
       });
       dispatch(SetLoader(false));
       if(response.success){
         message.success(response.message);

         // send notification to seller
         await AddNotification({
            title : "A New bid has been placed",
            message : `A new bid has been placed on your product ${product.name} by ${user.name} for $${values.bidAmount}`,
            user : product.seller._id,
            onClick : "/profile",
            read : false,
         });
         reloadData();
         setShowBidModal(false);
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

  return (
    <Modal open={showBidModal} 
           onCancel={() => setShowBidModal(false)}
           centered 
           width={600}
           onOk={() => formRef.current.submit()}
    >
        <div className="flex flex-col gap-5 mb-5">
           <h1 className="text-2xl font-semibold text-orange-900 text-center">New Bid</h1> 
        
           <Form
             layout="vertical"
             ref={formRef}
             onFinish={onFinish}
           >
             <Form.Item label="Bid Amount" name="bidAmount" rules={rules}>
                <Input/>
             </Form.Item>
             <Form.Item label="Message" name="message" rules={rules}>
               <Input.TextArea/>
             </Form.Item>
             <Form.Item label="Mobile" name="mobile" rules={rules}>
                <Input type="number"/>
             </Form.Item>
           </Form>
        </div>
    </Modal>
  );
}

export default BidModal;