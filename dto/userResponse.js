// DTO
class UserResponse {
    constructor(user) {
      this.id = user.id
      this.username = user.username;
      this.fullname = user.fullname;
      this.email = user.email;
      this.avatar_url = user.avatar_url;
      if (user.wallet) {
        this.wallet = {
          account_number: user.wallet.account_number,
          balance: user.wallet.balance,
        };
      }
      // this.balance = user.balance;
    }
  }

  module.exports = { UserResponse };