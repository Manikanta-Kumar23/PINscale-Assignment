import React ,{ useState , useEffect , useRef } from "react";

import { TransactionStore , TransactionData } from "../../store";
import useUserId from "../../hooks/useUserId";
import { apiStatus } from "../../constants";
import { OptionsType } from "../../types";
import useDataFetching from "../../hooks/useDataFetching";

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

export const ResourceContext = React.createContext({
  userList: [] as UserListType[],
  isLoading: "",
  transactionIsLoading: "",
  onClickTransaction: () => {},
  showTransactionPopup: false,
  onCancel: () => {},
  onClickEdit: () => {},
  showUpdatePopup: false,
  showSidebar: false,
  onShow: () => {},
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

const ResourceProvider = ({children}: any , props: any) => {
  const [showTransactionPopup , setShowTransactionPopup] = useState(false)
  const [showUpdatePopup , setShowUpdatePopup] = useState(false)
  const [showSidebar , setShowSidebar] = useState(false)
  const [showDeletePopup , setShowDeletePopup] = useState(false)
  const [deleteTransacId , setDeleteTransacId] = useState("")
  const [logoutPopup , setLogoutPopup] = useState(false)
  const [activeTypeId , setActiveTypeId] = useState("ALL TRANSACTIONS")
  const transaction = useRef(new TransactionStore())

  const userId = useUserId()

  const userUrl = "https://bursting-gelding-24.hasura.app/api/rest/profile"
  const transactionsUrl =`https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0`
  let apiOptions: OptionsType = {method: "GET" , headers: {"content-type": "application/json",
  "x-hasura-admin-secret":
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",}}
    if ((userId) !== "3") {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "user",
      "x-hasura-user-id": `${userId}`,}}
    }
    else {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "admin"}}
    }

    const {data: transactionDataList , isLoading: transactionIsLoading , fetchData: transactionDataApi} = useDataFetching()
    const {data: userDataList ,  isLoading , fetchData: userDataApi} = useDataFetching()
    useEffect(() => {
      transactionDataApi(transactionsUrl , apiOptions)
      userDataApi(userUrl, apiOptions)
    } , [])
    const apiCall = () => {
      transactionDataApi(transactionsUrl , apiOptions)
    }
    let list
    if (transactionIsLoading === apiStatus.res) {
    list = transactionDataList.transactions.map((each: TransactionType) => {
        return ({
          transactionName: each.transaction_name , 
          category: each.category ,
          amount: each.amount ,
          id: each.id,
          date: each.date ,
          type: each.type ,
          userId: each.user_id
        })
      })
      list = list.sort((a: any , b: any) => new Date(b.date) < new Date(a.date) ? -1 : 1)

      const data = list.map((each: TransactionType) => new TransactionData(each))
        transaction.current.createTransactionList(data)
    }


    let userList: UserListType[] = []
    if (isLoading === apiStatus.res) {
      userList = userDataList.users.map((each: UserListType) => {
        return {
          name: each.name,
          email: each.email,
          country: each.country,
          city: each.city,
          id: each.id,
          dateOfBirth: each.date_of_birth,
          permanentAddress: each.permanent_address,
          postalCode: each.postal_code,
          presentAddress: each.present_address,
        };
      });
    }

  const onClickTransaction = () => {
    setShowTransactionPopup(true)
};
const onClickDelete = (id: string) => {
  setDeleteTransacId(id)
  setShowDeletePopup(true)
}

const onCancel = () => {
  setShowTransactionPopup(false)
  setShowUpdatePopup(false)
  setShowDeletePopup(false)
  setLogoutPopup(false)
};
const onLogClick = () => {
  setLogoutPopup(true)
}
const logoutPop = () => {
  setLogoutPopup(false)
}

  const onShow = () => {
    setShowSidebar(s  => !s)
};

const onClickEdit = () => {
      setShowUpdatePopup(true)
};

const changeTypeId = (id: string) => {
  setActiveTypeId(id)
};
  return (<ResourceContext.Provider value = {{showTransactionPopup ,
                                              showUpdatePopup,
                                              showSidebar ,
                                              showDeletePopup ,
                                              deleteTransacId ,
                                              logoutPopup  ,
                                              activeTypeId  ,
                                              onClickTransaction ,
                                              onClickDelete ,
                                              onCancel ,
                                              onLogClick  ,
                                              logoutPop ,
                                              onShow ,
                                              onClickEdit ,
                                              changeTypeId ,
                                            transaction ,
                                          apiCall ,
                                          transactionIsLoading  ,
                                          userList ,
                                          isLoading }}>{children}</ResourceContext.Provider>)
}

export default (ResourceProvider);
