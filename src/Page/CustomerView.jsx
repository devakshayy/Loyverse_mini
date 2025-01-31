import React, { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { MdEmail,MdCall,MdMessage } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { LiaBarcodeSolid } from "react-icons/lia";
import { FaUserEdit } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { MdDeleteSweep } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref ,get,remove } from 'firebase/database';
import app from '../firebase';
import { toast } from 'sonner';


const CustomerView = () => {

  const navigate = useNavigate();
  const {cusid} = useParams()
  const [initialData, setInitialData] = useState([]);
  useEffect(() => {
    const getCustomer = async () => {
       const db = getDatabase(app);
       const dbRef = ref(db,`customers/${cusid}`);
       const snapShot = await get(dbRef);
       if (snapShot.exists()) {
        setInitialData({ ...snapShot.val(), id: cusid });
      }else{
         alert("Unable to get itmes")
       }
    }
    getCustomer()
 }, [cusid])

  
  const handleDelete = (id, name) => {
    const customerName = name.toUpperCase();
    const db = getDatabase(app);
    const dbRef = ref(db, `customers/${id}`);

    toast(`Are you sure you want to delete ${customerName}???`, {
      position: 'top-center',
      action: {
        label: "Yes",
        onClick: async () => {
          try {
            await remove(dbRef);
            toast.success(`${customerName} has been deleted successfully.`);
            setTimeout(() => {
              navigate("/customers")
            }, 1000);
          } catch (error) {
            toast.error(`Failed to delete ${customerName}: ${error.message}`);
          }
        },
      },
    });
  };
   
  const editNavHandler = (id) => {
      navigate(`/customers/edit/${id}`)
  }

  
  return (
    <div className="p-2 h-screen w-full bg-white text-gray-900 overflow-auto">  
      <div className="bg-white w-full sm:w-1/2  rounded-md shadow-2xl">
         <div className='border-b-2 p-2 flex items-center justify-between'>
             <button onClick={()=>navigate("/customers")} className='text-xs flex items-center gap-2 p-1 hover:bg-gray-100'><IoChevronBack />Customer base</button>
            <div className='flex items-center gap-2'>
            <button onClick={() => editNavHandler(initialData.id)}><FaUserEdit /></button>
            <button onClick={() => handleDelete(initialData.id,initialData.name) }><MdDeleteSweep /></button>
            </div>
         </div>
        <div className="flex items-center gap-3 relative justify-center  p-3">
           <div className='flex flex-col items-center'>
           <FaUserCircle className='w-16 rounded-full h-16' />
           <div className=' text-xl font-semibold'>{initialData.name}</div>
           </div>
        </div>
        <div className='p-5 flex flex-col gap-4 '>
           <div className='flex items-center gap-2'> 
            <MdEmail />
            <div className='text-xs text-gray-600'>{initialData.email}</div>
           </div>
           <div  className='flex items-center gap-2'> 
             <MdCall />
              <div className='text-xs text-gray-600'>{initialData.phone}</div>
             
           </div>
           <div  className='flex items-center gap-2'>
            <FaLocationDot />
             <div className='text-xs text-gray-600'>{initialData.address} at {initialData.city},{initialData.state}</div>
            </div>
           <div  className='flex items-center gap-2'>
             <LiaBarcodeSolid />
              <div className='text-xs text-gray-600'> 2845 </div>
             </div>
           <div  className='flex items-center gap-2'> 
            <MdMessage />
            <div className='text-xs text-gray-600 capitalize'>{initialData.note}</div>
           </div>
       </div>
         <div className='text-xs px-3 py-1 flex justify-between text-gray-600 border-t-2' >  {/* first div */}
           <div>
           <div><span className='text-gray-900 font-semibold'>First Visit </span>: {initialData?.firstVisit ? initialData.firstVisit.slice(0,10) : "N/A"}</div>
            <div><span className='text-gray-900 font-semibold'>Last Visit</span>: {initialData?.lastVisit ? initialData.lastVisit.slice(0,10) : "N/A"}</div>
            <div><span className='text-gray-900 font-semibold'>Visits</span>:  {initialData.totalVisits}</div>
           </div>
           <div>
           <div><span className='text-gray-900 font-semibold'>Total Spent</span>:</div>
           <div><span className='text-gray-900 font-semibold'>Points</span>: {initialData.pointsBalance}</div>
           </div>
         </div>
      </div>      
   </div>
  )
}

export default CustomerView
