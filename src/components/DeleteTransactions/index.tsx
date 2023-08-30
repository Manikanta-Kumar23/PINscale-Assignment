import { RxCross2 } from "react-icons/rx";
import { IoWarningOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";

import ResourceContext from "../../context/ResourceContext";
import useUserId from "../../hooks/useUserId";

import "./index.css"
import { useContext, useState } from "react";

interface TransactionType {
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

const DeleteTransaction = (props: any) => {
    const {showDeletePopup , onCancel , deleteTransacId , onDeleteTransaction , transactionList , logoutPopup} = useContext(ResourceContext)
    const [deleteMssg , setDeleteMssg] = useState(false)
    const [errMssg , setErrMssg] = useState(false)
    const userId = useUserId()
    const onClose = () => {
        setErrMssg(false)
        onCancel()
    }
    const onDelete = async () => {
        setErrMssg(false)
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
          const url = `https://bursting-gelding-24.hasura.app/api/rest/delete-transaction?id=${deleteTransacId}`;
          const res = await fetch(url, options);
          const data = await res.json();
          if (res.ok) {
            const trnsacId = data.delete_transactions_by_pk.id;
            const updateList = transactionList.filter((each: TransactionType) => each.id !== trnsacId);
            onDeleteTransaction(updateList);
            setDeleteMssg(true)
          }
          else {
            setErrMssg(true)
          }
    }
    const onLogout = () => {
        const { history } = props;
        Cookies.remove("id");
        history.replace("/login");
      };
    const deleteView = () => {
        return (
            <div className="add-transactions">
                <div className="modal-card">
  <div className="mssg-card">
      {!deleteMssg ? (
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
                          className="s-btn"
                          onClick={onDelete}
                          type="button"
                       >
                          Yes, Delete
                      </button>
                      <button
                      className="no-btn"
                      type="button"
                      onClick={ onClose}
                      >
                      No, Leave it
                      </button>
              </div>
              {errMssg && (<p className="err">*Please try Again</p>)}
          </div>
      </>) : (
               <div className="add-suc-crd">
                      <h1 className="add-suc">
                           Transaction deleted successfully.</h1>
              </div>)}
                 <button
                 onClick={onClose}
                      className="cancl-btn"
                      type="button">
                        <RxCross2 color="#718EBF" size="17"/>
                  </button>
      </div>
       </div>
            </div>
        )
    }
    const logOutView = () => {
        return (
            <div className="add-transactions">
                <div className="modal-card">
                      <div className="mssg-card">
                        <div className="out-icon">
                          <span className="bg-clr">
                            <FiLogOut color="#D97706" size="21" />
                          </span>
                        </div>
                        <div className="text-card">
                          <h1 className="logout-name">
                            Are you sure you want to Logout?
                          </h1>
                          <p className="cnfrm-txt">
                            Click Yes to logout or else Cancel
                          </p>
                          <div className="btn-crd">
                            <button
                              onClick={onLogout}
                              className="s-btn"
                              type="button"
                            >
                              Yes,Logout
                            </button>
                            <button
                              className="no-btn"
                              type="button"
                              onClick={onClose}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
            </div>
        )
    }
    return (
        ( 
       <>
        {showDeletePopup && deleteView()}
        {logoutPopup && logOutView()}</>)
    )
}
export default withRouter(DeleteTransaction)