export class RowAuthorization { // Row Level or Record Level Authorization

  constructor(condition, data){
    this.condition = condition
    this.data = data
    this.dynamicFunction = Parser.getFunction(condition);
  }

  evaluate() {
    //console.log('inside evalute(data)...');
    return this.dynamicFunction();
  }

  userOwnAccounts() {
    //console.log('inside accountsOf()...');
    return true; // just return true, as it is taken care at server side
  }

  userOwnRecord() {
    // console.log(' user id: '+this.data.user_id+'; model owner id: '+this.data.model.owner_id)
    return this.data.user_id === this.data.model.owner_id;
  }

}

class Parser {
  static getFunction(condition) {
    let statement = 'return this.' + condition + '();';
    return new Function(statement);
  }
}
