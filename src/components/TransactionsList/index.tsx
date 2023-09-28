import { useContext } from "react";
import { observer } from "mobx-react";
import { parseISO, format } from "date-fns";
import { HiOutlinePencil } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiUpArrowCircle } from "react-icons/bi";
import { BsArrowDownCircle } from "react-icons/bs";

import useUserId from "../../hooks/useUserId";
import { ResourceContext } from "../../context/ResourceContext";
import { imagesUrl } from "../../constants";
import { useStoreProvider } from "../../context/StoreContext";

import "./index.css";

interface TransactionTabType {
  name: string;
  id: string;
}
interface UserListType {
  name: string;
  id: string | number;
}

const transactionTypes: TransactionTabType[] = [
  { name: "All Transactions", id: "ALL TRANSACTIONS" },
  { name: "Debit", id: "debit" },
  { name: "Credit", id: "credit" },
];
interface TransactionProps {
  activeTypeId?: string;
  limit?: string;
}

const TransactionsList = (props: TransactionProps) => {
  let filterList;
  const { activeTypeId, limit } = props;
  const userId = useUserId();
  const transaction = useStoreProvider();
  const {
    shouldShowDeletePopup,
    shouldShowAddTransactionPopup,
    shouldShowUpdatePopup,
    shouldShowLogoutPopup,
    onClickEdit,
    onClickDelete,
    userList,
  } = useContext(ResourceContext);
  if (activeTypeId !== transactionTypes[0].id) {
    filterList = transaction.transactionList.filter(
      (each) => each.type.toLowerCase() === activeTypeId,
    );
  }
  const formatedTransactionList =
    activeTypeId === transactionTypes[0].id
      ? transaction.transactionList
      : filterList;
  const finalList =
    limit !== undefined
      ? transaction.transactionList.slice(0, 3)
      : formatedTransactionList;
  const onEdit = (event: any) => {
    const updateList = transaction.transactionList.filter(
      (each) => parseInt(each.id) === parseInt(event.target.value),
    );
    if (updateList[0] !== undefined) {
      const list = updateList[0];
      const updatedList = { ...list };
      transaction.changeUpdateList(updatedList);
      onClickEdit();
    }
  };
  let allUsersList: UserListType[];
  if (userId === "3") {
    allUsersList = userList.map((each) => ({
      name: each.name.charAt(0).toUpperCase() + each.name.slice(1),
      id: each.id,
    }));
  }
  const changePopup = (event: any) => {
    onClickDelete(event.target.value);
  };
  return (
    <div className="transactions-table-card">
      <table className="transaction-table">
        <thead className="transaction-tablehead">
          <tr className="transaction-header-text">
            {userId === "3" && <th>User Name</th>}
            <th>Transaction Name</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        {!shouldShowAddTransactionPopup &&
          !shouldShowUpdatePopup &&
          !shouldShowDeletePopup &&
          !shouldShowLogoutPopup &&
          finalList !== undefined && (
            <tbody className="transaction-table-body-text">
              {finalList.map((each) => (
                <tr key={each.id}>
                  {userId === "3" && (
                    <td>
                      <div className="transaction-table-user-icon">
                        {userId === "3" ? (
                          each.type.toLowerCase() === "credit" ? (
                            <BiUpArrowCircle color="#16DBAA" size="23" />
                          ) : (
                            <BsArrowDownCircle color="#FE5C73" size="19" />
                          )
                        ) : null}
                        <img
                          className="table-user-icon"
                          alt="user-icon"
                          src={
                            imagesUrl.find(
                              (user) =>
                                each.userId !== undefined &&
                                parseInt(user.id) === parseInt(each.userId),
                            )?.url
                          }
                        />
                        {allUsersList.find((user) => user.id === each.userId)
                          ?.name || "N/A"}
                      </div>
                    </td>
                  )}
                  <td>
                    <div className="admin-card-icons">
                      {userId !== "3" ? (
                        each.type.toLowerCase() === "credit" ? (
                          <BiUpArrowCircle color="#16DBAA" size="23" />
                        ) : (
                          <BsArrowDownCircle color="#FE5C73" size="19" />
                        )
                      ) : null}
                      <p className="transaction-name-margin">
                        {each.transactionName}
                      </p>
                    </div>
                  </td>
                  <td>{each.category}</td>
                  <td>{format(parseISO(each.date), "d MMM, h:mm aa")}</td>
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
                  {userId !== "3" && (
                    <>
                      <td>
                        <button
                          onClick={onEdit}
                          value={each.id}
                          className="transaction-table-edit-btn"
                          type="button"
                        >
                          <HiOutlinePencil color="#2D60FF" size="15" />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={changePopup}
                          className="transaction-table-edit-btn"
                          value={each.id}
                          type="button"
                        >
                          <RiDeleteBin6Line color="#FE5C73" size="15 " />
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
};

export default observer(TransactionsList);
