/**
 * changes:
 * ask_for_phone event
 * ask_for_name event
 */
import * as _ from "lodash"

// Intertnal
import { DialogFlowProcessor } from "./DialogFlowProcessor"
import { Users } from "./users"
import { markPark, unMark, Slots, getBlocks, sendWhatsApp } from "./hackpark"
import { findPeople, addPeople } from "./cars"

export var HackParkDialogFlow = new DialogFlowProcessor({
  createNewSessionEachTime: true,
  users: new Users(),
  onMessageFromBot: async ({
    action,
    getContextParameter,
    deleteContext,
    addOutputContext,
  }) => {
    var twillioSender = getContextParameter("twilio_sender_id")
    if (twillioSender) {
      var foundedPerson = findPeople(twillioSender)
      if (foundedPerson) {
        var name = foundedPerson.Firstname + " " + foundedPerson.Lastname
        addOutputContext("name", name)
      }
    }
    console.log({ twillioSender })
    // If we not find phone number in the header, ask for phone number
    if (!twillioSender) {
      return {
        // It will fill the "twilio_sender_id"
        event: "ask_for_phone",
      }
    }

    if (action == "add_user") {
      var input_name = getContextParameter("name")
      if (input_name) {
        addPeople({
          name: input_name,
          phone: twillioSender
            .replace(/(whatsapp:)?\+972/, "0")
            .replace(/\-/, ""),
        })
      }
      return {}
    }

    // If we not find a person by his phone, and we're not in
    // Adding user mode (above), redirect to ask_for_name mode
    if (!foundedPerson) {
      return {
        event: "ask_for_name",
      }
    }

    if (action == "input.unknown") {
      // A fall back message
      // If we don't have a name ask for the user name
      return { event: "fallback_without_name" }
    } else if (action == "park") {
      // Someone want to park
      var park_id = getContextParameter("park_id")

      if (park_id) {
        if (!Slots.includes(park_id)) {
          console.log("slot not found")
          deleteContext("park_id")
          return {
            event: "park_again",
          }
        } else {
          return {
            event: "park",
            eventParameters: { park_id },
          }
        }
      }
    } else if (action == "leave") {
      if (true) {
        //is parking
        return { event: "leave" }
      } else {
        // he is not parking
        return { event: "leave_without_register" }
      }
    } else if (action == "car") {
      var car_id = getContextParameter("car_id")
      var who = getContextParameter("who")
      if (who == "") {
        return {
          event: "car",
          eventParameters: { who: "abc", car_id },
        }
      }
    } else if (action == "park_yes") {
      // Now I want to park you
      var park_id = getContextParameter("park_id")
      var person = foundedPerson.Cellphone
      console.log("register", { park_id, name, from: twillioSender, person })
      markPark(park_id, person, name)
    } else if (action == "leave_yes") {
      var park_id = getContextParameter("park_id")
      var person = foundedPerson.Cellphone
      console.log("leave", { park_id, name, from: twillioSender, person })
      unMark(name, person)
    } else if (action == "map") {
      var numbers = _.sortBy(Slots, parseInt)
      _
      var blocks = await getBlocks()
      var str = ""
      for (var i of numbers) {
        str += `*${i}*. ${
          !blocks[i] ? "---" : `${blocks[i].name} (${blocks[i].phone}).`
        }  \n`
      }
      sendWhatsApp(
        twillioSender.replace(/(whatsapp:)?\+972/, "0"),
        "",
        "http://api.screenshotlayer.com/api/capture?access_key=de547abee3abb9d3df2fc763637cac8a&url=https://hackpark.surge.sh%3F=" +
          new Date().valueOf() +
          "&viewport=400x900&width=400",
      )
      return { fulfillmentText: str }
    } else if (action == "where_i_am") {
      return { event: "your_parked_at", eventParameters: { parked_at: "22" } }
    }
    return
  },
})
