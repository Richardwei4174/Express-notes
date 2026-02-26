import express, { request } from "express";

const app = express(); // to use express

const PORT = process.env.PORT || 3000;

app.get('/', (request, response)=>{
  response.status(201).send({msg: "Hello!"});
});

app.get("/api/users", (request, response)=> {
  response.send([
    {id: 1, username: "Richardwei127", displayname: "Richardwei4174"},
    {id: 2, username: "Richardwei1272", displayname: "Richardwei41742"},
  ]);
});

app.get("/api/products",(request, response)=>{
  response.send([
    {id: 123, name: 'cucumber', price: "12.99"},
  ]);
});

// all to listen a port for incoming http request
app.listen(PORT, ()=> {
  console.log(`Running on Port ${PORT}`);

}); 