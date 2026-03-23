import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser( (user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // this unpack who the user is
  try {
    const findUser = mockUsers.find( (user) => user.id === id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err){
    done(err, null);
  }

});

export default passport.use(
  // validate the user, see if user exist and password matches
  new Strategy( (username, password, done) => {
    try{
      const findUser = mockUsers.find( (user) => user.username === username);
      // check to see if user is there
      if (!findUser) throw new Error("User not found");
      // check if password match
      if (findUser.password != password)
        throw new Error("Invalid Credentials");
      done(null, findUser);
    } catch (err){
      done(err, null);
    }
  })
);