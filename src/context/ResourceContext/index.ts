import React from "react";

const ResourceContext = React.createContext({
  userList: [],
  isLoading: "",
  transactionList: [],
  transactionIsLoading: "",
  onDeleteTransaction: (a) => {},
  onClickTransaction: (a) => {},
  showTransactionPopup: false,
  onCancel: () => {},
  addTransactionToDatabase: (a) => {},
  transactionSuccessMssg: false,
  onClickEdit: (a) => {},
  showUpdatePopup: false,
  updateTransacList: [],
  updateTransactionToDatabase: (a) => {},
  imagesUrl: [],
  showSidebar: false,
  onShow: () => {},
  updateSuccessMssg: false
});

export default ResourceContext;
