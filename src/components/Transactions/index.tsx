import { useContext, useEffect, useState } from "react";
import { parseISO, format } from "date-fns";
import ThreeDots  from  'react-loader-spinner'
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiUpArrowCircle } from "react-icons/bi";
import { BsArrowDownCircle } from "react-icons/bs";
import FailureView from "../FailureView";


import ResourceContext from "../../context/ResourceContext";
import useUserId from "../../hooks/useUserId";
import SideBar from "../SideBar";
import Navbar from "../Navbar";
import TransactionType from "../TransactionType";
import { apiStatus } from "../../constants";

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
interface UserListType {
  name: string
  id: string | number
}

const transactionTypes: TransactionTabType[] = [
  { name: "All Transactions", id: "ALL TRANSACTIONS" },
  { name: "Debit", id: "debit" },
  { name: "Credit", id: "credit" },
];

const Transactions = () => {
  const [activeTypeId , setActiveTypeId] = useState(transactionTypes[0].id)
  const userId = useUserId()
  const {
    transactionList,
    transactionIsLoading,
    showTransactionPopup,
    onClickEdit,
    userList,
    showUpdatePopup,
    imagesUrl, apiCall , onClickDelete , showDeletePopup , logoutPopup
  } = useContext(ResourceContext)

  const changeTypeId = (id: string) => {
      setActiveTypeId(id)
  };

  const changePopup = (event:any) => {
    onClickDelete(event.target.value)
  };

  useEffect(() => {
    apiCall()
  } , [])

  const renderTransactiondata = () => {
          const filterList = transactionList.filter(
            (each: TransactionTypes) =>  each.type.toLowerCase() === activeTypeId);
          const formatedTransactionList =
            activeTypeId === transactionTypes[0].id
              ? transactionList.sort(
                  (a, b) => new Date(b.date) < new Date(a.date) ? -1 : 1
                )
              : filterList.sort((a, b) => new Date(b.date) < new Date(a.date) ? -1 : 1);
          const onEdit = async (event: any) => {
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
                (each: TransactionTypes) => each.id === data.delete_transactions_by_pk.id
              );
              const list = updateList[0];
              const formatDate = format(parseISO(list.date), "yyyy-MM-dd");
              const updatedList = {...list , date: formatDate}
            onClickEdit(updatedList);
          }}
          switch (transactionIsLoading) {
            case apiStatus.res:
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
                        {formatedTransactionList.map((each) => (
                          <tr key={each.id}>
                            {((userId) === "3")  && (
                              <td>
                                <div className="usr-icn-crd">
                                  {((userId) === "3") ? (
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
                                          (user.id) === (each.userId)
                                      )?.url
                                    }
                                  />
                                  {allUsersList.find(
                                    (user) => user.id === each.userId
                                  )?.name || "N/A"}
                                </div>
                              </td>
                            )}
                            <td>
                              <div className="align">
                                {((userId) !== "3")  ? (
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
                                <button
                                        onClick={changePopup}
                                        className="edit-btn"
                                        value = {each.id}
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
      <div className="home-bg">
        <SideBar />
        <div className="home-content">
          <Navbar />
          <ul className="transactiontype-crd">
            {transactionTypes.map((each) => (
              <TransactionType
                changeTypeId={changeTypeId}
                list={each}
                key={each.id}
                isActive={activeTypeId === each.id}
              />
            ))}
          </ul>
          <div className="main-content">{renderTransactiondata()}</div>
        </div>
      </div>
    );
}

export default Transactions;