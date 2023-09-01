import { useEffect, useState } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { useLocalObservable } from "mobx-react-lite";
import { makeAutoObservable, observable , action } from "mobx";


import "./App.css";
import AddTransactions from "./components/AddTransactions";
import UpdateTransactions from "./components/UpdateTransactions";
import DeleteTransaction from "./components/DeleteTransactions";
import useDataFetching from "./hooks/useDataFetching";
import Login from "./components/Login";
import Home from "./components/Home";
import Transactions from "./components/Transactions";
import Profile from "./components/Profile";
import AuthenticateRoute from "./components/AuthenticateRoute";
import NotFound from "./components/NotFound";
import useUserId from "./hooks/useUserId"
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import ResourceContext from "./context/ResourceContext";
import { OptionsType} from "./types"
import { apiStatus, imagesUrl } from "./constants";


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

class TransactionStore {
  transactionList: TransactionType[] = []
  
  constructor() {
    makeAutoObservable(this , {
      transactionList: observable,
      createTransactionList: action,
      updateTransactionList: action,
      deleteTransactionList: action,
      addTransactionList: action

    })
  }

  createTransactionList (data: TransactionType[]) {
    this.transactionList = [...data]
  }
  addTransactionList (data: TransactionType) {
    this.transactionList.push(data)
  }
  updateTransactionList (data: TransactionType) {
    const index = this.transactionList.findIndex((each) => each.id === data.id)
    this.transactionList[index] = data
  }
  deleteTransactionList (data: TransactionType) {
    this.transactionList.push(data)
  }
}

const  App = (props: any) => {
  const userId = useUserId()
  const [showTransactionPopup , setShowTransactionPopup] = useState(false)
  const [transactionSuccessMssg , setTransactionSuccessMssg] = useState(false)
  const [showUpdatePopup , setShowUpdatePopup] = useState(false)
  const [updateTransacList , setUpdateTransacList] = useState({} as TransactionType)
  const [showSidebar , setShowSidebar] = useState(false)
  const [updateSuccessMssg , setUpdateSuccessMssg] = useState(false)
  const [showDeletePopup , setShowDeletePopup] = useState(false)
  const [deleteTransacId , setDeleteTransacId] = useState("")
  const [logoutPopup , setLogoutPopup] = useState(false)
  const [activeTypeId , setActiveTypeId] = useState("ALL TRANSACTIONS")
  const transaction = useLocalObservable(() => new TransactionStore())
  const {location} = props

  const store = useLocalObservable(() => ({
    transactionList: [] as TransactionType[],
    addTransactionToDatabase: () => {}
  }))

  let limit = 3
  if (location.pathname === "/transactions") {
    limit = 100
  }

  const userUrl = "https://bursting-gelding-24.hasura.app/api/rest/profile"
  const transactionsUrl =`https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=${limit}&offset=0`
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
    if (transactionIsLoading === apiStatus.res) {
      store.transactionList = transactionDataList.transactions.map((each: TransactionType) => {
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
      const list = transactionDataList.transactions.map((each: TransactionType) => {
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
      transaction.createTransactionList(list)
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
    setUpdateSuccessMssg(false)
    setShowTransactionPopup(false)
    setTransactionSuccessMssg(false)
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

  const onDeleteTransaction = (data: TransactionType[]) => {
        store.transactionList = data
    };

    const onShow = () => {
      setShowSidebar(s  => !s)
  };

  const addTransactionToDatabase = () => {
      setTransactionSuccessMssg(true)
  };

  const updateTransactionToDatabase = () => {
        setUpdateSuccessMssg(true)
  };

  const onClickEdit = async (updatedList: TransactionType) => {
        setUpdateTransacList(updatedList)
        setShowUpdatePopup(true)
  };

  const changeTypeId = (id: string) => {
    setActiveTypeId(id)
};

    return (
      <ResourceContext.Provider
        value={{
          userList,
          isLoading,
          transactionIsLoading,
          showTransactionPopup,
          onClickTransaction: onClickTransaction,
          store,
          onDeleteTransaction: onDeleteTransaction,
          onCancel: onCancel,
          addTransactionToDatabase: addTransactionToDatabase,
          transactionSuccessMssg,
          onClickEdit: onClickEdit,
          showUpdatePopup,
          updateTransacList,
          updateTransactionToDatabase: updateTransactionToDatabase,
          imagesUrl,
          updateSuccessMssg,
          showSidebar,
          onShow: onShow,
          apiCall: apiCall,
          showDeletePopup,
          onClickDelete ,
          deleteTransacId , 
          logoutPopup ,
          onLogClick ,
          logoutPop ,
          transaction ,
          changeTypeId,
          activeTypeId
        }}
      >
        <UpdateTransactions />
        <AddTransactions />
        <DeleteTransaction />
        <Switch>
        <Route exact path="/login" component={Login} />
        <div className="home-bg">
          <SideBar />
          <div className="home-content">
            <Navbar />
            <div className="main-content">
              <AuthenticateRoute exact path="/" component={Home} />
              <AuthenticateRoute path="/transactions" component={Transactions} />
              <AuthenticateRoute path="/profile" component={Profile} />
            </div>
        </div>
      </div>
          <Route component={NotFound} />
        </Switch>
      </ResourceContext.Provider>
    );
  }

export default withRouter(App);
