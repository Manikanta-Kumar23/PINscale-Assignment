import React , { useContext, useState } from "react";
import { format, parseISO , parse } from "date-fns";
import { RxCross2 } from "react-icons/rx";

import ResourceContext from "../../context/ResourceContext";
import useUserId from "../../hooks/useUserId";
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
    onCancel,
    updateTransacList ,
    updateSuccessMssg,
    updateTransactionToDatabase
  } = useContext(ResourceContext)
  const [transactionName  ,setTransactionName] = useState(updateTransacList.transactionName)
  const [transactionType , setTransactionType] = useState(updateTransacList.type)
  const [transactionDate , setTransactionDate] = useState(updateTransacList.date)
  const [transactionAmount , setTransactionAmount] = useState(updateTransacList.amount)
  const [transactionCategory , setTransactionCategory] = useState(updateTransacList.category)

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
        setDateErr(true)
        setDateErrMssg("*Required")
    } else {
        setDateErr(false)
    }
  };
          const onUpdateTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const parsedDate = parse(updateTransacList.date, "yyyy-MM-dd", new Date());
            const formatDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
            const data = {...updateTransacList , 
            date: formatDate}
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
            updateTransactionToDatabase(updateDdata)
          };
          const close = () => {
            onCancel();
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
                            onChange={(event) => setTransactionName(event.target.value)}
                            value={transactionName}
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
                            value={transactionType}
                            onChange={(event)=> setTransactionType(event.target.value)}
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
                            onChange={(event)=> setTransactionCategory(event.target.value)}
                            onBlur={onBlurCat}
                            value={transactionCategory}
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
                            onChange={(event)=> setTransactionAmount(event.target.value)}
                            value={transactionAmount}
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
                            onChange={(event)=> setTransactionDate(event.target.value)}
                            value={format(
                              parseISO(transactionDate),
                              "yyyy-MM-dd"
                            )}
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

export default UpdateTransactions;
