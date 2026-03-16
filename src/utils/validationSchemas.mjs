export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32
      },
      errorMessage:
        "Username must b at least 5 char with a max of 32 char",

    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: true
  }
};