import { useContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoWarningOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";

import { ResourceContext } from "../../context/ResourceContext";
import { useStoreProvider } from "../../context/StoreContext";
import useUserId from "../../hooks/useUserId";

import "./index.css";

interface TransactionModelType {
  amount: string;
  category: string;
  id: string;
  type: string;
  date: string;
  transactionName: string;
  userId?: string;
}

const DeleteTransaction = (props: any) => {
  const {
    shouldShowDeletePopup,
    onCancel,
    deleteTransacId,
    shouldShowLogoutPopup,
    hideLogoutPop,
    apiCall,
  } = useContext(ResourceContext);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const userId = useUserId();
  const transaction = useStoreProvider();
  const onClose = () => {
    setIsErr(false);
    onCancel();
    setIsDeleted(false);
  };
  const onDelete = async () => {
    setIsErr(false);
    const id = parseInt(deleteTransacId);
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
      const updateList = transaction.transactionList.filter(
        (each: TransactionModelType) => each.id !== trnsacId,
      );
      transaction.deleteTransactionList(updateList);
      apiCall();
      setIsDeleted(true);
    } else {
      setIsErr(true);
    }
  };
  const onLogout = () => {
    const { history } = props;
    Cookies.remove("id");
    history.replace("/login");
    hideLogoutPop();
  };
  const renderDeleteView = () => {
    return (
      <div className="add-transaction-card">
        <div className="modal-card">
          <div className="modal-card-header">
            {!isDeleted ? (
              <>
                <div className="warning-icon">
                  <span className="warning-icon-bg">
                    <IoWarningOutline color="#D97706" size="21" />
                  </span>
                </div>
                <div className="main-text-card">
                  <h1 className="main-text-heading">
                    Are you sure you want to Delete?
                  </h1>
                  <p className="confirm-text">
                    This transaction will be deleted immediately. You can’t undo
                    this action.
                  </p>
                  <div className="delete-card-btns">
                    <button
                      className="confirm-btn"
                      onClick={onDelete}
                      type="button"
                    >
                      Yes, Delete
                    </button>
                    <button
                      className="reject-btn"
                      type="button"
                      onClick={onClose}
                    >
                      No, Leave it
                    </button>
                  </div>
                  {isErr && (
                    <p className="delete-transaction-error">
                      *Please try Again
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="add-transaction-success-card">
                <h1 className="add-transaction-success-heading">
                  Transaction deleted successfully.
                </h1>
              </div>
            )}
            <button
              onClick={onClose}
              className="add-transaction-cancel-btn"
              type="button"
            >
              <RxCross2 color="#718EBF" size="17" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  const renderLogOutView = () => {
    return (
      <div className="add-transaction-card">
        <div className="modal-card">
          <div className="modal-card-header">
            <div className="warning-icon">
              <span className="warning-icon-bg">
                <FiLogOut color="#D97706" size="21" />
              </span>
            </div>
            <div className="main-text-card">
              <h1 className="main-text-heading">
                Are you sure you want to Logout?
              </h1>
              <p className="confirm-text">Click Yes to logout or else Cancel</p>
              <div className="delete-card-btns">
                <button
                  onClick={onLogout}
                  className="confirm-btn"
                  type="button"
                >
                  Yes,Logout
                </button>
                <button className="reject-btn" type="button" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {shouldShowDeletePopup && renderDeleteView()}
      {shouldShowLogoutPopup && renderLogOutView()}
    </>
  );
};
export default withRouter(DeleteTransaction);
