import {  useContext , useEffect , useState } from "react";
import ThreeDots  from  'react-loader-spinner'
import {  Observer } from "mobx-react-lite" 

import FailureView from "../FailureView";
import { apiStatus } from "../../constants";
import TransactionsList from "../TransactionsList";
import TransactionType from "../TransactionType";

import "./index.css";
import { ResourceContext } from "../../context/ResourceContext";

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
  const {transactionIsLoading , apiCall , showDeletePopup , showTransactionPopup , showUpdatePopup} = useContext(ResourceContext)

  useEffect(() => {
    apiCall()
  } , [])

  const changeTypeId = (id: string) => {
    setActiveTypeId(id)
  }

  const renderTransactiondata = () => {
          switch (transactionIsLoading) {
            case apiStatus.res:
              return (
                <TransactionsList activeTypeId = {activeTypeId} />
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
          {!showDeletePopup && !showTransactionPopup && !showUpdatePopup && (
            <ul className="transactiontype-crd">
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
