import React, { useRef } from "react"
import { TransactionStore } from "../../store";

const transaction: any = class{}

export const StoreContext = React.createContext({
    transaction,
})

const StoreProvider = ({children}: any) => {
    const transaction = useRef(new TransactionStore())
    return (
        <StoreContext.Provider value = {{transaction}}>{children}</StoreContext.Provider>
    )
}

export default StoreProvider