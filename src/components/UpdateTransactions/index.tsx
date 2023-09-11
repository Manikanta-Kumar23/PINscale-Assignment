import React , { useContext,  useEffect,  useState } from "react";
import { format, parseISO , parse } from "date-fns";
import { RxCross2 } from "react-icons/rx";
import {  observer } from "mobx-react";

import {ResourceContext} from "../../context/ResourceContext";
import { useStoreProvider } from "../../context/StoreContext";
import useUserId from "../../hooks/useUserId";
import "./index.css";
import { TransactionModel  } from "../../store";

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
  const [nameErr , setNameErr] = useState(false)
  const [nameErrMssg , setNameErrMssg] = useState("")
  const [catErr , setCatErr] = useState(false)
  const [catErrMssg , setCatErrMssg] = useState("")
  const [amntErr , setAmntErr] = useState(false)
  const [amntErrMssg , setAmntErrMssg] = useState("")
  const [dateErr , setDateErr] = useState(false)
  const [dateErrMssg , setDateErrMssg] = useState("")
  const [typeErr , setTypeErr] = useState(false)
  const [typeErrMssg ,setTypeErrMssg]  =useState("")
  const userId = useUserId()
  const {
    showUpdatePopup,
    onCancel, apiCall
  } = useContext(ResourceContext)
  const transaction = useStoreProvider()
  const [updateSuccessMssg , setUpdateSuccessMssg] = useState(false)

  const onBlurName = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
        setNameErr(true)
        setNameErrMssg("*Required")
    } else if (event.target.value.length > 30) {
        setNameErr(true)
        setNameErrMssg("Max limit 30 Characters")
    } else {
        setNameErr(false)
    }
  };

  const onBlurCat = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "null") {
        setCatErr(true)
        setCatErrMssg("*Required")
    } else {
        setCatErr(false)
    }
  };

  const onBlurType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "null") {
        setTypeErr(true)
        setTypeErrMssg("*Required")
    } else {
        setTypeErr(false)
    }
  };

  const onBlurAmount = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
        setAmntErr(true)
        setAmntErrMssg("*Required")
    } else if (parseInt(event.target.value) === 0) {
        setAmntErr(true)
        setAmntErrMssg("Amount should be > 0")
    } else {
        setAmntErr(false)
    }
  };

  const onBlurDate = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
    } else {
        setDateErr(true)
        setDateErrMssg("*Required")
        setDateErr(false)
    }
  };
  const [updateTransactionModel]    = useState(() => {
    const {transactionName , type , category , amount , date , id} = transaction.updateList
    return new TransactionModel(transactionName , type , category , amount , date , id)
  })
  useEffect(() => {
    if (transaction.updateList.transactionName && transaction.updateList.type && transaction.updateList.category && transaction.updateList.amount && transaction.updateList.date) {
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
            console.log(list)
            transaction.updateTransactionList(list)
            setUpdateSuccessMssg(true)
            apiCall()
          };
          const close = () => {
            onCancel();
            setUpdateSuccessMssg(false)
            setCatErr(false)
            setTypeErr(false)
            setNameErr(false)
            setAmntErr(false)
            setDateErr(false)
          };
          return (
              showUpdatePopup && (
                <div className="add-transactions">
                  <form onSubmit={onUpdateTransaction} className="add-form-crd">
                    <div className="frm-head">
                      {!updateSuccessMssg && (
                        <div className="hed-crd">
                          <h1 className="heading">Update Transaction</h1>
                          <p className="para">
                            You can update your transaction here.
                          </p>
                        </div>
                      )}
                      <button
                        className="cancel-btn"
                        onClick={close}
                        type="button"
                      >
                        <RxCross2 color="#718EBF" size="19" />
                      </button>
                    </div>
                    {updateSuccessMssg === false ? (
                      <>
                        <div className="data-crd">
                          <div className="label-crd">
                            <label className="add-label" htmlFor="transc-name">
                              Transaction Name
                            </label>
                            <input
                              className="add-transc-name"
                              onBlur={onBlurName}
                              onChange={(event) => updateTransactionModel.setName(event.target.value)}
                              value={updateTransactionModel.transactionName}
                              type="text"
                              id="transc-name"
                              placeholder="Enter Name"
                            />
                            {nameErr && (
                              <p className="transc-err">{nameErrMssg}</p>
                            )}
                          </div>
                          <div className="label-crd">
                            <label className="add-label" htmlFor="transc-type">
                              Transaction Type
                            </label>
                            <select
                              onBlur={onBlurType}
                              value={updateTransactionModel.type}
                              onChange={(event)=> updateTransactionModel.setType(event.target.value)}
                              className="add-transc-name"
                              id="transc-type"
                            >
                              <option value="null">
                                Select Transaction Type
                              </option>
                              <option value="credit">Credit</option>
                              <option value="debit">Debit</option>
                            </select>
                            {typeErr && (
                              <p className="transc-err">{typeErrMssg}</p>
                            )}
                          </div>
                          <div className="label-crd">
                            <label className="add-label" htmlFor="transc-type">
                              Transaction Category
                            </label>
                            <select
                              onChange={(event)=> updateTransactionModel.setCategory(event.target.value)}
                              onBlur={onBlurCat}
                              value={updateTransactionModel.category}
                              className="add-transc-name"
                              id="transc-type"
                            >
                              {transactionCategoryTypes.map((each) => (
                                <option value={each.value} key={each.value}>
                                  {each.name}
                                </option>
                              ))}
                            </select>
                            {catErr && <p className="transc-err">{catErrMssg}</p>}
                          </div>
                          <div className="label-crd">
                            <label className="add-label" htmlFor="transc-amount">
                              Amount
                            </label>
                            <input
                              onBlur={onBlurAmount}
                              onChange={(event)=> updateTransactionModel.setAmount(event.target.value)}
                              value={updateTransactionModel.amount}
                              className="add-transc-name"
                              type="number"
                              id="transc-amount"
                              placeholder="Enter Amount"
                            />
                            {amntErr && (
                              <p className="transc-err">{amntErrMssg}</p>
                            )}
                          </div>
                          <div className="label-crd">
                            <label className="add-label" htmlFor="transc-date">
                              Date
                            </label>
                            <input
                              onBlur={onBlurDate}
                              onChange={(event)=> updateTransactionModel.setDate(event.target.value)}
                              value = {updateTransactionModel.date !== undefined ? format(parseISO(updateTransactionModel.date),"yyyy-MM-dd") : format(parseISO(transaction.updateList.date),"yyyy-MM-dd")}
                              className="add-transc-name"
                              type="date"
                              id="transc-date"
                              placeholder="Enter Date"
                            />
                            {dateErr && (
                              <p className="transc-err">{dateErrMssg}</p>
                            )}
                          </div>
                        </div>
                        <button className="add-transaction-btn" type="submit">
                          Update Transaction
                        </button>
                      </>
                    ) : (
                      <div className="add-suc-crd">
                        <h1 className="add-suc">
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
