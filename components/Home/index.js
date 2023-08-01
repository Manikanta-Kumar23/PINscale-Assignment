import { Component } from "react";

import Popup from "reactjs-popup";

import { parseISO, format } from "date-fns";

import { ThreeDots } from "react-loader-spinner";

import ResourceContext from "../../context/ResourceContext";

import { RxCross2 } from "react-icons/rx";

import { BiUpArrowCircle } from "react-icons/bi";

import { BsArrowDownCircle } from "react-icons/bs";

import { HiOutlinePencil } from "react-icons/hi";

import { IoWarningOutline } from "react-icons/io5";

import { RiDeleteBin6Line } from "react-icons/ri";

import FailureView from "../FailureView";

import TransactionOverviewChart from "../TransactionOverviewChart";

import SideBar from "../SideBar";

import Navbar from "../Navbar";

import Cookies from "js-cookie";

import "./index.css";

const apiStatus = {
  res: "SUCCESS",
  rej: "FAIL",
  inProgress: "PENDING",
  initial: "",
};

class Home extends Component {
  state = {
    isLoading: apiStatus.initial,
    creditData: [],
    recentTransactions: [],
    transcLoading: apiStatus.initial,
    overviewLoading: apiStatus.initial,
    overviewList: [],
  };

  componentDidMount() {
    this.creditAndDebit();
    this.recentTransactions();
    this.transactionOverview();
  }

