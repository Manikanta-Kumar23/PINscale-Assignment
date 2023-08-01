import React from "react";

const ResourceContext = React.createContext({
  userList: [],
  isLoading: "",
  transactionList: [],
  transactionIsLoading: "",
  onDeleteTransaction: () => {},
  onClickTransaction: () => {},
  showTransactionPopup: "",
  onCancel: () => {},
  onAddTransaction: () => {},
  transactionSuccessMssg: "",
  onClickEdit: () => {},
  showUpdatePopup: "",
  updateTransacList: [],
  onUpdateTransaction: () => {},
  imagesUrl: [],
  updateTransactionName: "",
  updateTransactionType: "",
  updateTransactionCategory: "",
  updateTransactionAmount: "",
  updateTransactionDate: "",
  updateTransactionNameValue: () => {},
  updateTransactionTypeValue: () => {},
  updateTransactionCategoryValue: () => {},
  updateTransactionAmountValue: () => {},
  updateTransactionDateValue: () => {},
  updateSuccessMssg: "",
  showSidebar: "",
  onShow: () => {},
});

export default ResourceContext;
