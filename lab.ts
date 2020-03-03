import { DialogFlowProcessor } from "./DialogFlowProcessor"
import { Users } from "./users"
import { getBlocks, whoSlotBlocks, sendWhatsApp } from "./hackpark"
import { HackParkDialogFlow } from "./hackparkDialogFlow"

// DO THE NOTIFICATIONS!
// DO THE TEXTS!
// INFO ABOUT CARS

// He is from twillio
async function story0() {
  var s = new Session("whatsapp:+972523737233")
  // await s.ask("hi - I want to park")
  await s.ask("map")
}

/**
 * User want to car -id
 */
async function story3() {
  var s = new Session((Math.random() * 100000).toFixed(0))
  await s.ask("hi - I want to park")
  await s.ask("28-115-60")
  // Look like a car number. Car belongs to:
  // This car number (2811560) is not in the database.
}
/**
 * Somone blocking someone.
 */
async function story4() {
  var s1 = new Session((Math.random() * 100000).toFixed(0))
  var s2 = new Session((Math.random() * 100000).toFixed(0))
  await s1.ask("hi - I want to park")
  await s1.ask("Moshe")
  await s1.ask("10")
  await s1.ask("yes")
  await s2.ask("hi - I want to park")
  await s2.ask("Moshe")
  await s2.ask("23")
  await s2.ask("yes")
  // s1 should be notified.
  await s2.ask("leave")
  // s1 should be notified.
}
/**
 * A map who is parking where
 */
async function story5() {
  var s1 = new Session((Math.random() * 100000).toFixed(0))
  var s2 = new Session((Math.random() * 100000).toFixed(0))
  await s1.ask("hi - I want to park")
  await s1.ask("Moshe")
  await s1.ask("599")
  await s1.ask("yes")
  await s2.ask("let me know who is parking where?")
}

class Session {
  constructor(private user) {}
  async ask(body: string) {
    console.log("User: ", body)
    var ans = await HackParkDialogFlow.processMessageFromFrontend({
      body,
      from: this.user,
    })
    console.log("Agent: ", ans.body)
  }
}

function story9() {
  sendWhatsApp("052-8447127", "it's me aminadav")
}
story0()
