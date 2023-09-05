import { useContext, useEffect } from "react";
import ThreeDots  from  'react-loader-spinner'
import {  Observer } from "mobx-react-lite" 

import { StoreContext } from "../../context/StoreContext";
import FailureView from "../FailureView";
import useUserId from "../../hooks/useUserId";
import { apiStatus } from "../../constants";
import { TransactionModel } from "../../store";
import { OptionsType } from "../../types";
import TransactionsList from "../TransactionsList";

import "./index.css";
import useDataFetching from "../../hooks/useDataFetching";

interface TransactionModels {
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
interface TransactionModelType {
  amount: string
  category: string
  id: string
  type: string
  date: string
  transactionName: string
  userId?: string
}

const Transactions = () => {
  const userId = useUserId()
  const {transaction} = useContext(StoreContext)
  const transactionsUrl =`https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0`
  let apiOptions: OptionsType = {method: "GET" , headers: {"content-type": "application/json",
  "x-hasura-admin-secret":
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",}}
    if ((userId) !== "3") {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "user",
      "x-hasura-user-id": `${userId}`,}}
    }
    else {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "admin"}}
    }
    const {data: transactionDataModel, isLoading: transactionIsLoading , fetchData: transactionDataApi} = useDataFetching()

  useEffect(() => {
    transactionDataApi(transactionsUrl , apiOptions)
  } , [])
  let transactionModel
  if (transactionIsLoading === apiStatus.res) {
  transactionModel = transactionDataModel.transactions.map((each: TransactionModels) => {
      return ({
        transactionName: each.transaction_name , 
        category: each.category ,
        amount: each.amount ,
        id: each.id,
        date: each.date ,
        type: each.type ,
        userId: each.user_id
      })
    })
    transactionModel = transactionModel.sort((a: any , b: any) => new Date(b.date) < new Date(a.date) ? -1 : 1)

    const data = transactionModel .map((each: TransactionModelType) => new TransactionModel(each.transactionName , each.type , each.category , each.amount  , each.date , each.id , each.userId))
      transaction.current.createTransactionList(data)
  }

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
