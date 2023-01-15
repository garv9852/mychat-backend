const express=require("express");
const app=express();
app.use(express.json())
const cors = require('cors');
const server=require('http').createServer(app);
const io=require('socket.io')(server,{
    cors:{
        origin:"*",
        method:["GET","POST"]   
    }
});
app.use(cors());
const port = process.env.PORT || 5000
let AllClients=[

]
io.on("connection",(socket)=>{
    socket.on("JOIN",({name})=>{
        socket.emit("ALL_PEER",(AllClients))
        AllClients.push({name,socketId:socket.id});
        socket.broadcast.emit("NEW_PEER",({name,socketId:socket.id}))
        socket.on("SEND_MESG",({peerId,data})=>{
            io.to(peerId).emit("RECEIVE_MESG",({
                data,
                peerId:socket.id
            }))
        })
        socket.on('disconnect', ()=>{
            AllClients=AllClients.filter((e)=>e.socketId!=socket.id);
            socket.broadcast.emit("DELETE_PEER",({socketId:socket.id}))
         });
    })

})
app.get("/",(req,res)=>{
    res.send("Home Page")
})
server.listen(port,()=>{
    console.log("server created");
})

module.exports=server;