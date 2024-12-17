//require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const port = 8080
const userRouter = require("./routers/users.routers");

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})