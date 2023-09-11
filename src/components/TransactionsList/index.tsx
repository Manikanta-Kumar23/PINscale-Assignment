import {useContext} from "react"
import { observer } from "mobx-react";
import { parseISO, format } from "date-fns";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiUpArrowCircle } from "react-icons/bi";
import { BsArrowDownCircle } from "react-icons/bs";

import "./index.css"
import useUserId from "../../hooks/useUserId";
import { ResourceContext } from "../../context/ResourceContext";
import { imagesUrl } from "../../constants";
import { useStoreProvider } from "../../context/StoreContext";

  interface TransactionTabType {
    name: string
    id: string
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

const TransactionsList = (props: any) => {
    let filterList;
    const userId = useUserId()
    const transaction = useStoreProvider()
    const {showDeletePopup , showTransactionPopup , showUpdatePopup , logoutPopup , activeTypeId , onClickEdit , onClickDelete ,
    userList , apiCall} = useContext(ResourceContext)
    if (activeTypeId !== transactionTypes[0].id) {
        filterList = transaction.transactionList.filter(
          (each) =>  each.type.toLowerCase() === activeTypeId);
      }
    const formatedTransactionList =
        activeTypeId === transactionTypes[0].id
          ? transaction.transactionList
          : filterList
    const finalList: any = props.limit !== undefined ? transaction.transactionList.slice(0 , 3) : formatedTransactionList

    const onEdit =  (event: any) => {
      const updateList = transaction.transactionList.filter((each) => parseInt(each.id) === parseInt(event.target.value))
      if (updateList[0] !== undefined) {
              const list = updateList[0]
              const updatedList = {...list}
              transaction.changeUpdateList(updatedList)
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
    const changePopup = (event:any) => {
        onClickDelete(event.target.value)
      };
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
                        {finalList.map((each: any) => (
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
    )
}

export default observer(TransactionsList)