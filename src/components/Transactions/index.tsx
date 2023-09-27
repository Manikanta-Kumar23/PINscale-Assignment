import React, {  useContext , useEffect , useState } from "react";
import {  Observer } from "mobx-react-lite" 

import { ResourceContext } from "../../context/ResourceContext";
import FailureView from "../../common/FailureView";
import LoadingWrapper from "../../common/LoadingWrapper";
import { apiStatus } from "../../constants";
import TransactionsList from "../TransactionsList";
import TransactionType from "../TransactionType";

import "./index.css";

const transactionTypes: TransactionTabType[] = [
  { name: "All Transactions", id: "ALL TRANSACTIONS" },
  { name: "Debit", id: "debit" },
  { name: "Credit", id: "credit" },
];
interface TransactionTabType {
  name: string
  id: string
}

const Transactions = () => {
  const [activeTypeId , setActiveTypeId] = useState(transactionTypes[0].id)
  const {transacCurrent , apiCall , shouldShowDeletePopup , shouldShowAddTransactionPopup , shouldShowUpdatePopup , shouldShowLogoutPopup} = useContext(ResourceContext)

  useEffect(() => {
    apiCall()
  } , [])

  const changeTypeId = (id: string) => {
    setActiveTypeId(id)
  }

  const renderTransactiondata = () => {
          switch (transacCurrent.value) {
            case apiStatus.res:
              return (
                <TransactionsList activeTypeId = {activeTypeId} />
              );
            case apiStatus.inProgress:
              return (
                <LoadingWrapper />
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
          {!shouldShowDeletePopup && !shouldShowAddTransactionPopup && !shouldShowUpdatePopup && !shouldShowLogoutPopup && (
            <ul className="transactiontype-card">
            {transactionTypes.map((each) => (
              <TransactionType
                list={each}
                key={each.id}
                isActive={activeTypeId === each.id}
                changeTypeId = {changeTypeId}
              />
            ))}
            </ul>
          )}
                <div className="main-content">
          {renderTransactiondata()}
          </div>
        </>
)}
      </Observer>
    );
}

export default (Transactions);
