import React , { useContext,  useEffect,  useState } from "react";
import { format, parseISO , parse } from "date-fns";
import { RxCross2 } from "react-icons/rx";
import {  observer } from "mobx-react";

import {ResourceContext} from "../../context/ResourceContext";
import { useStoreProvider } from "../../context/StoreContext";
import useUserId from "../../hooks/useUserId";
import { TransactionModel  } from "../../store";

import "./index.css";

const transactionCategoryTypes = [
  { name: "Select", value: "null" },
  { name: "Entertainment", value: "Entertainment" },
  { name: "Shopping", value: "shopping" },
  { name: "Food", value: "food" },
  { name: "Gaming", value: "gaming" },
  { name: "Others", value: "others" },
  { name: "Transfer", value: "transfer" },
];

const UpdateTransactions = () => {
  const [isNameErr , setIsNameErr] = useState(false)
  const [nameErrMssg , setNameErrMssg] = useState("")
  const [isCategoryErr , setIsCategoryErr] = useState(false)
  const [categoryErrMssg , setCategoryErrMssg] = useState("")
  const [isAmountErr , setIsAmountErr] = useState(false)
  const [amountErrMssg , setAmountErrMssg] = useState("")
  const [isDateErr , setIsDateErr] = useState(false)
  const [dateErrMssg , setDateErrMssg] = useState("")
  const [isTypeErr , setIsTypeErr] = useState(false)
  const [typeErrMssg ,setTypeErrMssg]  =useState("")
  const [isUpdateSuccess , setIsUpdateSuccess] = useState(false)
  const userId = useUserId()
  const {
    shouldShowUpdatePopup,
    onCancel, apiCall
  } = useContext(ResourceContext)
  const transaction = useStoreProvider()

  const onBlurName = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
        setIsNameErr(true)
        setNameErrMssg("*Required")
    } else if (event.target.value.length > 30) {
        setIsNameErr(true)
        setNameErrMssg("Max limit 30 Characters")
    } else {
        setIsNameErr(false)
    }
  };

  const onBlurCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "null") {
        setIsCategoryErr(true)
        setCategoryErrMssg("*Required")
    } else {
        setIsCategoryErr(false)
    }
  };

  const onBlurType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "null") {
        setIsTypeErr(true)
        setTypeErrMssg("*Required")
    } else {
        setIsTypeErr(false)
    }
  };

  const onBlurAmount = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
        setIsAmountErr(true)
        setAmountErrMssg("*Required")
    } else if (parseInt(event.target.value) === 0) {
        setIsAmountErr(true)
        setAmountErrMssg("Amount should be > 0")
    } else {
        setIsAmountErr(false)
    }
  };

  const onBlurDate = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
    } else {
        setIsDateErr(true)
        setDateErrMssg("*Required")
        setIsDateErr(false)
    }
  };
  const [updateTransactionModel]    = useState(() => {
    const {transactionName , type , category , amount , date , id} = transaction.updateList
    return new TransactionModel(transactionName , type , category , amount , date , id)
  })
  useEffect(() => {
    const valuesAreNotUndefined = transaction.updateList.transactionName && transaction.updateList.type && transaction.updateList.category && transaction.updateList.amount && transaction.updateList.date
    if (valuesAreNotUndefined) {
    updateTransactionModel.setName(transaction.updateList.transactionName)
    updateTransactionModel.setAmount(transaction.updateList.amount)
    updateTransactionModel.setType(transaction.updateList.type)
    updateTransactionModel.setDate(transaction.updateList.date)
    updateTransactionModel.setCategory(transaction.updateList.category)
  }
  } , [transaction.updateList])
  const onUpdateTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const parsedDate = parse(updateTransactionModel.date.slice(0 , 10), "yyyy-MM-dd", new Date());
            const formatDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
            const data = {id: transaction.updateList.id , 
            date: formatDate , type:updateTransactionModel.type , name: updateTransactionModel.transactionName , category: updateTransactionModel.category , amount: updateTransactionModel.amount}
            const url = "https://bursting-gelding-24.hasura.app/api/rest/update-transaction"
            const options =  {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-hasura-admin-secret":
                  "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
                "x-hasura-role": "user",
                "x-hasura-user-id": `${userId}`,
              },
              body: JSON.stringify(data),
            };
            const res = await fetch(url, options);
            const updateDdata = await res.json()
            let transactionData = updateDdata.update_transactions_by_pk
            transactionData = {transactionName: transactionData.transaction_name , type: transactionData.type, category: transactionData.category , amount: transactionData.amount , date: transactionData.date , id: transactionData.id , userId: transactionData.user_id}
            const list = new TransactionModel(transactionData.transactionNme ,transactionData.type , transactionData.category , transactionData.amount  , transactionData.date , transactionData.id , transactionData.userId)
            transaction.updateTransactionList(list)
            setIsUpdateSuccess(true)
            apiCall()
          };
          const close = () => {
            onCancel();
            setIsUpdateSuccess(false)
            setIsCategoryErr(false)
            setIsTypeErr(false)
            setIsNameErr(false)
            setIsAmountErr(false)
            setIsDateErr(false)
          };
          return (
              shouldShowUpdatePopup && (
                <div className="add-transaction-card">
                  <form onSubmit={onUpdateTransaction} className="add-transaction-form-card">
                    <div className="form-header">
                      {!isUpdateSuccess && (
                        <div className="form-header-card">
                          <h1 className="form-header-heading">Update Transaction</h1>
                          <p className="form-header-para">
                            You can update your transaction here.
                          </p>
                        </div>
                      )}
                      <button
                        className="add-transaction-cancel-btn"
                        onClick={close}
                        type="button"
                      >
                        <RxCross2 color="#718EBF" size="19" />
                      </button>
                    </div>
                    {isUpdateSuccess === false ? (
                      <>
                        <div className="add-transaction-data-card">
                          <div className="add-transaction-input-card">
                            <label className="add-transaction-label" htmlFor="updateTransacName">
                              Transaction Name
                            </label>
                            <input
                              className="add-transaction-input"
                              onBlur={onBlurName}
                              onChange={(event) => updateTransactionModel.setName(event.target.value)}
                              value={updateTransactionModel.transactionName}
                              type="text"
                              id="updateTransacName"
                              placeholder="Enter Name"
                            />
                            {isNameErr && (
                              <p className="add-transaction-error">{nameErrMssg}</p>
                            )}
                          </div>
                          <div className="add-transaction-input-card">
                            <label className="add-transaction-label" htmlFor="updateTransacType">
                              Transaction Type
                            </label>
                            <select
                              onBlur={onBlurType}
                              value={updateTransactionModel.type}
                              onChange={(event)=> updateTransactionModel.setType(event.target.value)}
                              className="add-transaction-input"
                              id="updateTransacType"
                            >
                              <option value="null">
                                Select Transaction Type
                              </option>
                              <option value="credit">Credit</option>
                              <option value="debit">Debit</option>
                            </select>
                            {isTypeErr && (
                              <p className="add-transaction-error">{typeErrMssg}</p>
                            )}
                          </div>
                          <div className="add-transaction-input-card">
                            <label className="add-transaction-label" htmlFor="updateTransacCat">
                              Transaction Category
                            </label>
                            <select
                              onChange={(event)=> updateTransactionModel.setCategory(event.target.value)}
                              onBlur={onBlurCategory}
                              value={updateTransactionModel.category}
                              className="add-transaction-input"
                              id="updateTransacCat"
                            >
                              {transactionCategoryTypes.map((each) => (
                                <option value={each.value} key={each.value}>
                                  {each.name}
                                </option>
                              ))}
                            </select>
                            {isCategoryErr && <p className="add-transaction-error">{categoryErrMssg}</p>}
                          </div>
                          <div className="add-transaction-input-card">
                            <label className="add-transaction-label" htmlFor="updateTransacAmnt">
                              Amount
                            </label>
                            <input
                              onBlur={onBlurAmount}
                              onChange={(event)=> updateTransactionModel.setAmount(event.target.value)}
                              value={updateTransactionModel.amount}
                              className="add-transaction-input"
                              type="number"
                              id="updateTransacAmnt"
                              placeholder="Enter Amount"
                            />
                            {isAmountErr && (
                              <p className="add-transaction-error">{amountErrMssg}</p>
                            )}
                          </div>
                          <div className="add-transaction-input-card">
                            <label className="add-transaction-label" htmlFor="updateTransacDate">
                              Date
                            </label>
                            <input
                              onBlur={onBlurDate}
                              onChange={(event)=> updateTransactionModel.setDate(event.target.value)}
                              value = {updateTransactionModel.date !== undefined ? format(parseISO(updateTransactionModel.date),"yyyy-MM-dd") : format(parseISO(transaction.updateList.date),"yyyy-MM-dd")}
                              className="add-transaction-input"
                              type="date"
                              id="updateTransacDate"
                              placeholder="Enter Date"
                            />
                            {isDateErr && (
                              <p className="add-transaction-error">{dateErrMssg}</p>
                            )}
                          </div>
                        </div>
                        <button className="add-transaction-btn" type="submit">
                          Update Transaction
                        </button>
                      </>
                    ) : (
                      <div className="add-transaction-success-card">
                        <h1 className="add-transaction-success-heading">
                          Transaction Updated Successfully
                        </h1>
                      </div>
                    )}
                  </form>
                </div>
              )
          );

}

export default observer(UpdateTransactions);
