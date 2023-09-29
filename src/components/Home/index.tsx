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
          <ul className="flex flex-col md:flex-row justify-evenly items-center  w-[95%] p-[5px] m-[5px] list-none mt-[3%]">
            {transData.map((each) => (
              <li key={each.type} className="flex justify-between min-h-[170px] last:flex-row-reverse last:md:flex-row md:w-[45%] w-[95%] bg-[#ffffff] p-[5px_3px_5px_3px] rounded-[13px] m-[8px]">
                <div className="flex flex-col items-left ml-[3%]">
                  <h1
                    className={`font-[Arial, Helvetica, sans-serif] text-[32px] leading-[38.73px] text-[#16dbaa] p-[3px] m-[3px] mb-[0px] font-semibold ${
                      each.type.toLowerCase() === "debit" ? "text-[#fe5c73] text-[28px] leading-[30.26px]" : null
                    }`}
                  >
                    ${each.cost}
                  </h1>
                  <p className="font-[Arial, Helvetica, sans-serif] text-[16px] leading-[19.36px] text-[#718ebf] p-[3px] m-[3px] mt-[0px] font-normal">{each.type}</p>
                </div>
                <img
                  className="w-[182px] h-[161px] p-[5px] m-[5px]"
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
          <div className="w-[95%] flex flex-col m-[5px]">
            <h1 className="font-[Arial, Helvetica, sans-serif] text-[22px] leading-[26.63px] text-[#333b69] p-[5px] m-[5px] mb-[0px] ml-[3%] font-[600]">
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
          <div className="flex flex-col w-[95%] p-[5px] m-[5px] mb-[3%]">
            <h1 className="font-[Arial, Helvetica, sans-serif] text-[22px] leading-[26.63px] text-[#333b69] p-[5px] m-[3px] ml-[3%] font-[600]">Debit & Credit Overview</h1>
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
    <div className="overflow-auto">
      {renderTotalCreditAndDebit()}
      {renderTransactions()}
      {renderTransactionOverviewCharts()}
    </div>
  );
};

export default Home;
