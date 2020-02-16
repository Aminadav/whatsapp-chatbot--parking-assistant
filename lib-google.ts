const { JWT } = require("google-auth-library")
const keys = require("./key.json")
async function main() {
  console.log(0)
  const client = new JWT(keys.client_email, null, keys.private_key, [
    "https://www.googleapis.com/auth/dialogflow",
  ])
  const url = `https://www.googleapis.com/dns/v1/projects/${keys.project_id}`
  for (var i in client) {
    console.log(typeof client[i], "  ---", i)
  }
  console.log(client.gtoken)
  console.log(1)
  return
  const res = await client.request({ url })
  console.log(res.data)
}

async function main2() {
  const { GoogleToken } = require("gtoken")
  const gtoken = new GoogleToken({
    keyFile: "key.json", // or path to .p12 key file
    scope: ["https://www.googleapis.com/auth/dialogflow"], // or space-delimited string of scopes
  })

  await console.log(await gtoken.getToken())
  await console.log(await gtoken.getToken())
}
main2().catch(console.error)
