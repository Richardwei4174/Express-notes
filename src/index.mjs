import express, { request, response } from "express";
import { mockUsers } from "./utils/constants.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";

const app = express(); // to use express

mongoose.connect("mongodb://127.0.0.1:27017/testdb")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));


app.use(express.json())
app.use(cookieParser());
app.use(session({
  secret: "richard the dev",
  saveUninitialized: false,
  resave:false,
  cookie: {
    maxAge: 60000 * 60,
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);


const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next(); // next means we are done with middleware
}

app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;


app.get('/', (request, response)=>{
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true; // will use the same session id instead of constantly generate a new id so we can track the user
  response.cookie('hello', 'world', {maxAge: 10000});

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

app.post('/api/auth', (request, response) => {
  const {body: {username, password}}  = request;

  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password) return response.status(401);

  request.session.user = findUser;
  return response.status(200).send(findUser);

});


app.get('/api/auth/status', (request, response) => {
  request.sessionStore.get(request, sessionID, (err, session) => {
    console.log(session);
  });
  return request.session.user 
  ? response.status(200).send(request.session.user)
  : response.status(400).send({msg: "Not Authenticated"});
});

app.post('/api/cart', (request, response) => {
  if (!request.session.user) return response.sendStatus(401);

  const {body:item} = request;

  const {cart} =  request.session;
  if (cart){
    cart.push(item);
  } else {
    request.session.cart = [iteam];
    return response.sendStatus(201).send(item);
  }
});

app.get('/api/cart', (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.sessionID.cart ?? []);
});

app.post(
  '/api/auth',
  passport.authenticate("local"),
  (request, response) => {
    response.send(request);
  }
);

app.get('/api/auth/status', (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);
  if (request.user) return response.send(request.user);
  return response.sendStatus(401);
})

app.post("/api/auth/logout" , (request, response)=> {
  if (!request.user) return response.sendStatus(401);
  request.logOut( (err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  }); 
});