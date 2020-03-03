export function Stringify(obj) {
  //@ts-ignore
  return JSON.stringify(obj, "\t", 2)
}
export function JSONRemoveUndefined(obj) {
  //@ts-ignore
  return JSON.parse(JSON.stringify(obj, "\t", 2))
}
