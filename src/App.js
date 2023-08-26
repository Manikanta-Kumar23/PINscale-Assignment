import { useState } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import "./App.css";
import AddTransactions from "./components/AddTransactions";
import UpdateTransactions from "./components/UpdateTransactions";
import useDataFetching from "./hooks/useDataFetching";
import Login from "./components/Login";
import Home from "./components/Home";
import Transactions from "./components/Transactions";
import Profile from "./components/Profile";
import AuthenticateRoute from "./components/AuthenticateRoute";
import NotFound from "./components/NotFound";
import useUserId from "./hooks/useUserId"
import ResourceContext from "./context/ResourceContext";


const apiStatus = {
  res: "SUCCESS",
  rej: "FAIL",
  inProgress: "PENDING",
  initial: "",
};

const imagesUrl = [
  {
    id: "1",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866080/1_lpiuao.jpg",
  },
  {
    id: "2",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/3_qucosn.png",
  },
  {
    id: "3",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/2_eldytb.png",
  },
  {
    id: "4",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/4_rcbfqe.jpg",
  },
  {
    id: "5",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/5_eh0vcd.jpg",
  },
  {
    id: "6",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/6_sjfjgn.png",
  },
  {
    id: "7",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/8_db8inh.png",
  },
  {
    id: "8",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/13_ndiaz0.jpg",
  },
  {
    id: "9",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/7_yl58qh.png",
  },
  {
    id: "10",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/9_jm7jij.png",
  },
  {
    id: "11",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/10_dsqqep.png",
  },
  {
    id: "12",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/15_p6p4f8.jpg",
  },
  {
    id: "13",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/11_ttbomw.jpg",
  },
  {
    id: "14",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/16_plswkt.jpg",
  },
  {
    id: "15",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866079/14_f7spqo.jpg",
  },
  {
    id: "16",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690771289/Group_206_lfmsk4.png",
  },
  {
    id: "17",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866076/12_klifgi.jpg",
  },
];

const  App = () => {
  const userId = useUserId()
  let [transactionList , setTransactionList] = useState([])
  const [showTransactionPopup , setShowTransactionPopup] = useState(false)
  const [transactionSuccessMssg , setTransactionSuccessMssg] = useState(false)
  const [showUpdatePopup , setShowUpdatePopup] = useState(false)
  const [updateTransacList , setUpdateTransacList] = useState([])
  const [showSidebar , setShowSidebar] = useState(false)
  const [updateSuccessMssg , setUpdateSuccessMssg] = useState(false)

  const userUrl = "https://bursting-gelding-24.hasura.app/api/rest/profile"
  const transactionsUrl ="https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0"
  let apiOptions = {method: "GET" , headers: {"content-type": "application/json",
  "x-hasura-admin-secret":
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",}}
    if ((userId) !== "3") {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "user",
      "x-hasura-user-id": `${userId}`,}}
    }
    else {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "admin"}}
    }

    const transactionDataApi = useDataFetching(transactionsUrl , apiOptions)
    const transactionIsLoading = transactionDataApi.isLoading
    if (transactionIsLoading === apiStatus.res) {
      transactionList = transactionDataApi.data.transactions.map((each) => {
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
    }

    const userDataApi = useDataFetching(userUrl, apiOptions)
    const isLoading = userDataApi.isLoading
    let userList = []
    if (isLoading === apiStatus.res) {
      userList = userDataApi.data.users.map((each) => {
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

  const onCancel = () => {
    setUpdateSuccessMssg(false)
    setShowTransactionPopup(false)
    setTransactionSuccessMssg(false)
    setShowUpdatePopup(false)
  };

  const onDeleteTransaction = (data) => {
        setTransactionList(data)
    };

    const onShow = () => {
      setShowSidebar(s  => !s)
  };

  const addTransactionToDatabase = async (data) => {
      setTransactionList((prevList) => {
        return  [
          ...prevList,
          data,
        ]
      })
      setTransactionSuccessMssg(true)
  };

  const updateTransactionToDatabase = async () => {
        setUpdateSuccessMssg(true)
  };

  const onClickEdit = async (updatedList) => {
        setUpdateTransacList(updatedList)
        setShowUpdatePopup(true)
  };

  const updateTransactionNameValue = (value) => {
    const updateTransactionName = value;
    setUpdateTransacList({...updateTransacList , transactionName: updateTransactionName })
  };

  const updateTransactionTypeValue = (value) => {
    const updateTransactionType = value;
    setUpdateTransacList({...updateTransacList , type: updateTransactionType})
  };

  const updateTransactionCategoryValue = (value) => {
    const updateTransactionCategory = value;
    setUpdateTransacList({...updateTransacList , category:updateTransactionCategory})
  };

  const updateTransactionAmountValue = (value) => {
    const updateTransactionAmount = value;
    setUpdateTransacList({...updateTransacList , amount: updateTransactionAmount})
  };

  const updateTransactionDateValue = (value) => {
    const updateTransactionDate = value;
    setUpdateTransacList({...updateTransacList , date: updateTransactionDate})
  };


    return (
      <ResourceContext.Provider
        value={{
          userList,
          isLoading,
          transactionIsLoading,
          showTransactionPopup,
          onClickTransaction: onClickTransaction,
          transactionList,
          onDeleteTransaction: onDeleteTransaction,
          onCancel: onCancel,
          addTransactionToDatabase: addTransactionToDatabase,
          transactionSuccessMssg,
          onClickEdit: onClickEdit,
          showUpdatePopup,
          updateTransacList,
          updateTransactionToDatabase: updateTransactionToDatabase,
          imagesUrl,
          updateTransactionNameValue: updateTransactionNameValue,
          updateTransactionTypeValue: updateTransactionTypeValue,
          updateTransactionCategoryValue: updateTransactionCategoryValue,
          updateTransactionAmountValue: updateTransactionAmountValue,
          updateTransactionDateValue: updateTransactionDateValue,
          updateSuccessMssg,
          showSidebar,
          onShow: onShow,
        }}
      >
        <UpdateTransactions />
        <AddTransactions />
        <Switch>
          <Route exact path="/login" component={Login} />
          <AuthenticateRoute exact path="/" component={Home} />
          <AuthenticateRoute path="/transactions" component={Transactions} />
          <AuthenticateRoute path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </ResourceContext.Provider>
    );
  }

export default withRouter(App);
