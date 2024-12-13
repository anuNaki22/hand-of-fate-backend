class UserTransaction {
    constructor(transaction) {
      this.id = transaction.id
      this.dateTime = transaction.dateTime;
      this.type = transaction.type;
      this.fromTo = transaction.fromTo;
      this.description = transaction.description;
      this.amount = transaction.amount;
      this.user_id = transaction.user_id;
    }
  }

  module.exports = { UserTransaction };