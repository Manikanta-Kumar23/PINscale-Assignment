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

interface StoreType {
  transactionList: TransactionType[]
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

const transaction: any = class{}

const ResourceContext = React.createContext({
  userList: [] as UserListType[],
  isLoading: "",
  transactionIsLoading: "",
  store: {} as StoreType,
  onDeleteTransaction: (a: any) => {},
  onClickTransaction: () => {},
  showTransactionPopup: false,
  onCancel: () => {},
  addTransactionToDatabase: () => {},
  transactionSuccessMssg: false,
  onClickEdit: (a: any) => {},
  showUpdatePopup: false,
  updateTransacList: {} as TransactionType,
  updateTransactionToDatabase: () => {},
  imagesUrl: [] as ImgUrlsType[],
  showSidebar: false,
  onShow: () => {},
  updateSuccessMssg: false,
  apiCall: () => {},
  showDeletePopup: false,
  onClickDelete: (a: any) => {} ,
  deleteTransacId: "" ,
  logoutPopup: false ,
  onLogClick: () => {} ,
  logoutPop: () => {},
  transaction,
  changeTypeId: (a: string) => {} ,
  activeTypeId: "" as string
});

export default ResourceContext;
