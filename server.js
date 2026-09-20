
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || "CHANGE-ME-BEFORE-PRODUCTION";
const DATA_FILE = path.join(__dirname, "data", "orders.json");

app.use(express.json({limit:"100kb"}));
app.use(express.static(path.join(__dirname, "public")));

function readOrders(){
  try { return JSON.parse(fs.readFileSync(DATA_FILE,"utf8")); }
  catch { return []; }
}
function saveOrders(x){ fs.writeFileSync(DATA_FILE, JSON.stringify(x,null,2)); }
function nextId(orders){ return String((Math.max(0,...orders.map(o=>Number(o.id)||0))+1)).padStart(5,"0"); }

app.get("/api/health",(req,res)=>res.json({ok:true,service:"KHALI PET live delivery",time:new Date().toISOString()}));

app.post("/api/orders",(req,res)=>{
  const b=req.body||{};
  if(!b.name||!b.phone||!b.address||!Array.isArray(b.items)||!b.items.length)
    return res.status(400).json({error:"Missing order details"});
  const orders=readOrders();
  const order={
    id:nextId(orders), createdAt:new Date().toISOString(),
    name:String(b.name), phone:String(b.phone), address:String(b.address),
    area:String(b.area||""), payment:String(b.payment||"COD"),
    items:b.items, subtotal:Number(b.subtotal||0), delivery:Number(b.delivery||0),
    total:Number(b.total||0), status:"PLACED", location:null
  };
  orders.push(order); saveOrders(orders);
  io.emit("order:new",order);
  res.json({id:order.id,status:order.status});
});

app.get("/api/orders",(req,res)=>{
  if(req.query.pin!==ADMIN_PIN) return res.status(401).json({error:"Unauthorized"});
  res.json(readOrders().slice().reverse());
});

app.patch("/api/orders/:id",(req,res)=>{
  if(req.body.pin!==ADMIN_PIN) return res.status(401).json({error:"Unauthorized"});
  const orders=readOrders(), o=orders.find(x=>x.id===req.params.id);
  if(!o) return res.status(404).json({error:"Order not found"});
  if(req.body.status) o.status=String(req.body.status);
  saveOrders(orders); io.emit("order:update",o);
  res.json(o);
});

io.on("connection",(socket)=>{
  socket.on("joinOrder",({orderId})=>{
    socket.join("order:"+String(orderId));
  });

  socket.on("customerLocation",(p)=>{
    if(!p || !p.orderId || typeof p.lat!=="number" || typeof p.lng!=="number") return;
    const orders=readOrders(), o=orders.find(x=>x.id===String(p.orderId));
    if(!o) return;
    o.location={lat:p.lat,lng:p.lng,accuracy:p.accuracy||null,updatedAt:new Date().toISOString()};
    saveOrders(orders);
    io.to("admin").emit("location:update",{orderId:o.id,location:o.location});
    io.to("order:"+o.id).emit("location:ack",o.location);
  });

  socket.on("adminJoin",({pin})=>{
    if(String(pin)===ADMIN_PIN) socket.join("admin");
  });
});

app.get("/admin",(req,res)=>res.sendFile(path.join(__dirname,"public","admin.html")));

server.listen(PORT,()=>console.log(`KHALI PET server running on http://localhost:${PORT}`));
