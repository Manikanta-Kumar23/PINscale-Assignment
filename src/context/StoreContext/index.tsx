import React, { useContext, useRef } from "react";
import { TransactionStore } from "../../store";

export const StoreContext = React.createContext<TransactionStore | undefined>(
  undefined,
);

export const useStoreProvider = () => {
  const transaction = useContext(StoreContext);
  if (transaction === undefined) {
    throw new Error("Undefined Store Context");
  } else {
    return transaction;
  }
};

const StoreProvider = ({ children }: any) => {
  const transaction = useRef(new TransactionStore());
  return (
    <StoreContext.Provider value={transaction.current}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
