import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const server = createServer(app);

const io = new Server(server, {
    cors:{
       origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(cors(
    {
     origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    }
));
app.use(express.json());

app.get('/', (req, res) => {
 res.send("chat loaded")
});

io.on("connect",(socket)=>{
    console.log("User connected",socket.id);
    socket.emit("welcome",`Welcome user ${socket.id}`)
    // socket.broadcast.emit("welcome",`Welcome user ${socket.id}`)

    socket.on("message",(data)=>{
       console.log(data);
        // socket.broadcast.emit("recieve-message", data );
         socket.to(data?.roomId).emit("recieve-message", data?.message );
       
    })
   
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
}

)

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});




