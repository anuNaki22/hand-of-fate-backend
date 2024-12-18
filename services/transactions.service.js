const transactionRepository = require("../repositories/transactions.repository");
const userRepository = require("../repositories/users.repositories");
const { NotFoundError, ValidationError } = require("../dto/customError");

const transfer = async (userId, recipientWalletId, amount, description) => {
  const senderWallet = await userRepository.findWalletByUserId(userId);
  if (!senderWallet) {
    throw new NotFoundError("Wallet not found for the user");
  }

  const recipientWallet = await userRepository.findWalletById(
    recipientWalletId
  );
  if (!recipientWallet) {
    throw new NotFoundError("Recipient wallet not found");
  }

  if (senderWallet.balance < amount) {
    throw new ValidationError("Insufficient balance");
  }

  const transaction = await transactionRepository.transfer({
    senderWalletId: senderWallet.id,
    recipientWalletId: recipientWallet.id,
    amount,
    description,
  });

  return transaction;
};

const topUp = async (userId, amount, description) => {
  const wallet = await userRepository.findWalletByUserId(userId);
  if (!wallet) {
    throw new NotFoundError("Wallet not found for the user");
  }

  const transaction = await transactionRepository.topUp({
    walletId: wallet.id,
    amount,
    description,
  });

  return transaction;
};

const getAllTransactions = async (walletId) => {
  const transactions = await transactionRepository.findAllTransactionsByWalletId(
    walletId
  );
  return transactions;
};

module.exports = { transfer, topUp, getAllTransactions };