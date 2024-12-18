class UserTransaction {
    constructor(transaction) {
      this.id = transaction.id
      this.walled_id = transaction.walled_id;
      this.transaction_type = transaction.transaction_type;
      this.amount = transaction.amount;
      this.recipient_wallet_id = transaction.recipient_wallet_id;
      this.transaction_date = transaction.transaction_date;
      this.description = transaction.description;
    }
  }

  module.exports = { UserTransaction };