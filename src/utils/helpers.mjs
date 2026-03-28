import bcrypt from 'bcrypt';
import passport from 'passport';

const saltRounds = 10;
// we take the argument, let's call password
export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};