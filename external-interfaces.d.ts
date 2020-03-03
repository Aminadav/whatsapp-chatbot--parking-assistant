export type DialogFlowSendMessageFromUserRequest = {
  responseId: string
  queryResult: {
    queryText: string
    action: string
    parameters: { park_id: 234; name: "" }
    fulfillmentText: string
    fulfillmentMessages: [[Object]]
    outputContexts: {
      name: string //"projects/my-reply-yarnbi/agent/sessions/077e6c81-0e89-3b37-4568-71133f8a9605/contexts/name"
      lifespanCount: number
      parameters: any // {name:'hi'}
    }[]

    intent: {
      name: "projects/my-reply-yarnbi/agent/intents/a79e8f63-be27-4106-b961-7ab86683e34b"
      displayName: string
    }
    intentDetectionConfidence: number // 0.79
    languageCode: string
  }
}
export interface messageToBot {
  queryInput:
    | {
        text: {
          text: "abc"
          languageCode: "en"
        }
      }
    | {
        event: {
          name: "abc"
          languageCode: "en"
        }
      }
  queryParams?: {
    contexts: {
      name: string //"projects/my-reply-yarnbi/agent/sessions/077e6c81-0e/contexts/jscontext"
      parameters: {
        [key: string]: string
      }
      lifespanCount: number
    }[]
  }
}
export type DialogFlowWebhookResponse = {
  fulfillmentText: string
  followupEventInput?: {
    name?: string
    parameters?: { [index: string]: string }
    languageCode: "en-US"
  }
  outputContexts?: {
    /** e.g: "projects/my-reply-yarnbi/agent/sessions/077e6c81-0e89-3b37-4568-71133f8a9605/contexts/name" */
    name: string
    lifespanCount: number
    parameters: { [index: string]: string | number }
  }[]
}
export type ITwilioWhatsAppMessageReceived = {
  /** E.g: "SM4a159642cbbe22c89fdb6b8a525f86a0" */
  SmsMessageSid: string
  /** E.g: "0" */
  NumMedia: string
  /** E.g: "SM4a159642cbbe22c89fdb6b8a525f86a0" */
  SmsSid: string
  /** E.g: "received" */
  SmsStatus: string
  /** E.g: "Ass" */
  Body: string
  /** E.g: "whatsapp:+18454069614" */
  To: string
  /** E.g: "1" */
  NumSegments: string
  /** E.g: "SM4a159642cbbe22c89fdb6b8a525f86a0" */
  MessageSid: string
  /** E.g: "AC434b2daa1511c5845605a7f476ffcd80" */
  AccountSid: string
  /** E.g: "whatsapp:+972523737233" */
  From: string
  /** E.g: "2010-04-01" */
  ApiVersion: string
}
export type DialogFlowWebhook = {
  /** e.g: "cc29a123-0a7a-4a6c-9b8d-0be24414d685" */
  id: string
  /** e.g: "2019-06-11T20:26:59.777Z" */
  timestamp: string
  /** e.g: "en" */
  lang: string
  result: {
    /** e.g: "agent" */
    source: string
    /** e.g: "again" */
    resolvedQuery: string
    /** e.g: "" */
    speech: string
    /** e.g: "" */
    action: string
    actionIncomplete: boolean
    parameters: {
      /** e.g: "" */
      park_id: string
    }
    contexts: [
      {
        /** e.g: "i'm_parking_at_222_dialog_params_park_id" */
        name: string
        parameters: {
          /** e.g: "" */
          park_id: string
          /** e.g: "park_id.original": "" */
          string
        }
        lifespan: 1
      },
      {
        /** e.g: "i'm_parking_at_222_dialog_context" */
        name: string
        parameters: {
          /** e.g: "" */
          park_id: string
          /** e.g: "park_id.original": "" */
        }
        lifespan: 2
      },
      {
        /** e.g: "a79e8f63-be27-4106-b961-7ab86683e34b_id_dialog_context" */
        name: string
        parameters: {
          /** e.g: "" */
          park_id: string
          /** e.g: "park_id.original": "" */
        }
        lifespan: number
      }
    ]
    metadata: {
      /** e.g: "a79e8f63-be27-4106-b961-7ab86683e34b" */
      intentId: string
      /** e.g: "true" */
      webhookUsed: string
      /** e.g: "true" */
      webhookForSlotFillingUsed: string
      /** e.g: "false" */
      isFallbackIntent: string
      /** e.g: "I'm parking at 222" */
      intentName: string
    }
    fulfillment: {
      /** e.g: "What is your parking ID?" */
      speech: string
      messages: [
        {
          type: number
          /** e.g: "What is your parking ID?" */
          speech: string
        }
      ]
    }
    score: number
  }
  status: {
    code: 200
    /** e.g: "success" */
    errorType: string
  }
  /** e.g: "077e6c81-0e89-3b37-4568-71133f8a9605" */
  sessionId: string
}
