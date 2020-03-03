var fs = require("fs")
function tsvJSON(tsv) {
  var lines = tsv.split("\n")

  var result = []

  var headers = lines[0].split("\t")

  for (var i = 1; i < lines.length; i++) {
    var obj = {}
    var currentline = lines[i].split("\t")

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j]
    }

    result.push(obj)
  }

  return result //JavaScript object
}

// export var cars: { [car: number]: { name: string; phone: string } } = {}
// for (var i in people) {
//   var car1 = people[i]["Car ##"]
//   var car2 = people[i]["Car #"]
//   var obj = {
//     name: people[i].Firstname + " " + people[i].Lastname,
//     phone: people[i].Cellphone.replace(/-/g, ""),
//   }
//   if (car1) {
//     car1 = car1.replace(/-/g, "")
//     cars[car1] = obj
//   }
//   if (car2) {
//     car2 = car2.replace(/-/g, "")
//     cars[car2] = obj
//   }
// }

// function findCar(carid) {
//   return cars[carid.replace(/-/g, "")]
// }
export function addPeople({ name, phone }) {
  fs.appendFileSync("./cars.tsv", name + "\t\t" + phone + "\n")
}
export function findPeople(fromWhatsAppSender: string) {
  var tsv = fs
    .readFileSync("./cars.tsv")
    .toString()
    .trim()
  var people: {
    Firstname: string
    Lastname: string
    Cellphone: string
    "Office Phone": string
    "Car #"
    "Car ##"
  }[] = tsvJSON(tsv)

  console.log(
    fromWhatsAppSender.replace(/(whatsapp:)?\+972/g, "0").replace(/[ \-]/g, ""),
  )
  return people.find((p) => {
    if (!p.Cellphone) return false
    return (
      p.Cellphone.replace(/\-/g, "") ==
      fromWhatsAppSender
        .replace(/(whatsapp:)?\+972/g, "0")
        .replace(/[ \-]/g, "")
    )
  })
}
export var whatsAppPhones: { [phone: string]: string } = {}
