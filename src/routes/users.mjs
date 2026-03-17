import {response, Router} from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import {mockUsers} from "../utils/constants.mjs"
import {createUserValidationSchema} from "../utils/validationSchemas.mjs";
import {resolveIndexByUserId} from "../utils/middlewares.mjs";

"express-validator";

const router = Router();

router.get("/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({min: 3, max:10})
    .withMessage("Must be at least 3-10 char"),
    (request, response) => {
      const result = validationResult(request);
      console.log(result);
      const {
        query: {filter, value },
      } = request;
      if (filter && value)
        return response.send(
          mockUsers.filter( (user) => user[filter].includes(value))
        );
      return response.send(mockUsers);  
    }
);
router.get("/api/users/:id",resolveIndexByUserId, (request, response) => {
  const {findUserIndex} = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser){
    return response.sendStatus(404);
  }

  return response.send(findUser);

})



router.post('/api/users',checkSchema(createUserValidationSchema)
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

});

router.put("/api/users/:id",resolveIndexByUserId,  (request, response) => {
  const {body, findUserIndex} = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body}; // kept the id the same
  return response.sendStatus(200);
});


router.patch('/api/users/:id',resolveIndexByUserId ,(request, response) =>{
  const {body, findUserIndex} = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}; // only changes what's in the request which is in body

  return response.sendStatus(200);
});

router.delete("/api/users/:id", (request,resolveIndexByUserId, response) => {

  const {findUserIndex} = request;
  mockUsers.splice(findUserIndex, 1); // we delete the user record with that specific id
  return response.sendStatus(200);

});

export default router;