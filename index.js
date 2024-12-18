//require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const port = 8080
const userRouter = require("./routers/users.routers");
const transactionRouter = require("./routers/transactions.router");
const globalErrorHandler = require("./middlewares/error.middleware");

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//tambahin routernya disini
app.use(userRouter)
app.use(transactionRouter);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})