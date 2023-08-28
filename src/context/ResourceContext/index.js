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
  addTransactionToDatabase: () => {},
  transactionSuccessMssg: "",
  onClickEdit: () => {},
  showUpdatePopup: "",
  updateTransacList: [],
  updateTransactionToDatabase: () => {},
  imagesUrl: [],
  updateTransactionNameValue: () => {},
  updateTransactionTypeValue: () => {},
  updateTransactionCategoryValue: () => {},
  updateTransactionAmountValue: () => {},
  updateTransactionDateValue: () => {},
  updateSuccessMssg: "",
  showSidebar: "",
  onShow: () => {},
  allTransaction: () => {},
});

export default ResourceContext;
