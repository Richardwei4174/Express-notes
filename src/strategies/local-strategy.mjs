import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser( (user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  // this unpack who the user is
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err){
    done(err, null);
  }

});

export default passport.use(
  // validate the user, see if user exist and password matches
  new Strategy(async (username, password, done) => {
    try{
      const findUser = await User.findOne({username});
      if (!findUser) throw new Error("User not found");

      if (findUser.password !== password) throw new Error("Bad Credentials");
      done(null, findUser);
    } catch (err){
      done(err, null);
    }
  })
);