import React from "react";
interface transactionType {
  transaction_name?: string
  user_id?:string
  amount: string
  category: string
  id: string
  type: string
  date: string
  transactionName?: string
  userId?: string
}
interface imgUrlsType {
  id: string
  url: string
}
interface userListType {
  name: string
  email: string
  country: string | null
  city: string
  id: number
  dateOfBirth?: string
  date_of_birth?: string
  permanentAddress?: string | null 
  permanent_address?:string | null
  postalCode?: string | null
  postal_code?: string | null
  presentAddress?: string | null
  present_address?: string | null
}

const ResourceContext = React.createContext({
  userList: [] as userListType[],
  isLoading: "",
  transactionList:  [] as transactionType[],
  transactionIsLoading: "",
  onDeleteTransaction: (a: any) => {},
  onClickTransaction: () => {},
  showTransactionPopup: false,
  onCancel: () => {},
  addTransactionToDatabase: (a: any) => {},
  transactionSuccessMssg: false,
  onClickEdit: (a: any) => {},
  showUpdatePopup: false,
  updateTransacList: {} as transactionType,
  updateTransactionToDatabase: (a: any) => {},
  imagesUrl: [] as imgUrlsType[],
  showSidebar: false,
  onShow: () => {},
  updateSuccessMssg: false,
  apiCall: () => {}
});

export default ResourceContext;
