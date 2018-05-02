export class RowAuthorization { // Row Level or Record Level Authorization
  constructor(condition, data){
    this.condition = condition
    this.data = data
    this.dynamicFunction = Parser.getFunction(condition);
  }
  evaluate() {
    return this.dynamicFunction();
  }
  userOwnAccounts() {
    return true; // just return true, as it is taken care at server side
  }
  userOwnRecord() {
    return this.data.user_id === this.data.model.owner_id;
  }
}

class Parser {
  static getFunction(condition) {
    let statement = 'return this.' + condition + '();';
    return new Function(statement);
  }
}

/**
 * Converts Array into object
 */
export function arrToObj(array) {
  let obj = {}
  if(!array || array.length === 0) {
    return obj
  }
  array.forEach(eachInfo => {
    obj[eachInfo.key] = eachInfo.value
  })
  return obj
}

/**
 * Converts Object to Array
 */
export function objToArr(obj) {
   let arr = []
   let val;
   Object.keys(obj).forEach(key => {
     val = obj[key]
     arr.push({key: key, value: val})
   })
   return arr
 }
