import express from "express";

const app = express(); // to use express

const PORT = process.env.PORT || 3000;

// all to listen a port for incoming http request
app.listen(PORT, ()=> {
  console.log(`Running on Port ${PORT}`);


}); 