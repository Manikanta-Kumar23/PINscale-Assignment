import Popup from "reactjs-popup";
import { parseISO, format } from "date-fns";
import { ThreeDots } from "react-loader-spinner";
import { RxCross2 } from "react-icons/rx";
import { BiUpArrowCircle } from "react-icons/bi";
import { BsArrowDownCircle } from "react-icons/bs";
import { HiOutlinePencil } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

import useUserId from "../../hooks/useUserId";
import useDataFetching from "../../hooks/useDataFetching";
import ResourceContext from "../../context/ResourceContext";
import FailureView from "../FailureView";
import TransactionOverviewChart from "../TransactionOverviewChart";
import SideBar from "../SideBar";
import Navbar from "../Navbar";
import "./index.css";
import { useContext, useEffect } from "react";

const apiStatus = {
  res: "SUCCESS",
  rej: "FAIL",
  inProgress: "PENDING",
  initial: "",
};

const Home = () => {
  const userId = useUserId()
  const {
    showTransactionPopup,
    userList,
    onDeleteTransaction,
    showUpdatePopup,
    imagesUrl,
    onClickEdit
  } = useContext(ResourceContext)

  let apiUrl = {creditUrl: "" , recentTransactionUrl:"" , overviewUrl : ""}
  let apiOptions = {method: 'GET' , headers: {"content-type": "application/json",
  "x-hasura-admin-secret":
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",}}

    if ((userId) !== "3") {
      apiUrl = {...apiUrl , creditUrl:"https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals" ,
                recentTransactionUrl: "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=3&offset=0" ,
              overviewUrl: "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days" }
      apiOptions = {...apiOptions , headers: {...apiOptions.headers ,"x-hasura-role": "user",
      "x-hasura-user-id": `${userId}`,}}
    }
    else {
      apiUrl = {...apiUrl , creditUrl:"https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin" ,
                recentTransactionUrl: "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=3&offset=0" ,
              overviewUrl: "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin" }
      apiOptions = {...apiOptions , headers: {...apiOptions.headers ,"x-hasura-role": "admin",}}
    }

    let creditData
    const {data: creditedData , isLoading , fetchData: homeCreditData} = useDataFetching()
    useEffect(() => {
      homeCreditData(apiUrl.creditUrl , apiOptions)
    } , [])
    if (isLoading === apiStatus.res && (userId) !== "3") {
      creditData = creditedData.totals_credit_debit_transactions
    }
    else if (isLoading === apiStatus.res && (userId) === "3") {
      creditData = creditedData.transaction_totals_admin
    }

    const {data: recentTransactionsDataList , isLoading: transcLoading , fetchData :recentTransactionsData} = useDataFetching()
    let recentTransactionsList
    useEffect(() => {
      recentTransactionsData(apiUrl.recentTransactionUrl , apiOptions)
    } , [])
    if (transcLoading === apiStatus.res) {
      recentTransactionsList = recentTransactionsDataList.transactions.map((each) => {
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
    }

    const {data: overviewDataList , isLoading: overviewLoading  , fetchData: overviewData} = useDataFetching()
    let overviewList
    useEffect(() => {
      overviewData(apiUrl.overviewUrl , apiOptions)
    } , [])
    if (overviewLoading === apiStatus.res && (userId) !== "3") {
      overviewList = overviewDataList.last_7_days_transactions_credit_debit_totals
    }
    else if (overviewLoading === apiStatus.res && (userId) === "3") {
      overviewList = overviewDataList.last_7_days_transactions_totals_admin;
    }

  const renderTotalCreditAndDebit = () => {
    switch (isLoading) {
      case apiStatus.res:
        let credit = 0;
        let debit = 0;
        creditData.map((each) => {
          if (each.type.toLowerCase() === "credit") {
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
                      each.type.toLocaleLowerCase() === "debit" ? "debit-cost" : null
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
              marginBottom: "13"
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

  const renderThreeTransactions = () => {
          const deleteTransc = async (event) => {
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
            const url = `https://bursting-gelding-24.hasura.app/api/rest/delete-transaction?id=${event.target.value}`;
            const res = await fetch(url, options);
            const data = await res.json();
            if (res.ok) {
              const trnsacId = data.delete_transactions_by_pk.id;
              const updateList = recentTransactionsList.filter((each) => each.id !== trnsacId);
              onDeleteTransaction(updateList);
            }
          };

          const updateTransac = async (event) => {
            const url = `https://bursting-gelding-24.hasura.app/api/rest/delete-transaction?id=${event.target.value}`;
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
              const updateList = recentTransactionsList.filter(
                (each) => each.id === data.delete_transactions_by_pk.id
              );
              const list = updateList[0];
              const formatDate = format(parseISO(list.date), "yyyy-MM-dd");
              const updatedList = {...list , date: formatDate}
            onClickEdit(updatedList);
          }
          };
          switch (transcLoading) {
            case apiStatus.res:
              let allUsersList;
              recentTransactionsList.sort((a, b) => new Date(b.date) - new Date(a.date));
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
                          {(userId) === "3" && <th>User Name</th>}
                          <th>Transaction Name</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      {!showTransactionPopup && !showUpdatePopup && (
                        <tbody className="body">
                          {recentTransactionsList.map((each) => (
                            <tr key={each.id}>
                              {(userId) === "3" && (
                                <td>
                                  <div className="usr-icn-crd">
                                    {(userId) === "3" ? (
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
                                  {(userId) !== "3" ? (
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
                              {(userId) !== "3" && (
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
  };

  const renderTransactionOverviewCharts = () => {
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
  };
    return (
      <div className="home-bg">
        <SideBar />
        <div className="home-content">
          <Navbar />
          <div className="main-content">
            {renderTotalCreditAndDebit()}
            {renderThreeTransactions()}
            {renderTransactionOverviewCharts()}
          </div>
        </div>
      </div>
    );
}

export default Home;
