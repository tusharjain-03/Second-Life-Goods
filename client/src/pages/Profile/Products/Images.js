import { Button, Upload, message } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { EditProduct, UploadProductImage } from '../../../apicalls/products';

function Images({selectedProduct, setShowProductForm, getData}) {

  const dispatch = useDispatch();

  const [showPreview, setShowPreview] = React.useState(true);
  const [images, setImages] = React.useState(selectedProduct.images);
  const [file, setFile] = React.useState(null);

  const upload = async () => {
      try {
        dispatch(SetLoader(true));
        // Upload Image to cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", selectedProduct._id);
        const response = await UploadProductImage(formData);
        dispatch(SetLoader(false));
        if(response.success){
          message.success(response.message);
          setImages([...images, response.data]);
          setShowPreview(false);
          setFile(null);
          getData();
        }else{
          message.error(response.message);
        }
      } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
      }    
  };

  const deleteImage = async (image) => {
     try {
        const updatedImageArray = images.filter((img) => img !== image);
        const updatedProduct = {...selectedProduct, images : updatedImageArray};
        dispatch(SetLoader(true));
        const response = await EditProduct(selectedProduct._id, updatedProduct);
        dispatch(SetLoader(false));
        if(response.success){
          message.success(response.message);
          setImages(updatedImageArray);
          setFile(null);
          getData();
        }else{
          message.error(response.message);
        }
     } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
     }
  };

  return (
    <div>
      <div className="flex gap-5 mb-5">
          {images.map((image) => {
            return (
              <div className="flex gap-2 items-end border border-solid border-gray-500 rounded p-2">
                <img className="h-20 w-20 object-cover" src={image} alt=""></img>
                <i className="ri-delete-bin-line" onClick={() => {
                   deleteImage(image);
                }}></i>
              </div>
            )
          })}
      </div>
      <Upload listType="picture" beforeUpload={() => false}
         onChange={(info) => {
            setFile(info.file);
            setShowPreview(true);  
         }}
         fileList={file ? [file] : []}
         showUploadList={showPreview}
      >
        <Button type="dashed">Upload Image</Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button type="default" onClick={() => {setShowProductForm(false);}}>
          Cancel
        </Button>

        <Button type="primary" onClick={upload} disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  )
}

export default Images
