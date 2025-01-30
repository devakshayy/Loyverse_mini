import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";
import { getDatabase, set, push, ref } from "firebase/database";
import { toast } from "sonner";
const Create = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

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
      validationErrors.category =
        "The category should be at least 2 characters";
    }
    if (!item.description || item.description.length < 10) {
      validationErrors.description =
        "The description length should be at least 10 characters";
    }

    // If there are errors, update state and stop form submission
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }
    try {
      const db = getDatabase(app);
      const newDocRef = push(ref(db, "items"));
    
      const saveItemPromise = set(newDocRef, item); 
      
      toast.promise(saveItemPromise, {
        loading: "Saving item...",
        success: "Item saved successfully!",
        error: "Failed to save item!",
      });
    
      navigate("/items"); 
    } catch (error) {
      toast.error("Unable to connect to the server!");
    }
    
    
  }
  return (
    <div className="p-4 h-screen w-full bg-white text-gray-900">
      <form id="form" onSubmit={handleSubmit}>
        <div className="bg-white rounded-md shadow-lg">
          <div className="border-b-[1px] px-3 py-2">
            <a className="itemadd-ul-text-decoration font-bold text-[#4baf4f]">
              New Item
            </a>
          </div>
          <div className="flex gap-20">
            {/* Left Column */}
            <div className="p-3 w-full flex flex-col gap-2">
              {/* Item Code */}
              <div>
                <label
                  htmlFor="code"
                  className="block text-[15px] font-medium text-gray-700"
                >
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  autoComplete="off"
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.code}
                </span>
              </div>
              {/* Barcode */}
              <div>
                <label
                  htmlFor="barcode"
                  className="block text-[15px] font-medium text-gray-700"
                >
                  Barcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  autoComplete="off"
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.barcode}
                </span>
              </div>
              {/* Item Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-[15px] font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="off"
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.name}
                </span>
              </div>
              {/* Purchase Rate */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-[15px] font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  autoComplete="off"
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                  placeholder="0.0000"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.price}
                </span>
              </div>
              {/* Sale Rate */}
            </div>

            {/* Right Column */}
            <div className="p-3 w-full flex flex-col gap-2">
              {/* Brand */}
              <div>
                <label
                  htmlFor="cost"
                  className="block text-[15px] font-medium text-gray-700"
                >
                  Cost
                </label>
                <input
                  type="text"
                  id="cost"
                  name="cost"
                  autoComplete="off"
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
                <span className="text-[15px] text-red-600">
                  {validationErrors.cost}
                </span>
              </div>
              {/* category starts */}
              <div>
                <label
                  htmlFor="category"
                  className="block mb-1 text-[13px] font-medium text-gray-900"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
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
              {/* Category  Ends*/}
              {/* <div>
                  <label
                    htmlFor="image"
                    className="block text-[15px] font-medium text-gray-700"
                  >
                    Upload image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    autoComplete="off"
                    className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                  />
                   <span className="text-[15px] text-red-600">{validationErrors.image}</span>
                   
                </div> */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-[15px] font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  autoComplete="off"
                  className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
                />
              </div>
              <span className="text-[15px] text-red-600">
                {validationErrors.description}
              </span>
              {/* Opening Qty */}

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
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create;
