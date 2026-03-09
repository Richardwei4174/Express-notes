import express, { request } from "express";

const app = express(); // to use express

app.use(express.json())

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

app.get("/api/users", (request, response)=> {
  response.send([
    {id: 1, username: "Richardwei127", displayname: "Richardwei4174"},
    {id: 2, username: "Richardwei1272", displayname: "Richardwei41742"},
  ]);
});

app.post('/api/users', (request, response) => {
  const {body} = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body}; // ...body, kinda like just fill in what the data says
  
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

app.put("/api/users/:id"), (request, response) => {
  const {body, params: {id}} = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex( (user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);

  mockUsers[findUserIndex] = { id: parsedId, ...body}; // kept the id the same

  return response.sendStatus(200);
}