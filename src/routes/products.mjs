import { Router } from "express";

const router = Router();

router.get("/api/products",(request, response)=>{
  console.log(request.headers.cookie);
  console.log(request.cookies);
  if (request.cookies.hello && request.cookies.hello === 'world'){
    return response.send([{id: 123, name: 'cucumber', price: "12.99"},]);
  }
  return response.send({msg: 'Sorry, you need the correct cookie'});
});


export default router;
