import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdCall, MdMessage } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { LiaBarcodeSolid } from "react-icons/lia";
import app from "../firebase";
import { getDatabase,set,push,ref } from "firebase/database";
import { toast } from "sonner";

const CreateCustomer = () => {
   const navigate = useNavigate()
   const [validationErrors,setValidationErrors] = useState({})

   const handleSubmit = async (e) => {

      e.preventDefault();
      const formData = new FormData(e.target);
      const customer = Object.fromEntries(formData.entries());
      let validationErrors = {};

      if (!customer.name  || customer.name.length < 3) {
        validationErrors.name = "Name must have 3 character or more";
       }
      if (!customer.email || !/\S+@\S+\.\S+/.test(customer.email)){
        validationErrors.email = "Invalid email"
      }
      if( !customer.phone || customer.phone.length !== 10) {
         validationErrors.phone = "Phone must have 10 digits"
      }
      if( !customer.postalCode || customer.postalCode.length !== 6 ){
         validationErrors.postalCode = "The postal Code code must have 6 digits"
      }
      if( !customer.customerCode || customer.customerCode.length !== 4 ){
        validationErrors.customerCode = "The customer Code code must have 4 digits"
      }
      if( !customer.note || customer.note.length < 10 ){
      validationErrors.note = "Input must be at least 10 characters long."
      }

      if(Object.keys(validationErrors).length > 0){
         return setValidationErrors(validationErrors)
      }
     
      try {
       const currentDate = new Date().toISOString();
       const isFirstVisit = !customer.firstVisit;

       const db = getDatabase(app);
       const newDocRef = push(ref(db, "customers"));
       const customerData = {
          ...customer,
          firstVisit: isFirstVisit ? currentDate : customer.firstVisit,
          lastVisit: currentDate,
          totalVisits:1

       }
       await set(newDocRef,customerData);
       navigate("/customers")
       toast.success("Customer added successfully!!",{position:"top-center"})
      } catch (error) {
         alert("Unable to connect to the Server!!!")
      }
   }
   
  return (
    <div className="p-2 h-screen w-full bg-white text-gray-900 overflow-auto">
      <div className="flex flex-col bg-white w-full sm:w-1/2 rounded-md shadow-2xl p-6">
        <div className="flex items-center justify-center">
          <FaUserCircle className="w-20 rounded-full h-16" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            name="name"
            autoComplete="off"
            className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${ validationErrors.name  ? "border-red-500" : "border-gray-200"}  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
            placeholder="Name"
            type="text"
          />
          <div className="flex items-center gap-2 w-full">
            <MdEmail />
            <input
              name="email"
              autoComplete="off"
              className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${ validationErrors.email ? "border-red-500" : "border-gray-200"}  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
              placeholder="Email"
              type="text"
            />
          </div>

          <div className="flex items-center gap-2">
            <MdCall />
            <input
              name="phone"
              autoComplete="off"
              className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${ validationErrors.phone ? "border-red-500" : "border-gray-200"}  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
              placeholder="Phone"
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaLocationDot />
            <input
              name="address"
              autoComplete="off"
              className="outline-none w-full border-b-2  border-gray-200  focus:border-[#4baf4f]  text-gray-600 text-sm placeholder:text-gray-500  px-1"
              placeholder="Address"
              type="text"
            />
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-4">
              {/* Left Side Inputs */}
              <div className="flex w-full md:w-1/2 flex-col gap-4">
                <div className="flex items-center gap-2">
                  <input
                   
                    name="city"
                    autoComplete="off"
                    className="outline-none w-full border-b-2 border-gray-200 focus:border-[#4baf4f] text-gray-600 text-sm placeholder:text-gray-500 px-1"
                    placeholder="City"
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    
                    name="state"
                    autoComplete="off"
                    className="outline-none w-full border-b-2 border-gray-200 focus:border-[#4baf4f] text-gray-600 text-sm placeholder:text-gray-500 px-1"
                    placeholder="State"
                    type="text"
                  />
                </div>
              </div>

              {/* Right Side Inputs */}
              <div className="flex w-full md:w-1/2 flex-col gap-4">
                <div className="flex items-center gap-2">
                  <input
                    
                    name="postalCode"
                    autoComplete="off"
                    className={`outline-none w-full border-b-2 ${
                      validationErrors.postalCode
                        ? "border-red-500"
                        : "border-gray-200"
                    } focus:border-[#4baf4f] text-gray-600 text-sm placeholder:text-gray-500 px-1`}
                    placeholder="Postal Code"
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    name="country"
                    autoComplete="off"
                    className="outline-none w-full border-b-2 border-gray-200 focus:border-[#4baf4f] text-gray-600 text-sm placeholder:text-gray-500 px-1"
                    placeholder="Country"
                    type="text"
                  />
                </div>
              </div>
            </div>
          <div className="flex items-center gap-2 w-full">
            <LiaBarcodeSolid />
            <input
              name="customerCode"
              autoComplete="off"
              className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${ validationErrors.customerCode ? "border-red-500" : "border-gray-200"}  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
              placeholder="Customer code"
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <MdMessage />
            <textarea
              name="note"
              autoComplete="off"
              className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${ validationErrors.note ? "border-red-500" : "border-gray-200"}  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
              placeholder="Note"
              type="text"
            />
          </div>
          <div className="flex justify-end mt-4 gap-4">
             <Link to="/customers" className="py-2 px-2 w-[100px] text-xs font-medium rounded-sm text-gray-900 bg-white shadow-md">
               Cancel
             </Link>
             <button  type="submit" className="py-2 px-2 w-[100px] text-xs font-medium rounded-sm text-white bg-[#8cc748]">
                Save
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;



// <div>
// <label
//   htmlFor="poseCode"
//   className="block text-[15px] font-medium text-gray-700"
// >
//   POS PIN
// </label>
// <input
//   type="number"
//   id="poseCode"
//   name="poseCode"
//   autoComplete="off"
//   className="mt-1 block w-full p-2 text-xs bg-[#f4f5f6] rounded-md shadow-sm focus:ring-none focus:outline-gray-300"
//   placeholder='* * * *'
// />
//  <span className="text-[15px] text-red-600">{"validationErrors.poseCode"}</span>
// </div>
