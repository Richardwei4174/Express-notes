import express, { request } from "express";
import { mockUsers } from "./utils/constants.mjs";

import routes from "./routes/index.mjs";

const app = express(); // to use express

app.use(express.json())
app.use(routes);


const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next(); // next means we are done with middleware
}

app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;


app.get('/', (request, response)=>{
  console.log(request.query);
  const{ query: {filter, value} } = request;
  
  if (filter && value) return response.send(
    mockUsers.filter( (user) => // no {} else it won't work
      // filter al the filter object that matches value
      user[filter].includes(value)
    )
  )
  // return normal is there's no filter AND value in the route
  return response.send(mockUsers);

});

// all to listen a port for incoming http request
app.listen(PORT, ()=> {
  console.log(`Running on Port ${PORT}`);

}); 
