const Joi = require('joi')
const userService = require("../services/users.services");
const { UserResponse } = require('../dto/userResponse');
const { UserTransaction } = require('../dto/userTransaction');
const {
  UserAlreadyExistsError,
  AuthenticationError,
  NotFoundError,
} = require("../dto/customError");

//Joi untuk memvalidasi data berdasarkan input user
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    avatar_url: Joi.string().optional(),
    // balance: Joi.number().required(),
    fullname: Joi.string().required(),
  });

  //memproses request dan response
  const createUser = async (req, res, next) => {
    try {
      const { error, value } = registerSchema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      const user = await userService.createUser(value);
      res.status(200).json({ data: user });
    } catch (error) {
      if (error instanceof UserAlreadyExistsError){
        return res.status(error.statusCode || 500).json({ error: error.message });
      }
      next(error)
    }
  };

const transactionSchema = Joi.object({
    // id: Joi.string().email().required(),
    dateTime: Joi.number().required(),
    type: Joi.string().required(),
    fromTo: Joi.string().optional(),
    description: Joi.string().optional(),
    amount: Joi.number().required(),
    user_id: Joi.number().required(),
  });

  const getTransactionById = async(req, res) => {
    try{
        const{id} = req.user;
        console.log(id)
        const user = await userService.getTransactionById(Number(id))
        res.status(200).json({data: new UserTransaction(transaction)})
    } 
        catch(error){
        res.status(error.statusCode || 500).json({error:error.message})
    }
}

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const login = async (req, res) => {
    try{
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });   
      }
      const token = await userService.login(value);
      res.status(200).json({ data: {token:token} });
    } 
    catch (error) {
      // if(error.message==="404"){
      //   return res.status(404).json({ message: "user doesn't exist" });
      // }
      // if(error.message==="401"){
      //   return res.status(404).json({ message: "email or password not valid" });
      // }
      // res.status(500).json({ error: error.message});
      if (error instanceof AuthenticationError) {
        return res.status(error.status).json({ error: error.message });
      }
      if (error instanceof NotFoundError) {
        return res.status(error.status).json({ error: error.message });
      }
      next(error);
    }
}

const getUserById = async(req, res, next) => {
    try{
        const{id} = req.user;
        console.log(id)
        const user = await userService.getUserById(Number(id))
        res.status(200).json({data: new UserResponse(user)})
    } 
    catch(error){
        if(error instanceof NotFoundError){
          return res.status(error.statusCode || 500).json({error:error.message})
        }
        next(error)
    }
}

  module.exports = { createUser, login, getUserById, getTransactionById };


