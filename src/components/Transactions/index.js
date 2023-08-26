import { useState } from "react";
import { parseISO, format } from "date-fns";
import { ThreeDots } from "react-loader-spinner";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { BiUpArrowCircle } from "react-icons/bi";
import { BsArrowDownCircle } from "react-icons/bs";
import FailureView from "../FailureView";
import { RxCross2 } from "react-icons/rx";
import Popup from "reactjs-popup";

import ResourceContext from "../../context/ResourceContext";
import useUserId from "../useUserId";
import SideBar from "../SideBar";
import Navbar from "../Navbar";
import TransactionType from "../TransactionType";

import "./index.css";

const apiStatus = {
  res: "SUCCESS",
  rej: "FAIL",
  inProgress: "PENDING",
  initial: "",
};

const transactionType = [
  { name: "All Transactions", id: "ALL TRANSACTIONS" },
  { name: "Debit", id: "debit" },
  { name: "Credit", id: "credit" },
];

const Transactions = () => {
  const [activeTypeId , setActiveTypeId] = useState(transactionType[0].id)
  const [showPopup , setShowPopup] = useState(true)
  const userId = useUserId()

  const changeTypeId = (id) => {
      setActiveTypeId(id)
  };

  const changePopup = () => {
      setShowPopup(s => !s)
  };

  const transactiondata = () => {
    return (
      <ResourceContext.Consumer>
        {(value) => {
          const {
            transactionList,
            transactionIsLoading,
            onDeleteTransaction,
            showTransactionPopup,
            onClickEdit,
            userList,
            showUpdatePopup,
            imagesUrl,
          } = value;
          const filterList = transactionList.filter(
            (each) => each.type.toLowerCase() === activeTypeId
          );
          const formatedTransactionList =
            activeTypeId === transactionType[0].id
              ? transactionList.sort(
                  (a, b) => new Date(b.date) - new Date(a.date)
                )
              : filterList.sort((a, b) => new Date(b.date) - new Date(a.date));
          const onDelete = async (event) => {
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
              const updateList = transactionList.filter((each) => each.id !== trnsacId);
              onDeleteTransaction(updateList);
            }
          };
          const onEdit = async (event) => {
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
              const updateList = transactionList.filter(
                (each) => each.id === data.delete_transactions_by_pk.id
              );
              const list = updateList[0];
              const formatDate = format(parseISO(list.date), "yyyy-MM-dd");
              const updatedList = {...list , date: formatDate}
            onClickEdit(updatedList);
          }}
          switch (transactionIsLoading) {
            case apiStatus.res:
              let allUsersList;
              if (parseInt(userId) === 3) {
                allUsersList = userList.map((each) => ({
                  name: each.name,
                  userId: each.id,
                }));
              }
              return (
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
                        {formatedTransactionList.map((each) => (
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
                                <p className="margin">{each.transactionName}</p>
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
                                    onClick={onEdit}
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
                                        onClick={changePopup}
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
                                          {showPopup ? (
                                            <>
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
                                                  Are you sure you want to
                                                  Delete?
                                                </h1>
                                                <p className="cnfrm-txt">
                                                  This transaction will be
                                                  deleted immediately. You can’t
                                                  undo this action.
                                                </p>
                                                <div className="btn-crd">
                                                  <button
                                                    onClick={onDelete}
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
                                            </>
                                          ) : (
                                            <div>
                                              <h1 className="success-mssg">
                                                Transaction deleted
                                                successfully.
                                              </h1>
                                            </div>
                                          )}
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

    return (
      <div className="home-bg">
        <SideBar />
        <div className="home-content">
          <Navbar />
          <ul className="transactiontype-crd">
            {transactionType.map((each) => (
              <TransactionType
                changeTypeId={changeTypeId}
                list={each}
                key={each.id}
                isActive={activeTypeId === each.id}
              />
            ))}
          </ul>
          <div className="main-content">{transactiondata()}</div>
        </div>
      </div>
    );
}

export default Transactions;