  creditAndDebit = async () => {
    const userId = Cookies.get("id");
    this.setState({
      isLoading: apiStatus.inProgress,
    });
    let url;
    let options;
    if (parseInt(userId) !== 3) {
      url =
        "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals";
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
        "https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin";
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
    if (res.ok && parseInt(userId) === 3) {
      const creditData = data.transaction_totals_admin;
      this.setState({
        creditData,
        isLoading: apiStatus.res,
      });
    } else if (res.ok && parseInt(userId) !== 3) {
      const creditData = data.totals_credit_debit_transactions;
      this.setState({
        creditData,
        isLoading: apiStatus.res,
      });
    } else {
      this.setState({
        isLoading: apiStatus.rej,
      });
    }
  };

  recentTransactions = async () => {
    const userId = Cookies.get("id");
    this.setState({
      transcLoading: apiStatus.inProgress,
    });
    let url;
    let options;
    if (parseInt(userId) !== 3) {
      url =
        "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=3&offset=0";
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
        "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=3&offset=0";
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
      const transactionData = data.transactions.map((each) => {
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
        transcLoading: apiStatus.res,
        recentTransactions: transactionData,
      });
    } else {
      this.setState({
        transcLoading: apiStatus.rej,
      });
    }
  };

  transactionOverview = async () => {
    const userId = Cookies.get("id");
    this.setState({
      overviewLoading: apiStatus.inProgress,
    });
    let url;
    let options;
    if (parseInt(userId) !== 3) {
      url =
        "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days";
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
        "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin";
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
    if (res.ok && parseInt(userId) !== 3) {
      const overviewList = data.last_7_days_transactions_credit_debit_totals;
      this.setState({
        overviewLoading: apiStatus.res,
        overviewList,
      });
    } else if (res.ok && parseInt(userId) === 3) {
      const overviewList = data.last_7_days_transactions_totals_admin;
      this.setState({
        overviewList,
        overviewLoading: apiStatus.res,
      });
    } else {
      this.setState({
        overviewLoading: apiStatus.rej,
      });
    }
  };

  totalCreditAndDebit = () => {
    const { creditData, isLoading } = this.state;
    switch (isLoading) {
      case apiStatus.res:
        let credit = 0;
        let debit = 0;
        creditData.map((each) => {
          if (each.type === "credit") {
            credit += each.sum;
            return credit;
          } else {
            debit += each.sum;
            return debit;
          }
        });
        const transData = [
          {
            cost: credit,
            type: "Credit",
            image:
              "https://res.cloudinary.com/djwve85r0/image/upload/v1690687006/Credit_sxyxmg.png",
          },
          {
            cost: debit,
            type: "Debit",
            image:
              "https://res.cloudinary.com/djwve85r0/image/upload/v1690687006/Debit_pribpg.png",
          },
        ];
        return (
          <ul className="totalcredit-card">
            {transData.map((each) => (
              <li key={each.type} className="credit-card">
                <div className="cost-card">
                  <h1
                    className={`cost ${
                      each.type === "Debit" ? "debit-cost" : null
                    }`}
                  >
                    ${each.cost}
                  </h1>
                  <p className="transc-type">{each.type}</p>
                </div>
                <img
                  className="transc-img"
                  alt={`${each.type}`}
                  src={each.image}
                />
              </li>
            ))}
          </ul>
        );
      case apiStatus.inProgress:
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="loader-container"
          >
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#4D78FF"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
            />
          </div>
        );
      case apiStatus.rej:
        return <FailureView />;
      default:
        return null;
    }
  };

  threeTransactions = () => {
    const { transcLoading, recentTransactions } = this.state;
    const userId = Cookies.get("id");
    recentTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
      <ResourceContext.Consumer>
        {(value) => {
          const {
            showTransactionPopup,
            userList,
            onDeleteTransaction,
            showUpdatePopup,
            imagesUrl,
            onClickEdit,
          } = value;
          const deleteTransc = (event) => {
            onDeleteTransaction(event.target.value);
          };

          const updateTransac = (event) => {
            onClickEdit(event.target.value);
          };
          switch (transcLoading) {
            case apiStatus.res:
              let allUsersList;
              if (parseInt(userId) === 3) {
                allUsersList = userList.map((each) => ({
                  name: each.name,
                  userId: each.id,
                }));
              }
              return (
                <div className="recent-card">
                  <h1 className="last-transc">Last Transaction</h1>
                  <div className="table-card">
                    <table className="table">
                      <thead className="head">
                        <tr className="head-card">
                          {parseInt(userId) === 3 && <th>User Name</th>}
                          <th>Transaction Name</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      {!showTransactionPopup && !showUpdatePopup && (
                        <tbody className="body">
                          {recentTransactions.map((each) => (
                            <tr key={each.id}>
                              {parseInt(userId) === 3 && (
                                <td>
                                  <div className="usr-icn-crd">
                                    {parseInt(userId) === 3 ? (
                                      each.type.toLowerCase() === "credit" ? (
                                        <BiUpArrowCircle
                                          color="#16DBAA"
                                          size="23"
                                        />
                                      ) : (
                                        <BsArrowDownCircle
                                          color="#FE5C73"
                                          size="19"
                                        />
                                      )
                                    ) : null}
                                    <img
                                      className="usr-icn"
                                      alt="user-icon"
                                      src={
                                        imagesUrl.find(
                                          (user) =>
                                            parseInt(user.id) === each.userId
                                        )?.url
                                      }
                                    />
                                    {allUsersList.find(
                                      (user) => user.userId === each.userId
                                    )?.name || "N/A"}
                                  </div>
                                </td>
                              )}
                              <td>
                                <div className="align">
                                  {parseInt(userId) !== 3 ? (
                                    each.type.toLowerCase() === "credit" ? (
                                      <BiUpArrowCircle
                                        color="#16DBAA"
                                        size="23"
                                      />
                                    ) : (
                                      <BsArrowDownCircle
                                        color="#FE5C73"
                                        size="19"
                                      />
                                    )
                                  ) : null}
                                  <p className="margin">
                                    {each.transactionName}
                                  </p>
                                </div>
                              </td>
                              <td>{each.category}</td>
                              <td>
                                {format(parseISO(each.date), "d MMM, h:mm aa")}
                              </td>
                              <td
                                style={{
                                  color: `${
                                    each.type.toLowerCase() === "credit"
                                      ? "#16DBAA"
                                      : "#fe5c73"
                                  }`,
                                }}
                              >
                                {`${
                                  each.type.toLowerCase() === "credit"
                                    ? `+$${each.amount}`
                                    : `-$${each.amount}`
                                }`}
                              </td>
                              {parseInt(userId) !== 3 && (
                                <>
                                  <td>
                                    <button
                                      onClick={updateTransac}
                                      value={each.id}
                                      className="edit-btn"
                                      type="button"
                                    >
                                      <HiOutlinePencil
                                        color="#2D60FF"
                                        size="15"
                                      />
                                    </button>
                                  </td>
                                  <td>
                                    <Popup
                                      modal
                                      trigger={
                                        <button
                                          className="edit-btn"
                                          type="button"
                                        >
                                          <RiDeleteBin6Line
                                            color="#FE5C73"
                                            size="15 "
                                          />
                                        </button>
                                      }
                                    >
                                      {(close) => (
                                        <div className="modal-card">
                                          <div className="mssg-card">
                                            <div className="out-icon">
                                              <span className="bg-clr">
                                                <IoWarningOutline
                                                  color="#D97706"
                                                  size="21"
                                                />
                                              </span>
                                            </div>
                                            <div className="text-card">
                                              <h1 className="logout-name">
                                                Are you sure you want to Delete?
                                              </h1>
                                              <p className="cnfrm-txt">
                                                This transaction will be deleted
                                                immediately. You can’t undo this
                                                action.
                                              </p>
                                              <div className="btn-crd">
                                                <button
                                                  onClick={deleteTransc}
                                                  value={each.id}
                                                  className="s-btn"
                                                  type="button"
                                                >
                                                  Yes, Delete
                                                </button>
                                                <button
                                                  className="no-btn"
                                                  type="button"
                                                  onClick={() => close()}
                                                >
                                                  No, Leave it
                                                </button>
                                              </div>
                                            </div>
                                            <button
                                              className="cancl-btn"
                                              onClick={() => close()}
                                              type="button"
                                            >
                                              <RxCross2
                                                color="#718EBF"
                                                size="17"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </Popup>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              );
            case apiStatus.inProgress:
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="loader-container"
                >
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#4D78FF"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />
                </div>
              );
            case apiStatus.rej:
              return <FailureView />;
            default:
              return null;
          }
        }}
      </ResourceContext.Consumer>
    );
  };

  transactionOverviewCharts = () => {
    const { overviewLoading, overviewList } = this.state;
    return (
      <ResourceContext.Consumer>
        {(value) => {
          const { showTransactionPopup, showUpdatePopup } = value;
          switch (overviewLoading) {
            case apiStatus.res:
              return (
                <div className="chart-card">
                  <h1 className="overview">Debit & Credit Overview</h1>
                  {!showTransactionPopup && !showUpdatePopup && (
                    <TransactionOverviewChart data={overviewList} />
                  )}
                </div>
              );
            case apiStatus.inProgress:
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="loader-container"
                >
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#4D78FF"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />
                </div>
              );
            case apiStatus.rej:
              return <FailureView />;
            default:
              return null;
          }
        }}
      </ResourceContext.Consumer>
    );
  };

  render() {
    return (
      <div className="home-bg">
        <SideBar />
        <div className="home-content">
          <Navbar />
          <div className="main-content">
            {this.totalCreditAndDebit()}
            {this.threeTransactions()}
            {this.transactionOverviewCharts()}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
