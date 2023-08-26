import {useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { format, parse} from "date-fns";

import ResourceContext from "../../context/ResourceContext";
import useUserId from "../useUserId";

import "./index.css";

const transactionCategoryTypes = [
  { name: "Select", value: "null" },
  { name: "Entertainment", value: "Entertainment" },
  { name: "Shopping", value: "shopping" },
  { name: "Food", value: "food" },
  { name: "Gaming", value: "gaming" },
  { name: "Others", value: "others" },
];

const AddTransactions = () => {
  const [transactionName  ,setTransactionName] = useState("")
  const [transactionType , setTransactionType] = useState("")
  const [transactionDate , setTransactionDate] = useState("")
  const [transactionAmount , setTransactionAmount] = useState("")
  const [transactionCategory , setTransactionCategory] = useState("")
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

  const onTransactionName = (event) => {
      setTransactionName(event.target.value)
  };

  const onTransactionType = (event) => {
      setTransactionType(event.target.value)
  };

  const onTransactionCategory = (event) => {
      setTransactionCategory(event.target.value)
  };

  const onTransactionAmount = (event) => {
      setTransactionAmount(event.target.value)
  };

  const onTransactionDate = (event) => {
      setTransactionDate(event.target.value)
  };

  const onBlurName = (event) => {
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

  const onBlurCat = (event) => {
    if (event.target.value === "null") {
        setCatErr(true)
        setCatErrMssg("*Required")
    } else {
        setCatErr(false)
    }
  };

  const onBlurType = (event) => {
    if (event.target.value === "null") {
        setTypeErr(true)
        setTypeErrMssg("*Required")
    } else {
        setTypeErr(false)
    }
  };

  const onBlurAmount = (event) => {
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

  const onBlurDate = (event) => {
    if (event.target.value === "") {
        setDateErr(true)
        setDateErrMssg("*Required")
    } else {
        setDateErr(false)
    }
  };

    return (
      <ResourceContext.Consumer>
        {(value) => {
          const {
            showTransactionPopup,
            onCancel,
            transactionSuccessMssg,
            addTransactionToDatabase
          } = value;
          const onAddTransaction = async (event) => {
            event.preventDefault();
              if (transactionName !== "" &&
                transactionType !== "" &&
                transactionCategory !== "" &&
                transactionAmount!== "" &&
                transactionDate !== "") {
                  let formatDate
                  if (transactionDate !== "") {
                    const parsedDate = parse(transactionDate , "yyyy-MM-dd", new Date());
                    formatDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
                  }
                  const updateData = {name: transactionName,
                    type: transactionType,
                    category: transactionCategory,
                    amount: transactionAmount,
                    date: formatDate , user_id: userId}
                    await addTransactionToDatabase(updateData)
                }
                else {
                  alert("All Input Fields are required?");
                }
              setTransactionName("")
              setTransactionAmount("")
              setTransactionCategory("null")
              setTransactionType("null")
              setTransactionDate("")
          };
          const close = () => {
            onCancel();
          };
          return (
            showTransactionPopup && (
              <div className="add-transactions">
                <form onSubmit={onAddTransaction} className="add-form-crd">
                  <div className="frm-head">
                    {!transactionSuccessMssg && (
                      <div className="hed-crd">
                        <h1 className="heading">Add Transaction</h1>
                        <p className="para">
                          You can add your transaction here.
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
                  {transactionSuccessMssg === false ? (
                    <>
                      <div className="data-crd">
                        <div className="label-crd">
                          <label className="add-label" htmlFor="transc-name">
                            Transaction Name
                          </label>
                          <input
                            className="add-transc-name"
                            onBlur={onBlurName}
                            onChange={onTransactionName}
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
                            onChange={onTransactionType}
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
                            onChange={onTransactionCategory}
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
                            onChange={onTransactionAmount}
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
                            onChange={onTransactionDate}
                            value={transactionDate}
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
                        Add Transaction
                      </button>
                    </>
                  ) : (
                    <div className="add-suc-crd">
                      <h1 className="add-suc">
                        Transaction Added Successfully
                      </h1>
                    </div>
                  )}
                </form>
              </div>
            )
          );
        }}
      </ResourceContext.Consumer>
    );
}

export default AddTransactions;
