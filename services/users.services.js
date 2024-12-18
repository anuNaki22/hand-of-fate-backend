// const userRepository = require("../repositories/users.repositories");
// const bcrypt = require('bcrypt');
// const { generateAccessToken } = require("../utils/auth.util");

// // business logic
// const createUser = async (userData) => {
//   let user = await userRepository.findUserByEmail(userData.email);

//   //untuk mengecek apakah array berisi data email atau tidak
//   //jika 1 berarti email sudah didaftarkan
//   if (user.rows.length > 0) {
//     console.log(user)
//     throw new Error("user already exist");
//   }

//   //hashing use genSalt with bcrypt lib
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(userData.password, salt);
//   const hashedData = {...userData, password: hashedPassword}


//   user= await userRepository.createUser(hashedData);
//   return user;
// };

// const login = async (userData) => {
//     let user = await userRepository.findUserByEmail(userData.email);

//     if (user.rows.length === 0){
//         throw new error("user doesn't exist")
//     }
//     const isPasswordMatched = await bcrypt.compare(userData.password, user.rows[0].password)

//     if(!isPasswordMatched){
//         throw new Error(401)
//     }

//     const token =  generateAccessToken({email:userData.email, id: user.rows[0].id});

//     return token;
// }

// const getUserById = async(id) => {
//     let user = await userRepository.findUserById(id)
//     console.log(user)
//     if(!user){
//         throw new Error("User not found")
//     }
//     return user
// }

// module.exports = { createUser, login, getUserById };

const bcrypt = require("bcrypt");
const userRepository = require("../repositories/users.repositories");
const { generateAccessToken } = require("../utils/auth.util");
const {
  UserAlreadyExistsError,
  AuthenticationError,
  NotFoundError,
} = require("../dto/customError");

const createUser = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new UserAlreadyExistsError();
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = { ...userData, password: hashedPassword };

  const createdUser = await userRepository.createUser(newUser);
  return createdUser;
};

const login = async (userData) => {
  const user = await userRepository.findUserByEmail(userData.email);

  if (!user) {
    throw new AuthenticationError();
  }

  const isPasswordMatched = await bcrypt.compare(
    userData.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AuthenticationError();
  }
  const token = generateAccessToken({
    email: user.email,
    id: user.id,
    walletId: user.wallet_id,
  });
  return token;
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return {
    ...user,
    wallet: {
      account_number: user.account_number,
      balance: user.balance,
    },
  };
};

module.exports = { createUser, login, getUserById };