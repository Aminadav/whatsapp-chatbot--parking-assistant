/**
 *
 * Plan:
 *
 * Launcher creates:
 * 		twilio-reciever (route)
 * 		DialogFlow-message-proceesing (MessageProcessor)
 * 		dialogflow-reciever	(route)
 * 		twilio-sender
 *
 * On get message
 * TwilioReciever
 * server just forwarding web request
 *
 * twilio-receiver (route) get a request and create a Message.
 * the
 * get the message send it to a dialog-flow
 */

var express = require("express")
var bodyParser = require("body-parser")
const { WebhookClient } = require("dialogflow-fulfillment")
const fetch = require("node-fetch")
function s(obj) {
  return JSON.stringify(obj, "\t", 2)
}
function ss(obj) {
  const params = new URLSearchParams()
  for (var a in obj) {
    params.append(a, obj[a])
  }
  return params
}
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", (req, res, next) => {
  console.log(req.method + " " + req.url)
  console.log(req.headers)
  console.log(s(req.body))
  next()
})

const { URLSearchParams } = require("url")

// https://bots.dialogflow.com/twilio/dfe99202-42af-44ea-a91a-5eccf9fa82ee/sms
app.post("/from-twillio", async (req, res) => {
  res.send("ok")
  var res = await fetch(
    "https://api.twilio.com/2010-04-01/Accounts/AC434b2daa1511c5845605a7f476ffcd80/Messages.json",
    // "https://httpbin.org/post",
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            "AC434b2daa1511c5845605a7f476ffcd80:twilio_api",
          ).toString("base64"),
      },
      method: "POST",
      body: ss({
        To: "whatsapp:972523737233",
        From: "whatsapp:+18454069614",
        Body: "Hello",
      }),
    },
  )
  console.log(await res.text())
})
app.post("/", (req, res) => {
  // const agent = new WebhookClient({ request: req, response: res })
  // let intentMap = new Map()
  // intentMap.set("name", name)
  // agent.handleRequest(name)
  // res.send("ok")

  res.send({
    fulfillmentText: "",
    followupEvent: "we_have_name",
    outputContexts: [
      {
        name:
          "projects/my-reply-yarnbi/agent/sessions/077e6c81-0e89-3b37-4568-71133f8a9605/contexts/name",
        lifespanCount: 2,
        parameters: {
          name: "Rome",
        },
      },
    ],
  })
})
/** @param agent {WebhookClient} */
function name(agent) {
  // agent.
  agent.context.set({ name: "name", lifespan: 2, parameters: { name: "Rome" } })
  // if (
  //   agent.originalRequet &&
  //   agent.originalRequest.data.From == "whatsapp:+972523737233"
  // ) {
  //   // agent.add("Hi Aminadav")
  // }
  agent.add("")
  // agent.setFollowupEvent("we_have_name")
}

const PORT = 90
app.listen(PORT)
console.log("Listening to port: " + PORT)
