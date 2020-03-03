import * as express from "express"
import * as fetch from "node-fetch"

import { URLSearchParams } from "url"
import {
  IMessageProcessor,
  IMessageToUserFromProcessor,
} from "./DialogFlowProcessor"

import { ITwilioWhatsAppMessageReceived } from "./external-interfaces"

export interface ISendToUserParamters {
  from: string
  to: string
  body: string
}

export function assertIfInvalidWhatsAppNumber(number: string) {
  /** Examples: whatsapp:972523737233, whatsapp:+18454069614 */
  const WhatsAppNumber = RegExp(/^whatsapp:\+?[0-9]+$/)
  console.assert(number.match(WhatsAppNumber))
}

/** Reciver messasges from users. */
export interface IFrontBot {}

export class TwilioFrontBot implements IFrontBot {
  private serverNumber = "whatsapp:+18454069614"
  private sendURL =
    "https://api.twilio.com/2010-04-01/Accounts/AC434b2daa1511c5845605a7f476ffcd80/Messages.json"
  // "https://httpbin.org/post"
  private auth =
    "AC434b2daa1511c5845605a7f476ffcd80:twilio_api"
  constructor(public messageProcessor: IMessageProcessor) {}
  /**
   * Must be called after using body parser (json and urlencoded)
   */
  public getMiddleware() {
    return async (req: express.Request, res: express.Response, next) => {
      console.log("you got message from twillio!")
      var twilioRequest: ITwilioWhatsAppMessageReceived = req.body
      let ans: IMessageToUserFromProcessor
      var phone = twilioRequest.From.replace(/whatsapp:/, "")
      try {
        ans = await this.messageProcessor.processMessageFromFrontend({
          from: phone,
          body: twilioRequest.Body,
        })
      } catch {
        ans = {
          body: "cannot process message",
        }
      }
      console.log({ ans })
      await this.sendMessageToUser({
        from: this.serverNumber,
        to: "whatsapp:" + phone,
        body: ans.body,
      })
      res.send("ok")
    }
  }
  public async sendMessageToUser({ from, to, body }: ISendToUserParamters) {
    console.log(0)
    assertIfInvalidWhatsAppNumber(from)
    console.log(1)
    assertIfInvalidWhatsAppNumber(to)
    console.log(2)
    var ans = await fetch(this.sendURL, {
      headers: {
        Authorization: "Basic " + Buffer.from(this.auth).toString("base64"),
      },
      method: "POST",
      body: this.objToFORM({
        To: to,
        From: from,
        Body: body,
      }),
    })
    console.log(await ans.json())
    console.log(3)
  }
  public objToFORM(obj) {
    const params = new URLSearchParams()
    for (var a in obj) {
      params.append(a, obj[a])
    }
    return params
  }
}
