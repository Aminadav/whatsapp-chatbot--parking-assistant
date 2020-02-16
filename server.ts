import * as express from "express"
import * as bodyParser from "body-parser"

import { Stringify } from "./utils"
import { HackParkDialogFlow } from "./hackparkDialogFlow"

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(logger)

app.post("/dialog-flow", HackParkDialogFlow.getMiddleware())
const PORT = 90
app.listen(PORT)
console.log(`Listening to port: ${PORT}`)

function logger(req: express.Request, res, next) {
  console.log("-------New request-------" + new Date())
  console.log(req.method + " " + req.host + " " + req.url)
  console.log(Stringify(req.headers))
  console.log(Stringify(req.body))
  console.log("\n")
  next()
}
