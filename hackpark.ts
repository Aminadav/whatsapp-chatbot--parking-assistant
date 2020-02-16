var express = require("express")
var request = require("request")
import * as fetch from "node-fetch"
import { URLSearchParams } from "url"
import { Stringify } from "./utils"

var domain = process.env.DOMAIN || "hackparksurgesh"

export var Slots = [
  19,
  212,
  18,
  211,
  17,
  210,
  16,
  209,
  8,
  21,
  9,
  22,
  10,
  23,
  1,
  3,
  2,
  4,
  6,
  5,
]
export function whoSlotBlocks(number) {
  var f = Slots.findIndex((s) => s == number)
  if (f !== null) {
    if (f % 2 == 0) return
    return Slots[f - 1]
  }
}
function sendBlock({ to, from, name }) {
  sendWhatsApp(
    to,
    `${name} (${from} https://api.whatsapp.com/send?phone=${"972" +
      from
        .replace(/-/g, "")
        .replace(/^0/, "")}) is blocking you. We'll notify you when he leaves.`,
  )
}
function sendLeave({ name, to }) {
  sendWhatsApp(
    to,
    `${name} just left. I don't see that someone else is blocking you right now.`,
  )
}

export async function markPark(number, phone, name) {
  var blocks = await getBlocks()
  blocks[number] = { name, phone }
  var blocking = whoSlotBlocks(number)
  if (blocking && blocks[blocking]) {
    console.log("notify", blocks[blocking])
    sendBlock({ to: blocks[blocking].phone, from: phone, name })
  }
  saveBlocks(blocks)
}
export async function unMark(name, phone) {
  var blocks = await getBlocks()
  for (var block in blocks) {
    if (blocks[block].phone == phone) {
      var blocking = whoSlotBlocks(block)
      if (blocking && blocks[blocking]) {
        console.log("notify-leave", blocks[blocking])
        sendLeave({ name, to: blocks[blocking].phone })
      }
      delete blocks[block]
    }
  }
  saveBlocks(blocks)
}
function saveBlocks(blocks) {
  request(
    {
      url:
        "https://eypm-78ba5.firebaseio.com/" +
        domain +
        ".json" +
        "?auth=BogYUOSIxtTbTLdps70iIB7edpdg08SE4rrhm8NB",
      method: "PUT",
      json: blocks,
    },
    (err, obj, body) => {},
  )
}

export async function getBlocks(): Promise<{
  [block: number]: { phone; name }
}> {
  return new Promise((resolve, reject) => {
    var url =
      "https://eypm-78ba5.firebaseio.com/" +
      domain +
      ".json" +
      "?auth=BogYUOSIxtTbTLdps70iIB7edpdg08SE4rrhm8NB"
    request(
      {
        url,
        json: true,
      },
      (err, obj, body) => {
        if (err) {
          reject(err)
        } else {
          resolve(body || {})
        }
      },
    )
  })
}

function JSONRemoveUndefined(obj) {
  //@ts-ignore
  return JSON.parse(JSON.stringify(obj, "\t", 2))
}

export async function sendWhatsApp(to, body, media?) {
  console.log("whatsapp:", { to, body, media })
  var auth =
    "AC434b2daa1511c5845605a7f476ffcd80:twilio_api"
  var sendURL =
    "https://api.twilio.com/2010-04-01/Accounts/AC434b2daa1511c5845605a7f476ffcd80/Messages.json"
  var ans = await fetch(sendURL, {
    headers: {
      Authorization: "Basic " + Buffer.from(auth).toString("base64"),
    },
    method: "POST",
    body: objToFORM(
      JSONRemoveUndefined({
        To: "whatsapp:+972" + to.replace(/-/g, "").replace(/^0/, ""),
        From: "whatsapp:+18454069614",
        Body: body,
        MediaUrl: media,
      }),
    ),
  })
  console.log("-----SEND TO WHATSAPP----")
  console.log(
    objToFORM(
      JSONRemoveUndefined({
        To: "whatsapp:+972" + to.replace(/-/g, "").replace(/^0/, ""),
        From: "whatsapp:+18454069614",
        Body: body,
        MediaUrl: media,
      }),
    ),
  )
  console.log(await ans.json())
}

function objToFORM(obj) {
  const params = new URLSearchParams()
  for (var a in obj) {
    params.append(a, obj[a])
  }
  return params
}
