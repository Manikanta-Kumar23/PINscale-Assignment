import ThreeDots  from "react-loader-spinner";
import useUserId from "../../hooks/useUserId";
import useDataFetching from "../../hooks/useDataFetching";
import {ResourceContext} from "../../context/ResourceContext";
import FailureView from "../FailureView";
import TransactionOverviewChart from "../TransactionOverviewChart";
import TransactionsList from "../TransactionsList";
import "./index.css";
import  { useContext, useEffect } from "react";

import {UrlType , OptionsType} from "../../types"
import { apiStatus } from "../../constants";

interface CreditDataType {
  sum: number
  type: string
}
interface OverviewType {
  sum: number
  type: string
  date: string
}


const Home = (props: any) => {
  const userId = useUserId()
  const {location} = props
  let limit
  if (location.pathname === "/") {
    limit = 3
  }
  else {
    limit = undefined
  }
  const {
    showTransactionPopup,
    showDeletePopup,
    showUpdatePopup, logoutPopup , apiCall
  } = useContext(ResourceContext)


  let apiUrl: UrlType = {creditUrl: "" , overviewUrl : ""}
  let apiOptions: OptionsType = {method: 'GET' , headers: {"content-type": "application/json",
  "x-hasura-admin-secret":
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",}}

    if ((userId) !== "3") {
      apiUrl = {...apiUrl , creditUrl:"https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals" ,
              overviewUrl: "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days" }
      apiOptions = {...apiOptions , headers: {...apiOptions.headers ,"x-hasura-role": "user",
      "x-hasura-user-id": `${userId}`,}}
    }
    else {
      apiUrl = {...apiUrl , creditUrl:"https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin" ,
              overviewUrl: "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin" }
      apiOptions = {...apiOptions , headers: {...apiOptions.headers ,"x-hasura-role": "admin",}}
    }

    let creditData: CreditDataType[] = []
    const {data: creditedData , isLoading , fetchData: homeCreditData} = useDataFetching()
    const {data: overviewDataList , isLoading: overviewLoading  , fetchData: overviewData} = useDataFetching()
    useEffect(() => {
      homeCreditData(apiUrl.creditUrl , apiOptions)
      overviewData(apiUrl.overviewUrl , apiOptions)
      apiCall()
    } , [])
    if (isLoading === apiStatus.res && (userId) !== "3") {
      creditData = creditedData.totals_credit_debit_transactions
    }
    else if (isLoading === apiStatus.res && (userId) === "3") {
      creditData = creditedData.transaction_totals_admin
    }

    let overviewList: OverviewType[] = []
    if (overviewLoading === apiStatus.res && (userId) !== "3") {
      overviewList = overviewDataList.last_7_days_transactions_credit_debit_totals
    }
    else if (overviewLoading === apiStatus.res && (userId) === "3") {
      overviewList = overviewDataList.last_7_days_transactions_totals_admin;
    }

  const renderTotalCreditAndDebit = () => {
    switch (isLoading) {
      case apiStatus.res:
        let credit = 0;
        let debit = 0;
        creditData.map((each) => {
          if (each.type.toLowerCase() === "credit") {
            credit += each.sum;
            return credit;
          } else {
            debit += each.sum;
            return debit;
          }
        });
        const transData = [
          {
            cost: credit,
            type: "Credit",
            image:
              "https://res.cloudinary.com/djwve85r0/image/upload/v1690687006/Credit_sxyxmg.png",
          },
          {
            cost: debit,
            type: "Debit",
            image:
              "https://res.cloudinary.com/djwve85r0/image/upload/v1690687006/Debit_pribpg.png",
          },
        ];
        return (
          <ul className="totalcredit-card">
            {transData.map((each) => (
              <li key={each.type} className="credit-card">
                <div className="cost-card">
                  <h1
                    className={`cost ${
                      each.type.toLocaleLowerCase() === "debit" ? "debit-cost" : null
                    }`}
                  >
                    ${each.cost}
                  </h1>
                  <p className="transc-type">{each.type}</p>
                </div>
                <img
                  className="transc-img"
                  alt={`${each.type}`}
                  src={each.image}
                />
              </li>
            ))}
          </ul>
        );
      case apiStatus.inProgress:
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "13"
            }}
            className="loader-container"
          >
            <ThreeDots
              height="80"
              width="80"
              radius={9}
              color="#4D78FF"
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
  };

  const renderTransactionOverviewCharts = () => {
          switch (overviewLoading) {
            case apiStatus.res:
              return (
                <div className="chart-card">
                  <h1 className="overview">Debit & Credit Overview</h1>
                  {!showTransactionPopup && !showUpdatePopup && !showDeletePopup && !logoutPopup &&(
                    <TransactionOverviewChart data={overviewList} />
                  )}
                </div>
              );
            case apiStatus.inProgress:
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="loader-container"
                >
                  <ThreeDots
                    height="80"
                    width="80"
                    radius={9}
                    color="#4D78FF"
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
  };
    return (
      <div className="main-content">
        {renderTotalCreditAndDebit()}
        <div className="recent-card">
          {isLoading === apiStatus.res && (<h1 className="last-transc">Last Transaction</h1>)}
          <TransactionsList limit = {limit} />
        </div>
        {renderTransactionOverviewCharts()}
        </div>

    );
}

export default Home;
