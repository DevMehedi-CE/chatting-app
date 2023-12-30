import React, { useEffect, useState } from 'react'
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from 'react-redux';
import ProfilePhoto from './ProfilePhoto';

const UserList = () => {

   const db = getDatabase();
   const data = useSelector((state)=>state.userLoginInfo.userInfo)
   let [userList, setUserList] = useState([]);
   let [friendRequestList, setFriendRequestList] = useState([])
   let [friendList, setFriendList] = useState([]);
   let [searchUser, setSearchUser] = useState([])
   

   // get user list from database 
   useEffect(()=>{
         const userRef = ref(db,"users");
         onValue(userRef,(snapshot)=>{
            let list =[]
            snapshot.forEach((item)=>{
               // console.log(item)
               // list.push({
               //    ...item.val,id: item.key
               // })

               if(data.uid !==item.key){
                  list.push({...item.val(), id: item.key})
               }  
            })
            setUserList(list)
            // console.log(userList)
         })
   },[])
   // get user list from database 

   // friend request send start 

   const handelFriendRequest = (item)=>{
      // console.log("clicked",item)
      set(push(ref(db,'friendRequest')),{
         senderId: data.uid,
         senderName:data.displayName,
         receverId:item.id,
         receverName:item.username,
      })
   }

   useEffect(()=>{
      const friendRequestRef = ref(db,'friendRequest')
      onValue(friendRequestRef,(snapshot)=>{
         let request = []
         snapshot.forEach((item)=>{
            request.push (item.val().receverId + item.val().senderId)
         })
         setFriendRequestList(request)
      })
   },[])


   // friend request send end

   // friend list data from friend collection start 
   useEffect(()=>{
      const friendListRef = ref(db,'friend');
      onValue(friendListRef,(snapshot)=>{
        let list =[];
      snapshot.forEach((item)=>{
         list.push(item.val().receverId + item.val().senderId)
      });
      setFriendRequestList(list)  
      })
   },[])
   // friend list data from friend collection end 

   // search user start 
const handleSearch = (e)=>{
   // console.log(e.target.value)
   let arr=[]
   userList.filter((item)=>{
      if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
         arr.push(item)
      }
   })
   setSearchUser(arr)
   
}
// console.log(setSearchUser)
   



   // search user end 



  return (

      <div>
                

             {/* User List top part start  */}
             {/* <input onChange={handleSearch} className='p-1 px-2 rounded-md w-full border-blue-300 mx-auto outline-none' type="search" placeholder='Search Here' />  */}
            <div className=' bg-chat p-2 rounded-t-xl  flex items-center justify-between w-full top-0 left-0 sticky'>

                  <input onChange={handleSearch} className='p-1 px-2 rounded-md w-5/6 border-blue-300 mx-auto outline-none' type="search" placeholder='Search Here' />
               
            </div>

             {/* User List top part end */}


            {/* user part start */}
      
           {
            searchUser.length>0
            ?
            searchUser.map((item,i)=>{
               return(
               <div key={i}>
                  <div  className='flex justify-between items-center p-2'> 
                  <div className='flex gap-x-4 items-center px-2 py-2'>
                     <div>
                        <ProfilePhoto  imgId={item.id} />
                        {/* <img className='w-12 h-12 rounded-full' src="/public/profile3.jpg" alt="profile" /> */}
                     </div>
                     <div className='text-lg font-mono font-bold'>
                     <h2> {item.username} </h2>
                     <h2> {item.email} </h2>
                     </div>
                     
                  </div>
         
                  <div>

                     {
                        friendList.includes(item.id+data.uid)||friendList.includes(data.uid+item.id) ?
                        <button className='text-xs bg-green-700   font-serif  py-1 px-2 rounded' type='submit' >Friend</button>
                        :
                        friendRequestList.includes(item.id+data.uid) || friendRequestList.includes(data.uid+item.id)?
                     ( <button className='text-xs bg-green-700   font-serif  py-1 px-2 rounded' type='submit' >Request Send </button>)
                        :
                     ( <button onClick={()=> handelFriendRequest(item)} className='text-xs bg-quaternary   font-serif  py-1 px-2 rounded' type='submit' >Add Friend</button>)
                     }
                  </div>
                  </div>
               </div>
               
               )
            })
            :
            userList.map((item,i)=>{
               return(
               <div key={i}>
                  <div  className='flex justify-between items-center p-2'> 
                  <div className='flex gap-x-4 items-center px-2 py-2'>
                     <div>
                        <ProfilePhoto  imgId={item.id} />
                        {/* <img className='w-12 h-12 rounded-full' src="/public/profile3.jpg" alt="profile" /> */}
                     </div>
                     <div className='text-lg font-mono font-bold '>
                     <h2> {item.username} </h2>
                     <h2> {item.email} </h2>
                     </div>
                     
                  </div>
         
                  <div>

                     {
                        friendList.includes(item.id+data.uid)||friendList.includes(data.uid+item.id) ?
                        <button className='text-xs bg-green-700  text-white font-serif  py-1 px-2 rounded' type='submit' >Friend</button>
                        :
                        friendRequestList.includes(item.id+data.uid) || friendRequestList.includes(data.uid+item.id)?
                     ( <button className='text-xs bg-green-700  text-white font-serif  py-1 px-2 rounded' type='submit' >Request Send </button>)
                        :
                     ( <button onClick={()=> handelFriendRequest(item)} className='text-xs bg-quaternary  text-white font-serif  py-1 px-2 rounded' type='submit' >Add Friend</button>)
                     }
                  </div>
                  </div>
               </div>
               
               )
            })
           }   
      
            {/* user part end */}
      </div>
      
   
  )
}

export default UserList
