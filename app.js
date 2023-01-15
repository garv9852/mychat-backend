const express=require("express");
const app=express();
app.use(express.json())
const server=require('http').createServer(app);
const io=require('socket.io')(server,{
    cors:{
        origin:"http://localhost:3000",
        method:["GET","POST"]   
    }
});

let AllClients=[

]
const port=5500;
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
server.listen(port,()=>{
    console.log("server created",port);
})

module.exports=server;