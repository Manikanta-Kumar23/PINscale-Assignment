import { useContext, useEffect } from "react";
import { useMachine } from "@xstate/react";

import LoadingWrapper from "../../common/LoadingWrapper";
import { ResourceContext } from "../../context/ResourceContext";
import { FetchMachine } from "../../machines/FetchingMachine";
import { UrlType, OptionsType } from "../../types";
import useUserId from "../../hooks/useUserId";
import { apiStatus } from "../../constants";
import FailureView from "../../common/FailureView";
import TransactionOverviewChart from "../TransactionOverviewChart";
import TransactionsList from "../TransactionsList";

import "./index.css";

interface CreditDataType {
  sum: number;
  type: string;
}
interface OverviewType {
  sum: number;
  type: string;
  date: string;
}
interface HomeProps {
  location: {
    pathname: string;
  };
}

const Home = (props: HomeProps) => {
  const userId = useUserId();
  const { location } = props;
  let limit: string;
  if (location.pathname === "/") {
    limit = "3";
  } else {
    limit = "0";
  }
  const {
    shouldShowAddTransactionPopup,
    shouldShowDeletePopup,
    shouldShowUpdatePopup,
    shouldShowLogoutPopup,
    apiCall,
    transacCurrent,
  } = useContext(ResourceContext);
  const [state, send] = useMachine(FetchMachine);
  const [current, sends] = useMachine(FetchMachine);

  let apiUrl: UrlType = { creditUrl: "", overviewUrl: "" };
  let apiOptions: OptionsType = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
    },
  };

  if (userId !== "3") {
    apiUrl = {
      ...apiUrl,
      creditUrl:
        "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals",
      overviewUrl:
        "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days",
    };
    apiOptions = {
      ...apiOptions,
      headers: {
        ...apiOptions.headers,
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
    };
  } else {
    apiUrl = {
      ...apiUrl,
      creditUrl:
        "https://bursting-gelding-24.hasura.app/api/rest/transaction-totals-admin",
      overviewUrl:
        "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-last-7-days-admin",
    };
    apiOptions = {
      ...apiOptions,
      headers: { ...apiOptions.headers, "x-hasura-role": "admin" },
    };
  }

  let creditData: CreditDataType[] = [];
  useEffect(() => {
    apiCall();
    send({ type: "Fetch", url: apiUrl.creditUrl, options: apiOptions });
    sends({ type: "Fetch", url: apiUrl.overviewUrl, options: apiOptions });
  }, []);
  if (state.value === apiStatus.res && userId !== "3") {
    creditData = state.context.fetchedData.totals_credit_debit_transactions;
  } else if (state.value === apiStatus.res && userId === "3") {
    creditData = state.context.fetchedData.transaction_totals_admin;
  }

  let overviewList: OverviewType[] = [];
  if (current.value === apiStatus.res && userId !== "3") {
    overviewList =
      current.context.fetchedData.last_7_days_transactions_credit_debit_totals;
  } else if (current.value === apiStatus.res && userId === "3") {
    overviewList =
      current.context.fetchedData.last_7_days_transactions_totals_admin;
  }

  const renderTotalCreditAndDebit = () => {
    switch (state.value) {
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
                      each.type.toLowerCase() === "debit" ? "debit-cost" : null
                    }`}
                  >
                    ${each.cost}
                  </h1>
                  <p className="transaction-type">{each.type}</p>
                </div>
                <img
                  className="totalcredit-card-image"
                  alt={`${each.type}`}
                  src={each.image}
                />
              </li>
            ))}
          </ul>
        );
      case apiStatus.inProgress:
        return <LoadingWrapper />;
      case apiStatus.rej:
        return <FailureView />;
      default:
        return null;
    }
  };

  const renderTransactions = () => {
    switch (transacCurrent.value) {
      case apiStatus.res:
        return (
          <div className="recent-transactions-card">
            <h1 className="recent-transaction-card-heading">
              Last Transaction
            </h1>
            <TransactionsList limit={limit} />
          </div>
        );
      case apiStatus.inProgress:
        return <LoadingWrapper />;
      case apiStatus.rej:
        return <FailureView />;
      default:
        return null;
    }
  };

  const renderTransactionOverviewCharts = () => {
    switch (current.value) {
      case apiStatus.res:
        return (
          <div className="overview-chart-card">
            <h1 className="overview-card-heading">Debit & Credit Overview</h1>
            {!shouldShowAddTransactionPopup &&
              !shouldShowUpdatePopup &&
              !shouldShowDeletePopup &&
              !shouldShowLogoutPopup && (
                <TransactionOverviewChart data={overviewList} />
              )}
          </div>
        );
      case apiStatus.inProgress:
        return <LoadingWrapper />;
      case apiStatus.rej:
        return <FailureView />;
      default:
        return null;
    }
  };
  return (
    <div className="main-content">
      {renderTotalCreditAndDebit()}
      {renderTransactions()}
      {renderTransactionOverviewCharts()}
    </div>
  );
};

export default Home;
