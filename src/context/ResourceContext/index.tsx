import React, { useState, useEffect } from "react";

import useUserId from "../../hooks/useUserId";
import { apiStatus } from "../../constants";
import { OptionsType } from "../../types";
import useDataFetching from "../../hooks/useDataFetching";
import { TransactionModel } from "../../store";
import { useStoreProvider } from "../StoreContext";
import { useMachine } from "@xstate/react";
import { FetchMachine } from "../../machines/FetchingMachine";

interface UserListType {
  name: string;
  email: string;
  country: string | null;
  city: string;
  id: number;
  dateOfBirth?: string;
  date_of_birth?: string;
  permanentAddress?: string | null;
  permanent_address?: string | null;
  postalCode?: string | null;
  postal_code?: string | null;
  presentAddress?: string | null;
  present_address?: string | null;
}
interface BackendTransactionModel {
  amount: string;
  category: string;
  id: string;
  type: string;
  date: string;
  transaction_name: string;
  user_id: string;
}
interface TransactionModels {
  amount: string;
  category: string;
  id: string;
  type: string;
  date: string;
  transactionName: string;
  userId: string;
}
interface TransactionModelType {
  amount: string;
  category: string;
  id: string;
  type: string;
  date: string;
  transactionName: string;
  userId: string;
}
interface DataType {
  fetchedTransactionData: TransactionModelType;
}

export const ResourceContext = React.createContext({
  transacCurrent: {} as any,
  userList: [] as UserListType[],
  isLoading: "",
  onClickAddTransaction: () => {},
  shouldShowAddTransactionPopup: false,
  onCancel: () => {},
  onClickEdit: () => {},
  shouldShowUpdatePopup: false,
  shouldShowSidebar: false,
  onShowSidebar: () => {},
  apiCall: () => {},
  shouldShowDeletePopup: false,
  onClickDelete: (a: any) => {},
  deleteTransacId: "",
  shouldShowLogoutPopup: false,
  onClickLogout: () => {},
  hideLogoutPop: () => {},
});

const ResourceProvider = ({ children }: any) => {
  const [shouldShowAddTransactionPopup, setShouldShowAddTransactionPopup] =
    useState(false);
  const [shouldShowUpdatePopup, setShouldShowUpdatePopup] = useState(false);
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const [shouldShowDeletePopup, setShouldShowDeletePopup] = useState(false);
  const [deleteTransacId, setDeleteTransacId] = useState("");
  const [shouldShowLogoutPopup, setShouldShowLogoutPopup] = useState(false);

  const userId = useUserId();
  const transaction = useStoreProvider();
  const [transacCurrent, transacSend] = useMachine(FetchMachine);

  const userUrl = "https://bursting-gelding-24.hasura.app/api/rest/profile";
  const transactionsUrl = `https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0`;
  let apiOptions: OptionsType = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret":
        "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
    },
  };
  if (userId !== "3") {
    apiOptions = {
      ...apiOptions,
      headers: {
        ...apiOptions.headers,
        "x-hasura-role": "user",
        "x-hasura-user-id": `${userId}`,
      },
    };
  } else {
    apiOptions = {
      ...apiOptions,
      headers: { ...apiOptions.headers, "x-hasura-role": "admin" },
    };
  }
  const {
    data: userDataList,
    isLoading,
    fetchData: userDataApi,
  } = useDataFetching();

  const apiCall = () => {
    return transacSend({
      type: "Fetch",
      url: transactionsUrl,
      options: apiOptions,
    });
  };
  useEffect(() => {
    userDataApi(userUrl, apiOptions);
  }, []);
  let transactionModel;
  if (transacCurrent.value === apiStatus.res) {
    transactionModel = transacCurrent.context.fetchedData.transactions.map(
      (each: BackendTransactionModel): TransactionModels => {
        return {
          transactionName: each.transaction_name,
          category: each.category,
          amount: each.amount,
          id: each.id,
          date: each.date,
          type: each.type,
          userId: each.user_id,
        };
      },
    );
    transactionModel = transactionModel.sort((a: any, b: any) =>
      new Date(b.date) < new Date(a.date) ? -1 : 1,
    );

    const data = transactionModel.map(
      (each: TransactionModelType) =>
        new TransactionModel(
          each.transactionName,
          each.type,
          each.category,
          each.amount,
          each.date,
          each.id,
          each.userId,
        ),
    );
    const fetchedData = data.map((each: DataType) => {
      return {
        transactionName: each.fetchedTransactionData.transactionName,
        type: each.fetchedTransactionData.type,
        amount: each.fetchedTransactionData.amount,
        date: each.fetchedTransactionData.date,
        id: each.fetchedTransactionData.id,
        userId: each.fetchedTransactionData.userId,
        category: each.fetchedTransactionData.category,
      };
    });
    transaction.createTransactionList(fetchedData);
  }

  let userList: UserListType[] = [];
  if (isLoading === apiStatus.res) {
    userList = userDataList.users.map((each: UserListType) => {
      return {
        name: each.name,
        email: each.email,
        country: each.country,
        city: each.city,
        id: each.id,
        dateOfBirth: each.date_of_birth,
        permanentAddress: each.permanent_address,
        postalCode: each.postal_code,
        presentAddress: each.present_address,
      };
    });
  }

  const onClickAddTransaction = () => {
    setShouldShowAddTransactionPopup(true);
  };
  const onClickDelete = (id: string) => {
    setDeleteTransacId(id);
    setShouldShowDeletePopup(true);
  };

  const onCancel = () => {
    setShouldShowAddTransactionPopup(false);
    setShouldShowUpdatePopup(false);
    setShouldShowDeletePopup(false);
    setShouldShowLogoutPopup(false);
  };
  const onClickLogout = () => {
    setShouldShowLogoutPopup(true);
  };
  const hideLogoutPop = () => {
    setShouldShowLogoutPopup(false);
  };

  const onShowSidebar = () => {
    setShouldShowSidebar((s) => !s);
  };

  const onClickEdit = () => {
    setShouldShowUpdatePopup(true);
  };

  return (
    <ResourceContext.Provider
      value={{
        shouldShowAddTransactionPopup,
        shouldShowUpdatePopup,
        shouldShowSidebar,
        shouldShowDeletePopup,
        deleteTransacId,
        shouldShowLogoutPopup,
        onClickAddTransaction,
        onClickDelete,
        onCancel,
        onClickLogout,
        hideLogoutPop,
        onShowSidebar,
        onClickEdit,
        apiCall,
        userList,
        isLoading,
        transacCurrent,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export default ResourceProvider;
