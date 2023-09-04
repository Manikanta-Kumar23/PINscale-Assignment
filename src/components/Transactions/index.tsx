import { useContext, useEffect } from "react";
import { parseISO, format } from "date-fns";
import ThreeDots  from  'react-loader-spinner'
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiUpArrowCircle } from "react-icons/bi";
import { BsArrowDownCircle } from "react-icons/bs";
import {  Observer } from "mobx-react-lite" 

import {ResourceContext }from "../../context/ResourceContext";
import FailureView from "../FailureView";
import useUserId from "../../hooks/useUserId";
import { apiStatus ,imagesUrl  } from "../../constants";

import "./index.css";


interface TransactionTabType {
  name: string
  id: string
}
interface TransactionTypes {
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
interface DataType {
  fetchedTransactionData: TransactionTypes
}

interface UserListType {
  name: string
  id: string | number
}

const transactionTypes: TransactionTabType[] = [
  { name: "All Transactions", id: "ALL TRANSACTIONS" },
  { name: "Debit", id: "debit" },
  { name: "Credit", id: "credit" },
];

const Transactions = (props: any) => {
  const userId = useUserId()
  const {
    transaction,
    transactionIsLoading,
    showTransactionPopup,
    onClickEdit,
    userList,
    showUpdatePopup,
 apiCall , onClickDelete , showDeletePopup , logoutPopup ,activeTypeId
  } = useContext(ResourceContext)

  const changePopup = (event:any) => {
    onClickDelete(event.target.value)
  };

  useEffect(() => {
    apiCall()
  } , [])

  const renderTransactiondata = () => {
    let filterList;
          switch (transactionIsLoading) {
            case apiStatus.res:
              if (activeTypeId !== transactionTypes[0].id) {
                filterList = transaction.current.transactionList.filter(
                  (each: DataType) =>  each.fetchedTransactionData.type.toLowerCase() === activeTypeId);
              }
              const formatedTransactionList =
                activeTypeId === transactionTypes[0].id
                  ? transaction.current.transactionList
                  : filterList
                  const finalList = props.limit !== undefined ? transaction.current.transactionList.slice(0 , 3) : formatedTransactionList

              const onEdit =  (event: any) => {
                const updateList = transaction.current.transactionList.filter((each: DataType) => parseInt(each.fetchedTransactionData.id) === parseInt(event.target.value))
                  if (updateList[0] !== undefined) {
                    const list = updateList[0].fetchedTransactionData
                    const updatedList = {...list}
                    transaction.current.changeUpdateList(updatedList)
                    onClickEdit();
                  }
    }
              let allUsersList: UserListType[];
              if ((userId) === "3") {
                allUsersList = userList.map((each) => ({
                  name: each.name,
                  id: each.id,
                }));
              }
              return (
                <div className="table-card">
                  <table className="table">
                    <thead className="head">
                      <tr className="head-card">
                        {((userId) === "3")  && <th>User Name</th>}
                        <th>Transaction Name</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    {!showTransactionPopup && !showUpdatePopup &&  !showDeletePopup && !logoutPopup &&(
                      <tbody className="body">
                        {finalList.map((each: DataType) => (
                          <tr key={each.fetchedTransactionData.id}>
                            {((userId) === "3")  && (
                              <td>
                                <div className="usr-icn-crd">
                                  {((userId) === "3") ? (
                                    each.fetchedTransactionData.type.toLowerCase() === "credit" ? (
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
                                          (user.id) === (each.fetchedTransactionData.userId)
                                      )?.url
                                    }
                                  />
                                  {allUsersList.find(
                                    (user) => user.id === each.fetchedTransactionData.userId
                                  )?.name || "N/A"}
                                </div>
                              </td>
                            )}
                            <td>
                              <div className="align">
                                {((userId) !== "3")  ? (
                                  each.fetchedTransactionData.type.toLowerCase() === "credit" ? (
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
                                <p className="margin">{each.fetchedTransactionData.transactionName}</p>
                              </div>
                            </td>
                            <td>{each.fetchedTransactionData.category}</td>
                            <td>
                              {format(parseISO(each.fetchedTransactionData.date), "d MMM, h:mm aa")}
                            </td>
                            <td
                              style={{
                                color: `${
                                  each.fetchedTransactionData.type.toLowerCase() === "credit"
                                    ? "#16DBAA"
                                    : "#fe5c73"
                                }`,
                              }}
                            >
                              {`${
                                each.fetchedTransactionData.type.toLowerCase() === "credit"
                                  ? `+$${each.fetchedTransactionData.amount}`
                                  : `-$${each.fetchedTransactionData.amount}`
                              }`}
                            </td>
                            {(userId) !== "3" && (
                              <>
                                <td>
                                  <button
                                    onClick={onEdit}
                                    value={each.fetchedTransactionData.id}
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
                                <button
                                        onClick={changePopup}
                                        className="edit-btn"
                                        value = {each.fetchedTransactionData.id}
                                        type="button"
                                      >
                                        <RiDeleteBin6Line
                                          color="#FE5C73"
                                          size="15 "
                                        />
                                      </button>
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
                    justifyContent: "center"
                  }}
                  className="loader-container"
                >
                  <ThreeDots
                    height="80"
                    width="80"
                    color="#4D78FF"
                    radius= {9}
                    type="ThreeDots"
                    visible={true}
                  />
                </div>
              );
            case apiStatus.rej:
              return <FailureView />;
            default:
              return null;
          }
        ;
  };

    return (
      <Observer>
        {() => (<>
          {renderTransactiondata()}
        </>
)}
      </Observer>
    );
}

export default (Transactions);
