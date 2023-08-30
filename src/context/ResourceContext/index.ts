import React from "react";
interface TransactionType {
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
interface ImgUrlsType {
  id: string
  url: string
}
interface UserListType {
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
  userList: [] as UserListType[],
  isLoading: "",
  transactionList:  [] as TransactionType[],
  transactionIsLoading: "",
  onDeleteTransaction: (a: any) => {},
  onClickTransaction: () => {},
  showTransactionPopup: false,
  onCancel: () => {},
  addTransactionToDatabase: (a: any) => {},
  transactionSuccessMssg: false,
  onClickEdit: (a: any) => {},
  showUpdatePopup: false,
  updateTransacList: {} as TransactionType,
  updateTransactionToDatabase: (a: any) => {},
  imagesUrl: [] as ImgUrlsType[],
  showSidebar: false,
  onShow: () => {},
  updateSuccessMssg: false,
  apiCall: () => {},
  showDeletePopup: false,
  onClickDelete: (a: any) => {} ,
  deleteTransacId: "" ,
  logoutPopup: false ,
  onLogClick: () => {}
});

export default ResourceContext;
