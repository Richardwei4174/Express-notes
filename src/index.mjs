import express, { request } from "express";
import {query, validationResult, body, matchedData, checkSchema} from "express-validator";
import {createUserValidationSchema} from './utils/validationSchemas.mjs'
const app = express(); // to use express

app.use(express.json())


const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next(); // next means we are done with middleware
}

app.use(loggingMiddleware);

const resolveIndexByUserId = (request, response, next) => {
  const {params: {id},} = request;

  const parsedId = parseInt(id);

  if(isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex( (user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next(); // this mean this middleware is done
};

const PORT = process.env.PORT || 3000;

const mockUsers = [
  {id: 1, username: "anson", displayName: "Anson"},
  {id: 2, username: "bobl", displayName: "Bob2"},
  {id: 3, username: "demonslayer3000", displayName: "Bob3"},
];

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

app.get("/api/users",query('filter').isString().notEmpty(), (request, response)=> {
  const result = validationResult(request);
  console.log(result);
  response.send([
    {id: 1, username: "Richardwei127", displayName: "Richardwei4174"},
    {id: 2, username: "Richardwei1272", displayName: "Richardwei41742"},
  ]);
});

app.post('/api/users',checkSchema(createUserValidationSchema)
  , (request, response) => {
    const result = validationResult(request);
    console.log(result);

    // if result is NOT empty than there must be some errors or problem
    if(!result.isEmpty())
      return response.status(400).send({errors: result.array()});
    const data = matchedData(request);
    console.log(data); 
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data}; // ...body, kinda like just fill in what the data says
  
  mockUsers.push(newUser);
  return response.status(201).send(newUser);

})


app.get("/api/products",(request, response)=>{
  response.send([
    {id: 123, name: 'cucumber', price: "12.99"},
  ]);
});

// all to listen a port for incoming http request
app.listen(PORT, ()=> {
  console.log(`Running on Port ${PORT}`);

}); 

app.get("/api/users/:id",resolveIndexByUserId, (request, response) => {
  const {findUserIndex} = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser){
    return response.sendStatus(404);
  }

  return response.send(findUser);

})

app.put("/api/users/:id",resolveIndexByUserId,  (request, response) => {
  const {body, findUserIndex} = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body}; // kept the id the same
  return response.sendStatus(200);
});


app.patch('/api/users/:id',resolveIndexByUserId ,(request, response) =>{
  const {body, findUserIndex} = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}; // only changes what's in the request which is in body

  return response.sendStatus(200);
});

app.delete("/api/users/:id", (request,resolveIndexByUserId, response) => {

  const {findUserIndex} = request;
  mockUsers.splice(findUserIndex, 1); // we delete the user record with that specific id
  return response.sendStatus(200);

});

