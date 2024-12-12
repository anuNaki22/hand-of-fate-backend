const userRepository = require("../repositories/users.repositories");
const bcrypt = require('bcrypt');
const { generateAccessToken } = require("../utils/auth.util");

// business logic
const createUser = async (userData) => {
  let user = await userRepository.findUserByEmail(userData.email);

  //untuk mengecek apakah array berisi data email atau tidak
  //jika 1 berarti email sudah didaftarkan
  if (user.rows.length > 0) {
    console.log(user)
    throw new Error("user already exist");
  }

  //hashing use genSalt with bcrypt lib
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  const hashedData = {...userData, password: hashedPassword}


  user= await userRepository.createUser(hashedData);
  return user;
};

const login = async (userData) => {
    let user = await userRepository.findUserByEmail(userData.email);

    if (user.rows.length === 0){
        throw new error("user doesn't exist")
    }
    const isPasswordMatched = await bcrypt.compare(userData.password, user.rows[0].password)

    if(!isPasswordMatched){
        throw new Error(401)
    }

    const token =  generateAccessToken({username:userData.email});

    return token;
}

module.exports = { createUser, login };