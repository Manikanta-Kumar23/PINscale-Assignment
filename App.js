import { Component } from "react";

import AddTransactions from "./components/AddTransactions";

import UpdateTransactions from "./components/UpdateTransactions";

import { Switch, Route, withRouter } from "react-router-dom";

import { format, parse, parseISO } from "date-fns";

import Login from "./components/Login";

import Home from "./components/Home";

import Transactions from "./components/Transactions";

import Cookies from "js-cookie";

import Profile from "./components/Profile";

import AuthenticateRoute from "./components/AuthenticateRoute";

import ResourceContext from "./context/ResourceContext";

import NotFound from "./components/NotFound";

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

class App extends Component {
  state = {
    isLoading: apiStatus.initial,
    userList: [],
    transactionList: [],
    transactionIsLoading: apiStatus.initial,
    showTransactionPopup: false,
    transactionSuccessMssg: false,
    showUpdatePopup: false,
    updateTransacList: [],
    imagesUrl,
    updateTransactionName: "",
    updateTransactionType: "",
    updateTransactionCategory: "",
    updateTransactionAmount: "",
    updateTransactionDate: "",
    updateSuccessMssg: false,
    showSidebar: false,
  };

  componentDidMount() {
    this.userDetails();
    this.allTransaction();
  }

  userDetails = async () => {
    const userId = Cookies.get("id");
    this.setState({
      isLoading: apiStatus.inProgress,
    });
    let url;
    let options;
    if (parseInt(userId) !== 3) {
      url = "https://bursting-gelding-24.hasura.app/api/rest/profile";
      options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "user",
          "x-hasura-user-id": `${userId}`,
        },
      };
    } else {
      url = url = "https://bursting-gelding-24.hasura.app/api/rest/profile";
      options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "admin",
        },
      };
    }
    const res = await fetch(url, options);
    const data = await res.json();
    if (res.ok) {
      const userList = data.users.map((each) => {
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
      this.setState({
        userList,
        isLoading: apiStatus.res,
      });
    } else {
      this.setState({
        isLoading: apiStatus.rej,
      });
    }
  };

  allTransaction = async () => {
    const userId = Cookies.get("id");
    this.setState({
      transactionIsLoading: apiStatus.inProgress,
    });
    let url;
    let options;
    if (parseInt(userId) !== 3) {
      url =
        "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0";
      options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "user",
          "x-hasura-user-id": `${userId}`,
        },
      };
    } else {
      url =
        "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0";
      options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "admin",
        },
      };
    }
    const res = await fetch(url, options);
    const data = await res.json();
    if (res.ok) {
      const transactionList = data.transactions.map((each) => {
        return {
          transactionName: each.transaction_name,
          userId: each.user_id,
          amount: each.amount,
          category: each.category,
          id: each.id,
          type: each.type,
          date: each.date,
        };
      });
      this.setState({
        transactionList,
        transactionIsLoading: apiStatus.res,
      });
    } else {
      this.setState({
        transactionIsLoading: apiStatus.rej,
      });
    }
  };

  onClickTransaction = () => {
    this.setState({
      showTransactionPopup: true,
    });
  };

  onCancel = () => {
    this.setState({
      showTransactionPopup: false,
      transactionSuccessMssg: false,
      showUpdatePopup: false,
      updateSuccessMssg: false,
    });
  };

  onDeleteTransaction = async (id) => {
    const userId = Cookies.get("id");
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
      const { transactionList } = this.state;
      const trnsacId = data.delete_transactions_by_pk.id;
      const updateList = transactionList.filter((each) => each.id !== trnsacId);
      this.setState({
        transactionList: updateList,
      });
    }
  };

  onShow = () => {
    this.setState((prevState) => ({
      showSidebar: !prevState.showSidebar,
    }));
  };

  addTransactionToDatabase = async (data) => {
    const userId = Cookies.get("id");
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
    this.setState((prevState) => ({
      transactionList: [
        ...prevState.transactionList,
        updateData.insert_transactions_one,
      ],
      transactionSuccessMssg: true,
    }));
  };

  updateTransactionToDatabase = async (info) => {
    const userId = Cookies.get("id");
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
      this.setState({
        updateSuccessMssg: true,
      });
    }
  };

  onAddTransaction = (name, type, category, amount, date) => {
    const userId = Cookies.get("id");
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

      this.addTransactionToDatabase(updateData);
    } else {
      alert("All Input Fields are required?");
    }
  };

  onClickEdit = async (id) => {
    const { transactionList } = this.state;
    const userId = Cookies.get("id");
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
      console.log(updateList);
      this.setState({
        updateTransacList: updateList[0],
        showUpdatePopup: true,
        updateTransactionName: transactionName,
        updateTransactionType: type,
        updateTransactionCategory: category,
        updateTransactionAmount: amount,
        updateTransactionDate: formatDate,
      });
    }
  };

  updateTransactionNameValue = (value) => {
    let { updateTransactionName } = this.setState;
    updateTransactionName = value;
    this.setState({
      updateTransactionName,
    });
  };

  updateTransactionTypeValue = (value) => {
    let { updateTransactionType } = this.state;
    updateTransactionType = value;
    this.setState({
      updateTransactionType,
    });
  };

  updateTransactionCategoryValue = (value) => {
    let { updateTransactionCategory } = this.state;
    updateTransactionCategory = value;
    this.setState({
      updateTransactionCategory,
    });
  };

  updateTransactionAmountValue = (value) => {
    let { updateTransactionAmount } = this.state;
    updateTransactionAmount = value;
    this.setState({
      updateTransactionAmount,
    });
  };

  updateTransactionDateValue = (value) => {
    let { updateTransactionDate } = this.state;
    updateTransactionDate = value;
    this.setState({
      updateTransactionDate,
    });
  };

  onUpdateTransaction = (name, type, category, amount, date) => {
    const { updateTransacList } = this.state;
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
    this.updateTransactionToDatabase(updateData);
  };

  render() {
    const {
      transactionId,
      userList,
      isLoading,
      transactionIsLoading,
      showTransactionPopup,
      transactionList,
      transactionSuccessMssg,
      showUpdatePopup,
      updateTransacList,
      imagesUrl,
      updateTransactionName,
      updateTransactionType,
      updateTransactionCategory,
      updateTransactionAmount,
      updateTransactionDate,
      updateSuccessMssg,
      showSidebar,
    } = this.state;
    return (
      <ResourceContext.Provider
        value={{
          transactionId,
          userList,
          isLoading,
          transactionIsLoading,
          showTransactionPopup,
          onClickTransaction: this.onClickTransaction,
          transactionList,
          onDeleteTransaction: this.onDeleteTransaction,
          onCancel: this.onCancel,
          onAddTransaction: this.onAddTransaction,
          transactionSuccessMssg,
          onClickEdit: this.onClickEdit,
          showUpdatePopup,
          updateTransacList,
          onUpdateTransaction: this.onUpdateTransaction,
          imagesUrl,
          updateTransactionName,
          updateTransactionType,
          updateTransactionCategory,
          updateTransactionAmount,
          updateTransactionDate,
          updateTransactionNameValue: this.updateTransactionNameValue,
          updateTransactionTypeValue: this.updateTransactionTypeValue,
          updateTransactionCategoryValue: this.updateTransactionCategoryValue,
          updateTransactionAmountValue: this.updateTransactionAmountValue,
          updateTransactionDateValue: this.updateTransactionDateValue,
          updateSuccessMssg,
          showSidebar,
          onShow: this.onShow,
          allTransaction: this.allTransaction,
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
}

export default withRouter(App);
