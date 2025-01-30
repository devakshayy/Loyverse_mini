import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import app from "../firebase";
import { getDatabase,get,set,ref } from "firebase/database";
import { toast } from "sonner";

const Edit = () => {
  const {id} = useParams()
  const [initialData, setInitialData] = useState()     //not display the form when no data in initial data
  const [validationErrors, setValidaionErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
     const getItems = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db,`items/${id}`);
      const snapShot = await get(dbRef);
      if(snapShot.exists()){
        setInitialData(snapShot.val());
      }else{
        alert("Unable to get the item")
      }
     }
     getItems()
  }, [])
  

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const item = Object.fromEntries(formData.entries());

       
     let validationErrors = {};

     if (!item.code || item.code.length !== 4) {
      validationErrors.code = "The Code must have 4 digits";
     }
     if (!item.barcode || item.barcode.length !== 13) {
      validationErrors.barcode = "The Barcode must have 13 digits";
     }
     if (!item.name || item.name.length < 2) {
      validationErrors.name = "The name length should be at least 2 characters";
     }
     if (!item.price || isNaN(item.price) || Number(item.price) <= 0) {
      validationErrors.price = "The Price is not valid";
     }
     if (!item.cost || isNaN(item.cost) || Number(item.cost) <= 0) {
      validationErrors.cost = "The Cost is not valid";
     }
     if (!item.category || item.category.length < 2) {
      validationErrors.category = "The category should be at least 2 characters";
     }
     if (!item.description || item.description.length < 10) {
      validationErrors.description = "The description length should be at least 10 characters";
     }
   
     if (Object.keys(validationErrors).length > 0) {
      setValidaionErrors(validationErrors);
       return;
     }
     try {
      const db = getDatabase(app);
      const updateDocRef = ref(db, `items/${id}`);
    
     
      const updateItemPromise = set(updateDocRef, item);
    
      toast.promise(updateItemPromise, {
        loading: "Saving item...",
        success: () => {
          navigate("/items"); 
          return "Item updated successfully!";
        },
        error: "Failed to update item!",
      });
    } catch (error) {
      toast.error("Unable to connect to the server!");
    }    
  }
  return (
    <div className="p-4 h-screen w-full bg-white overflow-auto text-gray-900">
      { initialData && 
      <form id="form"  onSubmit={handleSubmit} className="bg-white w-1/2 rounded-md mb-20 shadow-lg"> 
          <div className="border-b-[1px] px-3 py-2">
            <a className="font-bold text-[#4baf4f]">Edit {initialData.name}</a>
          </div>
          <div className=" w-full p-4 flex flex-col gap-2">
            {/* Item Code */}
            <div className="flex items-center justify-between gap-2">
              <label
                className=" text-sm font-medium text-gray-700 "
              >
                ID:
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="id"
                  readOnly
                  autoComplete="off"
                  defaultValue={id}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="code"
                className=" text-sm font-medium text-gray-700"
              >
                Code:
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="code"
                  name="code"
                  autoComplete="off"
                  defaultValue={initialData.code}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.code}
                </span>
              </div>
            </div>

            {/* Item Barcode */}
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="barcode"
                className="text-sm font-medium text-gray-700"
              >
                Barcode:
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  autoComplete="off"
                  defaultValue={initialData.barcode}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.barcode}
                </span>
              </div>
            </div>
            {/* Item Name */}
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name:
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="off"
                  defaultValue={initialData.name}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.name}
                </span>
              </div>
            </div>

            {/* Price Rate */}

            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="price"
                className=" text-sm font-medium text-gray-700"
              >
                Price:
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="price"
                  name="price"
                  autoComplete="off"
                  defaultValue={initialData.price}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.price}
                </span>
              </div>
            </div>

            {/* Cost */}

            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="cost"
                className=" text-sm font-medium text-gray-700"
              >
                Cost:
              </label>
              <div className="w-full">
                <input
                  type="text"
                  id="cost"
                  name="cost"
                  autoComplete="off"
                  defaultValue={initialData.cost}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.cost}
                </span>
              </div>
            </div>

            {/* category starts */}

            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="category"
                className="block mb-1 text-sm font-medium text-gray-900"
              >
                Category:
              </label>
              <div className="w-full">
                <select
                  id="category"
                  name="category"
                  defaultValue={initialData.category}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                >
                  <option value="all">All items</option>
                  <option value="no-category">No category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="furniture">Furniture</option>
                </select>
                <span className="text-[15px] text-red-600">
                  {validationErrors.category}
                </span>
              </div>
            </div>

            {/* Image */}

            {/* <div className="flex items-center justify-center gap-28">
            
              <div >
                <img
                 width="80"
                 className="rounded-md"
                 src={"http://localhost:4000/images/" + initialData.imageFilename} alt="..." />

              </div>
            </div> */}

            {/* <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image:
              </label>
              <div className="w-full">
                <input
                  type="file"
                  id="image"
                  name="image"
                  autoComplete="off"
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.image}
                </span>
              </div>
            </div> */}
            {/* CreatedAt */}
            
            {/* <div className="flex items-center justify-between gap-2">
              <label
                className="block text-sm font-medium text-gray-700"
              >
                CreatedAt:
              </label>
              <div className="w-full">
                <input
                  readOnly
                  id="image"
                  autoComplete="off"
                  defaultValue={new Date}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
              </div>
            </div> */}
            {/* Description */}

            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description:
              </label>
              <div className="w-full">
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  autoComplete="off"
                  defaultValue={initialData.description}
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.description}
                </span>
              </div>
            </div>

            {/* buttons Qty */}

            <div className="flex justify-end gap-4">
              <Link
                to="/items"
                className="py-2 px-2 w-[100px] text-xs font-medium rounded-sm text-gray-900 bg-white shadow-md"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="py-2 px-2 w-[100px] text-xs font-medium rounded-sm text-white bg-[#8cc748]"
              >
                Save
              </button>
            </div>
          </div>
        
      </form>}
    </div>
  );
};

export default Edit;
