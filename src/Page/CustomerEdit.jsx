import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdEmail, MdCall, MdMessage } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { LiaBarcodeSolid } from "react-icons/lia";
import { toast } from "sonner";
import app from "../firebase";
import { getDatabase, get, ref, set } from "firebase/database";

const CustomerEdit = () => {
  const { cusid } = useParams();
  const [initialData, setInitialData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getCustomers = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, `customers/${cusid}`);
      const snapShot = await get(dbRef);
      if (snapShot.exists()) {
        setInitialData(snapShot.val());
      } else {
        toast.error("Unable to get the customer");
      }
    };
    getCustomers();
  }, [cusid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customer = Object.fromEntries(formData.entries());
    let validationErrors = {};

    if (!customer.name || customer.name.length < 3) {
      validationErrors.name = "Name must have 3 character or more";
    }
    if (!customer.email || !/\S+@\S+\.\S+/.test(customer.email)) {
      validationErrors.email = "Invalid email";
    }
    if (!customer.phone || customer.phone.length !== 10) {
      validationErrors.phone = "Phone must have 10 digits";
    }
    if (!customer.postalCode || customer.postalCode.length !== 6) {
      validationErrors.postalCode = "The postal Code code must have 6 digits";
    }
    if (!customer.customerCode || customer.customerCode.length !== 4) {
      validationErrors.customerCode =
        "The customer Code code must have 4 digits";
    }
    if (!customer.note || customer.note.length < 10) {
      validationErrors.note = "Input must be at least 10 characters long.";
    }

    if (Object.keys(validationErrors).length > 0) {
      return setValidationErrors(validationErrors);
    }

    try {
      const firstVisit = initialData.firstVisit;
      const currentDate = new Date().toISOString();
      const totalVisits = Number(initialData.totalVisits);
      const db = getDatabase(app);
      const newDocRef = ref(db, `customers/${cusid}`);
      const customerData = {
        ...customer,
        firstVisit: firstVisit,
        lastVisit: currentDate,
        totalVisits: totalVisits + 1,
      };
      await set(newDocRef, customerData);
      toast.success("Customer Updated successfully!!", {
        position: "top-center",
      });
      navigate(`/customers/view/${cusid}`);
    } catch (error) {
      toast.warning("Unable to connect to the Server!!!");
    }
  };
  return (
    <div className="p-2 h-screen w-full bg-white text-gray-900 overflow-auto">
      <div className="flex flex-col bg-white w-full sm:w-1/2 rounded-md shadow-2xl p-6">
        <div className="flex items-center justify-center">
          <FaUserCircle className="w-20 rounded-full h-16" />
        </div>
        {initialData && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              defaultValue={initialData.totalVisits}
              name="totalVisits"
              type="hidden"
            />
            <input
              defaultValue={initialData.name}
              name="name"
              autoComplete="off"
              className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${
                validationErrors.name > 0 ? "border-red-500" : "border-gray-200"
              }  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
              placeholder="Name"
              type="text"
            />
            <div className="flex items-center gap-2 w-full">
              <MdEmail />
              <input
                defaultValue={initialData.email}
                name="email"
                autoComplete="off"
                className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${
                  validationErrors.email ? "border-red-500" : "border-gray-200"
                }  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
                placeholder="Email"
                type="text"
              />
            </div>

            <div className="flex items-center gap-2">
              <MdCall />
              <input
                defaultValue={initialData.phone}
                name="phone"
                autoComplete="off"
                className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${
                  validationErrors.phone ? "border-red-500" : "border-gray-200"
                }  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
                placeholder="Phone"
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaLocationDot />
              <input
                defaultValue={initialData.address}
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
                    defaultValue={initialData.city}
                    name="city"
                    autoComplete="off"
                    className="outline-none w-full border-b-2 border-gray-200 focus:border-[#4baf4f] text-gray-600 text-sm placeholder:text-gray-500 px-1"
                    placeholder="City"
                    type="text"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    defaultValue={initialData.state}
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
                    defaultValue={initialData.postalCode}
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
                    defaultValue={initialData.country}
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
                defaultValue={initialData.customerCode}
                name="customerCode"
                autoComplete="off"
                className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${
                  validationErrors.customerCode
                    ? "border-red-500"
                    : "border-gray-200"
                }  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
                placeholder="Customer code"
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 w-full">
              <MdMessage />
              <textarea
                defaultValue={initialData.note}
                name="note"
                autoComplete="off"
                className={`outline-none w-full border-b-2  border-gray-200 focus:border-[#4baf4f] ${
                  validationErrors.note ? "border-red-500" : "border-gray-200"
                }  text-gray-600 text-sm placeholder:text-gray-500  px-1`}
                placeholder="Note"
                type="text"
              />
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Link
                to={`/customers/view/${cusid}`}
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
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerEdit;

// address
// city
// country
// customerCode
// email
// firstVisit
// id
// lastVisit
// name
// note
// phone
// pointsBalance
// state
// totalVisits
