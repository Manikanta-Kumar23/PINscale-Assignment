import {  useContext , useEffect } from "react";
import ThreeDots  from  'react-loader-spinner'
import {  Observer } from "mobx-react-lite" 

import FailureView from "../FailureView";
import { apiStatus } from "../../constants";
import TransactionsList from "../TransactionsList";

import "./index.css";
import { ResourceContext } from "../../context/ResourceContext";

const Transactions = () => {
  const {transactionIsLoading , apiCall} = useContext(ResourceContext)

  useEffect(() => {
    apiCall()
  } , [])

  const renderTransactiondata = () => {
          switch (transactionIsLoading) {
            case apiStatus.res:
              return (
                <TransactionsList />
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
