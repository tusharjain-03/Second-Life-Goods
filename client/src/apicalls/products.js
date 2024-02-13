import { axiosInstance } from "./axiosInstance";

// add a product
export const AddProduct = async (payload) => {
  try {
    axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
    const response = await axiosInstance.post("/api/products/add-product", payload);
    return response.data;
  }catch (error) {
    return error.message;
  }  
};

// get products
export const GetProducts = async (filters) => {
    try{
       axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
       const response = await axiosInstance.post("/api/products/get-products", filters);
       return response.data;
    }catch(error){
        return error.message;
    }
};

// get a product by id
export const GetProductById = async (id) => {
    try {
      axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
      const response = await axiosInstance.get(`/api/products/get-product-by-id/${id}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
};

// edit product
export const EditProduct = async (id, payload) => {
    try {
      axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
      const response = await axiosInstance.put(`api/products/edit-product/${id}`,payload)
      return response.data;
    } catch (error) {
      return error.message;
    }
};

// delete product
export const DeleteProduct = async (id) => {
  try {
    axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
    const response = await axiosInstance.delete(`api/products/delete-product/${id}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// Upload product image
export const UploadProductImage = async (payload) => {
  try {
    axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
    const response = await axiosInstance.post("/api/products/upload-image-to-product", payload);
    return response.data;
  }catch (error) {
    return error.message;
  }  
};

// Update product status
export const UpdateProductStatus = async (id, status) => {
   try {
     axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
     const response = await axiosInstance.put(`/api/products/update-product-status/${id}`, {status});
     return response.data;
   } catch (error) {
     return error.message;
   }
};

// Place a new bid
export const PlaceNewBid = async (payload) => {
   try {
     axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
     const response = await axiosInstance.post("/api/bids/place-new-bid", payload);
     return response.data;
   } catch (error) {
     return error.message;
   }
};

// get all bids
export const GetAllBids = async (filters) => {
  try {
    axiosInstance.defaults.headers['authorization'] = `Bearer ${localStorage.getItem("token")}`;
    const response = await axiosInstance.post("/api/bids/get-all-bids",filters);
    return response.data;
  } catch (error) {
    return error.message;
  }
}
