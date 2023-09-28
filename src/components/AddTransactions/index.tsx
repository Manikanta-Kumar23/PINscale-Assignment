import { useContext, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { format, parse } from "date-fns";
import { observer } from "mobx-react";

import { ResourceContext } from "../../context/ResourceContext";
import { useStoreProvider } from "../../context/StoreContext";
import useUserId from "../../hooks/useUserId";
import { TransactionModel } from "../../store";

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
  const [isNameErr, setIsNameErr] = useState(false);
  const [nameErrMssg, setNameErrMssg] = useState("");
  const [isCategoryErr, setIsCategoryErr] = useState(false);
  const [categoryErrMssg, setCategoryErrMssg] = useState("");
  const [isAmountErr, setIsAmountErr] = useState(false);
  const [amountErrMssg, setAmountErrMssg] = useState("");
  const [isDateErr, setIsDateErr] = useState(false);
  const [dateErrMssg, setDateErrMssg] = useState("");
  const [isTypeErr, setIsTypeErr] = useState(false);
  const [typeErrMssg, setTypeErrMssg] = useState("");
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const userId = useUserId();
  const { shouldShowAddTransactionPopup, onCancel, apiCall } =
    useContext(ResourceContext);
  const transaction = useStoreProvider();

  const onBlurName = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setIsNameErr(true);
      setNameErrMssg("*Required");
    } else if (event.target.value.length > 30) {
      setIsNameErr(true);
      setNameErrMssg("Max limit 30 Characters");
    } else {
      setIsNameErr(false);
    }
  };

  const onBlurCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "null") {
      setIsCategoryErr(true);
      setCategoryErrMssg("*Required");
    } else {
      setIsCategoryErr(false);
    }
  };

  const onBlurType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "null") {
      setIsTypeErr(true);
      setTypeErrMssg("*Required");
    } else {
      setIsTypeErr(false);
    }
  };

  const onBlurAmount = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setIsAmountErr(true);
      setAmountErrMssg("*Required");
    } else if (parseInt(event.target.value) === 0) {
      setIsAmountErr(true);
      setAmountErrMssg("Amount should be > 0");
    } else {
      setIsAmountErr(false);
    }
  };

  const onBlurDate = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setIsDateErr(true);
      setDateErrMssg("*Required");
    } else {
      setIsDateErr(false);
    }
  };
  const transactionName = "";
  const type = "";
  const category = "";
  const amount = "";
  const date = "";
  const id = "";
  const addTransactionModel = useRef(
    new TransactionModel(transactionName, type, category, amount, date, id),
  );
  const onAddTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      addTransactionModel.current.transactionName !== "" &&
      addTransactionModel.current.type !== "" &&
      addTransactionModel.current.category !== "" &&
      addTransactionModel.current.amount !== "" &&
      addTransactionModel.current.date !== ""
    ) {
      let formatDate;
      if (addTransactionModel.current.date !== "") {
        const parsedDate = parse(
          addTransactionModel.current.date,
          "yyyy-MM-dd",
          new Date(),
        );
        formatDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
      }
      const updateData = {
        name: addTransactionModel.current.transactionName,
        type: addTransactionModel.current.type,
        category: addTransactionModel.current.category,
        amount: addTransactionModel.current.amount,
        date: formatDate,
        user_id: userId,
      };
      const url =
        "https://bursting-gelding-24.hasura.app/api/rest/add-transaction";
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "user",
          "x-hasura-user-id": `${userId}`,
        },
        body: JSON.stringify(updateData),
      };
      const res = await fetch(url, options);
      const data = await res.json();
      if (res.ok) {
        const updatedData = data.insert_transactions_one;
        const addData = {
          transactionName: updatedData.transaction_name,
          type: updatedData.type,
          amount: updatedData.amount,
          category: updatedData.category,
          date: updatedData.date,
          id: updatedData.id,
        };
        transaction.addTransactionList(addData);
        setIsTransactionSuccess(true);
        apiCall();
      }
    } else {
      alert("All Input Fields are required?");
    }
  };
  const close = () => {
    onCancel();
    addTransactionModel.current.transactionName = "";
    addTransactionModel.current.type = "";
    addTransactionModel.current.category = "";
    addTransactionModel.current.amount = "";
    addTransactionModel.current.date = "";
    setIsCategoryErr(false);
    setIsTypeErr(false);
    setIsNameErr(false);
    setIsAmountErr(false);
    setIsDateErr(false);
    setIsTransactionSuccess(false);
  };
  return (
    shouldShowAddTransactionPopup && (
      <div className="add-transaction-card">
        <form onSubmit={onAddTransaction} className="add-transaction-form-card">
          <div className="form-header">
            {!isTransactionSuccess && (
              <div className="form-header-card">
                <h1 className="form-header-heading">Add Transaction</h1>
                <p className="form-header-para">
                  You can add your transaction here.
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
          {isTransactionSuccess === false ? (
            <>
              <div className="add-transaction-data-card">
                <div className="add-transaction-input-card">
                  <label className="add-transaction-label" htmlFor="transcName">
                    Transaction Name
                  </label>
                  <input
                    className="add-transaction-input"
                    onBlur={onBlurName}
                    onChange={(e) =>
                      addTransactionModel.current.setName(e.target.value)
                    }
                    value={addTransactionModel.current.transactionName}
                    type="text"
                    id="transcName"
                    placeholder="Enter Name"
                  />
                  {isNameErr && (
                    <p className="add-transaction-error">{nameErrMssg}</p>
                  )}
                </div>
                <div className="add-transaction-input-card">
                  <label className="add-transaction-label" htmlFor="transcType">
                    Transaction Type
                  </label>
                  <select
                    onBlur={onBlurType}
                    value={addTransactionModel.current.type}
                    onChange={(event) =>
                      addTransactionModel.current.setType(event.target.value)
                    }
                    className="add-transaction-input"
                    id="transcType"
                  >
                    <option value="null">Select Transaction Type</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                  {isTypeErr && (
                    <p className="add-transaction-error">{typeErrMssg}</p>
                  )}
                </div>
                <div className="add-transaction-input-card">
                  <label className="add-transaction-label" htmlFor="transcCat">
                    Transaction Category
                  </label>
                  <select
                    onChange={(event) =>
                      addTransactionModel.current.setCategory(
                        event.target.value,
                      )
                    }
                    onBlur={onBlurCategory}
                    value={addTransactionModel.current.category}
                    className="add-transaction-input"
                    id="transcCat"
                  >
                    {transactionCategoryTypes.map((each) => (
                      <option value={each.value} key={each.value}>
                        {each.name}
                      </option>
                    ))}
                  </select>
                  {isCategoryErr && (
                    <p className="add-transaction-error">{categoryErrMssg}</p>
                  )}
                </div>
                <div className="add-transaction-input-card">
                  <label
                    className="add-transaction-label"
                    htmlFor="transcAmount"
                  >
                    Amount
                  </label>
                  <input
                    onBlur={onBlurAmount}
                    onChange={(event) =>
                      addTransactionModel.current.setAmount(event.target.value)
                    }
                    value={addTransactionModel.current.amount}
                    className="add-transaction-input"
                    type="number"
                    id="transcAmount"
                    placeholder="Enter Amount"
                  />
                  {isAmountErr && (
                    <p className="add-transaction-error">{amountErrMssg}</p>
                  )}
                </div>
                <div className="add-transaction-input-card">
                  <label className="add-transaction-label" htmlFor="transcDate">
                    Date
                  </label>
                  <input
                    onBlur={onBlurDate}
                    onChange={(event) =>
                      addTransactionModel.current.setDate(event.target.value)
                    }
                    value={addTransactionModel.current.date}
                    className="add-transaction-input"
                    type="date"
                    id="transcDate"
                    placeholder="Enter Date"
                  />
                  {isDateErr && (
                    <p className="add-transaction-error">{dateErrMssg}</p>
                  )}
                </div>
              </div>
              <button className="add-transaction-btn" type="submit">
                Add Transaction
              </button>
            </>
          ) : (
            <div className="add-transaction-success-card">
              <h1 className="add-transaction-success-heading">
                Transaction Added Successfully
              </h1>
            </div>
          )}
        </form>
      </div>
    )
  );
};

export default observer(AddTransactions);
