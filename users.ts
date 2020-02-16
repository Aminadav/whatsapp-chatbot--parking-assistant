import * as fs from "fs"
import { Stringify } from "./utils"
class DB {
  save(type, key, value) {
    var data = {}
    try {
      data = JSON.parse(fs.readFileSync(type + ".json").toString())
    } catch {
      data = {}
    }
    data[key] = value
    fs.writeFileSync(type + ".json", Stringify(data))
  }
  push(type, key, value) {
    var data = {}
    try {
      data = JSON.parse(fs.readFileSync(type + ".json").toString())
    } catch {
      data = {}
    }
    data[key] = data[key] || []
    data[key].push(value)
    fs.writeFileSync(type + ".json", Stringify(data))
    return
  }
  load(type, key) {
    var data
    try {
      data = JSON.parse(fs.readFileSync(type + ".json").toString())
    } catch {
      data = {}
    }
    return data[key]
  }
}
export class Users {
  db = new DB()
  isNoMessagesYetFromUser(from): boolean {
    return true
  }
  addMessageToDB(user, botOrAgent: "user" | "agent", message) {
    this.db.push(
      "messagaes",
      user,
      new Date() + "\t" + botOrAgent + ": " + message,
    )
    //process.exit()
  }
}
