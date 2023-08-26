import { useState } from "react";

import AddTransactions from "./components/AddTransactions";

import UpdateTransactions from "./components/UpdateTransactions";

import { Switch, Route, withRouter } from "react-router-dom";

import { format, parse, parseISO } from "date-fns";

import useDataFetching from "./components/DataFetching";

import Login from "./components/Login";

import Home from "./components/Home";

import Transactions from "./components/Transactions";

import Profile from "./components/Profile";

import AuthenticateRoute from "./components/AuthenticateRoute";

import ResourceContext from "./context/ResourceContext";

import NotFound from "./components/NotFound";

import useUserId from "./components/UserId"

import "./App.css";

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
  const [updateTransactionName , setUpdateTransactionName] = useState("")
  const [updateTransactionType , setUpdateTransactionType] = useState("")
  const [updateTransactionCategory , setUpdateTransactionCategory] = useState("")
  const [updateTransactionAmount , setUpdateTransactionAmount] = useState("")
  const [updateTransactionDate , setUpdateTransactionDate] = useState("")

  const apiUrls = [{userUrl: "https://bursting-gelding-24.hasura.app/api/rest/profile"} , {transactionsUrl:"https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0"}]
  let apiOptions = {method: "GET" , headers: {"content-type": "application/json",
  "x-hasura-admin-secret":
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",}}
    if (parseInt(userId) !== 3) {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "user",
      "x-hasura-user-id": `${userId}`,}}
    }
    else {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "admin"}}
    }

    const transactionDataApi = useDataFetching(apiUrls[1].transactionsUrl , apiOptions)
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

    const userDataApi = useDataFetching(apiUrls[0].userUrl, apiOptions)
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

  const onDeleteTransaction = async (id) => {
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
    };
    const url = `https://bursting-gelding-24.hasura.app/api/rest/delete-transaction?id=${id}`;
      const res = await fetch(url, options);
      const data = await res.json();
      if (res.ok) {
        const trnsacId = data.delete_transactions_by_pk.id;
        const updateList = transactionList.filter((each) => each.id !== trnsacId);
          setTransactionList(updateList)
      }
    };

    const onShow = () => {
      setShowSidebar(s  => !s)
  };

  const addTransactionToDatabase = async (data) => {
    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/add-transaction";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
      body: JSON.stringify(data),
    };
    const res = await fetch(url, options);
    const updateData = await res.json();
      setTransactionList((prevList) => {
        return  [
          ...prevList,
          updateData.insert_transactions_one,
        ]
      })
      setTransactionSuccessMssg(true)
  };

  const updateTransactionToDatabase = async (info) => {
    const url =
      "https://bursting-gelding-24.hasura.app/api/rest/update-transaction";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
      body: JSON.stringify(info),
    };
    const res = await fetch(url, options);
    if (res.ok) {
        setUpdateSuccessMssg(true)
    }
  };

  const onAddTransaction = (name, type, category, amount, date) => {
    if (
      name !== "" &&
      type !== "" &&
      category !== "" &&
      amount !== "" &&
      date !== ""
    ) {
      let formatDate;
      if (date !== "") {
        const parsedDate = parse(date, "yyyy-MM-dd", new Date());
        formatDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
      }
      const updateData = {
        name,
        type,
        category,
        amount,
        date: formatDate,
        user_id: userId,
      };

      addTransactionToDatabase(updateData);
    } else {
      alert("All Input Fields are required?");
    }
  };

  const onClickEdit = async (id) => {
    const url = `https://bursting-gelding-24.hasura.app/api/rest/delete-transaction?id=${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
    };
    const res = await fetch(url, options);
    const data = await res.json();
    if (res.ok) {
      const updateList = transactionList.filter(
        (each) => each.id === data.delete_transactions_by_pk.id
      );
      const { transactionName, type, category, amount, date } = updateList[0];
      const formatDate = format(parseISO(date), "yyyy-MM-dd");
        setUpdateTransacList(updateList[0])
        setShowUpdatePopup(true)
        setUpdateTransactionName(transactionName)
        setUpdateTransactionType(type)
        setUpdateTransactionCategory(category)
        setUpdateTransactionAmount(amount)
        setUpdateTransactionDate(formatDate)
    }
  };

  const updateTransactionNameValue = (value) => {
    const updateTransactionName = value;
      setUpdateTransactionName(updateTransactionName)
  };

  const updateTransactionTypeValue = (value) => {
    const updateTransactionType = value;
      setUpdateTransactionType(updateTransactionType)
  };

  const updateTransactionCategoryValue = (value) => {
    const updateTransactionCategory = value;
      setUpdateTransactionCategory(updateTransactionCategory)
  };

  const updateTransactionAmountValue = (value) => {
    const updateTransactionAmount = value;
      setUpdateTransactionAmount(updateTransactionAmount)
  };

  const updateTransactionDateValue = (value) => {
    const updateTransactionDate = value;
      setUpdateTransactionDate(updateTransactionDate)
  };

  const onUpdateTransaction = (name, type, category, amount, date) => {
    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    const formatDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
    const updateData = {
      id: updateTransacList.id,
      name,
      type,
      category,
      amount,
      date: formatDate,
    };
    updateTransactionToDatabase(updateData);
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
          onAddTransaction: onAddTransaction,
          transactionSuccessMssg,
          onClickEdit: onClickEdit,
          showUpdatePopup,
          updateTransacList,
          onUpdateTransaction: onUpdateTransaction,
          imagesUrl,
          updateTransactionName,
          updateTransactionType,
          updateTransactionCategory,
          updateTransactionAmount,
          updateTransactionDate,
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
