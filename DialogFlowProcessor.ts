import * as express from "express"
import * as fetch from "node-fetch"
import {
  DialogFlowWebhook,
  DialogFlowWebhookResponse,
  DialogFlowSendMessageFromUserRequest as DialogFlowWebhookRequest,
  messageToBot,
} from "./external-interfaces"
import { Users } from "./users"
import { JSONRemoveUndefined } from "./utils"

export type onMessageFromBotFunction = (p: {
  action: string
  getContextParameter
  deleteContext
  addOutputContext
}) => Promise<
  | { event: string; eventParameters?: { [name: string]: string } }
  | { fulfillmentText: string }
  | {}
>
type constructorArguments = {
  createNewSessionEachTime?: boolean
  users: Users
  onMessageFromBot: onMessageFromBotFunction
}
export class DialogFlowProcessor {
  private gtoken: { getToken: () => string }
  async getToken() {
    return this.gtoken.getToken()
  }

  private createNewSessionEachTime: boolean
  private users: Users
  private onMessageFromBot: onMessageFromBotFunction

  constructor(options: constructorArguments) {
    options = Object.assign({ createNewSessionEachTime: false }, options)
    this.users = options.users
    this.createNewSessionEachTime = options.createNewSessionEachTime
    this.onMessageFromBot = options.onMessageFromBot
    const { GoogleToken } = require("gtoken")
    this.gtoken = new GoogleToken({
      keyFile: "key.json", // or path to .p12 key file
      scope: ["https://www.googleapis.com/auth/dialogflow"], // or space-delimited string of scopes
    })
  }

  public getMiddleware() {
    return async (req: express.Request, res: express.Response, next) => {
      // Recieved message from processor. Fullfil it.
      // var body: DialogFlowWebhook = req.body
      var body: DialogFlowWebhookRequest = req.body
      var ans = await this.processMessageFromBot(body)
      res.send(ans)
      // res.send("ok")
    }
  }
  /**
   * Get message from Bot and let him know what to do withit
   */
  private async processMessageFromBot(
    param: DialogFlowWebhookRequest, //DialogFlowWebhook,
  ): Promise<DialogFlowWebhookResponse> {
    var action = param.queryResult.action

    var outputContexts = []
    function getContextParameter(name) {
      var contexts = param.queryResult.outputContexts
      if (!contexts) return null
      for (var Ci of contexts) {
        if (!Ci.parameters) continue
        if (Ci.parameters[name] !== undefined) {
          return Ci.parameters[name]
        }
      }
    }
    function deleteContext(name) {
      var contexts = param.queryResult.outputContexts
      for (var Ci of contexts) {
        if (!Ci.parameters) continue
        if (Ci.parameters[name] !== undefined) {
          delete Ci.parameters[name]
          outputContexts.push(Ci)
        }
      }
    }
    function addOutputContext(name, value) {
      outputContexts.push({
        name:
          //@ts-ignore
          param.session + "/" + "contexts/" + name,
        lifespanCount: 10000,
        parameters: {
          [name]: value,
        },
      })
    }
    // console.log(0)
    var value = await this.onMessageFromBot({
      action,
      getContextParameter,
      deleteContext,
      addOutputContext,
    })
    // console.log({ value })
    // console.log({
    //   fulfillmentText:
    //     (<{ fulfillmentText: string }>value).fulfillmentText || "",
    //   followupEventInput: {
    //     name: (<{ event: string }>value).event,
    //     parameters: (<{ eventParameters: { [index: string]: string } }>value)
    //       .eventParameters,
    //     languageCode: "en-US",
    //   },
    //   outputContexts,
    // })
    // this.users.addMessageToDB(from, "agent", param.queryResult.fulfillmentText)
    var ans: DialogFlowWebhookResponse = {
      fulfillmentText: !value
        ? ""
        : (<{ fulfillmentText: string }>value).fulfillmentText,
      followupEventInput: {
        name: !value ? "" : (<{ event: string }>value).event,
        parameters: !value
          ? {}
          : (<{ eventParameters: { [index: string]: string } }>value)
              .eventParameters,
        languageCode: "en-US",
      },
      outputContexts,
    }
    console.log("----RESPONSE---")
    console.log(ans)
    return JSONRemoveUndefined(ans)
  }
}

export interface processMessageParams {
  from: string
  body
}
export type IMessageToUserFromProcessor = {
  body: string
}
