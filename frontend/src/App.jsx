import React from 'react'
import { useEffect } from 'react';
import {useState,useRef} from 'react';
import {io} from 'socket.io-client'


const App = () => {
  const [message,setMessage] = useState("");
const [welcomeMsg,setWelcomeMsg]=useState("");
const [roomId,setRoomId]  = useState("");
const [chat,setChat]  = useState([]);
const socket=useRef(null);

 
   useEffect( ()=>{
      socket.current=io('http://localhost:8000');
   
    socket.current.on("connect",()=>{
      console.log("connected",socket.current.id);
    })
   socket.current.on("welcome",(msg)=>setWelcomeMsg(msg));

   socket.current.on('recieve-message',(data)=>{
    console.log(data);
    setChat((chat)=> [...chat,data]) ;
   })

   
   
   return ()=>{
     socket.current.disconnect();
   }
  }
    ,[])

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.current.emit("message",{message,roomId});
    setMessage("");
  }
  return (
     <>

   
    <form className="socketform" onSubmit={(e)=>handleSubmit(e)}>
       {welcomeMsg ==="" ? <div></div>: <h1 >{welcomeMsg}</h1> }
       <br/>
       <br/>
      <label>Enter Room Id</label>
      <input placeholder="RoomId" value={roomId} onChange={(e)=>setRoomId(e.target.value)} />
      <label>Type Your message</label>
 <input  placeholder="message" value={message} onChange={(e)=>setMessage(e.target.value)} />
 <button  type='submit'>Send</button>
 
    </form>

    <div style={{  padding: '10px', border: '1px solid #ccc' }}>
      <h3>Chat Messages:</h3>
      {chat.length > 0 ? (
        chat.map((msg, index) => (
          <div key={index} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
            {msg}
          </div>
        ))
      ) : (
        <div>No Chats to load</div>
      )}
    </div>

    </>
  )
}

export default App