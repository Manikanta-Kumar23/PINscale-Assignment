import { Component } from "react";

import ResourceContext from "../../context/ResourceContext";

import { format, parseISO } from "date-fns";

import { RxCross2 } from "react-icons/rx";

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

class UpdateTransactions extends Component {
  state = {
    nameErr: false,
    nameErrMssg: "",
    catErr: false,
    catErrMssg: "",
    amntErr: false,
    amntErrMssg: "",
    dateErr: false,
    dateErrMssg: "",
    typeErr: false,
    typeErrMssg: "",
  };

  onBlurName = (event) => {
    if (event.target.value === "") {
      this.setState({
        nameErr: true,
        nameErrMssg: "*Required",
      });
    } else if (event.target.value.length > 30) {
      this.setState({
        nameErr: true,
        nameErrMssg: "Max limit 30 Characters",
      });
    } else {
      this.setState({
        nameErr: false,
      });
    }
  };

  onBlurCat = (event) => {
    if (event.target.value === "null") {
      this.setState({
        catErr: true,
        catErrMssg: "*Required",
      });
    } else {
      this.setState({
        catErr: false,
      });
    }
  };

  onBlurType = (event) => {
    if (event.target.value === "null") {
      this.setState({
        typeErr: true,
        typeErrMssg: "*Required",
      });
    } else {
      this.setState({
        typeErr: false,
      });
    }
  };

  onBlurAmount = (event) => {
    if (event.target.value === "") {
      this.setState({
        amntErr: true,
        amntErrMssg: "*Required",
      });
    } else if (parseInt(event.target.value) === 0) {
      this.setState({
        amntErr: true,
        amntErrMssg: "Amount should be > 0",
      });
    } else {
      this.setState({
        amntErr: false,
      });
    }
  };

  onBlurDate = (event) => {
    if (event.target.value === "") {
      this.setState({
        dateErr: true,
        dateErrMssg: "*Required",
      });
    } else {
      this.setState({
        dateErr: false,
      });
    }
  };

  render() {
    return (
      <ResourceContext.Consumer>
        {(value) => {
          const {
            showUpdatePopup,
            onCancel,
            onUpdateTransaction,
            updateTransactionName,
            updateTransactionType,
            updateTransactionCategory,
            updateTransactionAmount,
            updateTransactionDate,
            updateTransactionNameValue,
            updateTransactionTypeValue,
            updateTransactionCategoryValue,
            updateTransactionAmountValue,
            updateTransactionDateValue,
            updateSuccessMssg,
          } = value;
          const {
            nameErr,
            nameErrMssg,
            catErr,
            catErrMssg,
            typeErr,
            typeErrMssg,
            dateErr,
            dateErrMssg,
            amntErr,
            amntErrMssg,
          } = this.state;
          const updateTransc = (event) => {
            event.preventDefault();
            onUpdateTransaction(
              updateTransactionName,
              updateTransactionType,
              updateTransactionCategory,
              updateTransactionAmount,
              updateTransactionDate
            );
          };
          const nameChange = (event) => {
            updateTransactionNameValue(event.target.value);
          };
          const typeChange = (event) => {
            updateTransactionTypeValue(event.target.value);
          };
          const catChange = (event) => {
            updateTransactionCategoryValue(event.target.value);
          };
          const amntChange = (event) => {
            updateTransactionAmountValue(event.target.value);
          };
          const dateChange = (event) => {
            updateTransactionDateValue(event.target.value);
          };
          const close = () => {
            onCancel();
          };
          return (
            showUpdatePopup && (
              <div className="add-transactions">
                <form onSubmit={updateTransc} className="add-form-crd">
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
                            onBlur={this.onBlurName}
                            onChange={nameChange}
                            value={updateTransactionName}
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
                            onBlur={this.onBlurType}
                            value={updateTransactionType}
                            onChange={typeChange}
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
                            onChange={catChange}
                            onBlur={this.onBlurCat}
                            value={updateTransactionCategory}
                            className="add-transc-name"
                            id="transc-type"
                          >
                            {transactionCategoryTypes.map((each) => (
                              <option value={each.value} key={each.value}>
                                {each.name}
                              </option>
                            ))}
                            >
                          </select>
                          {catErr && <p className="transc-err">{catErrMssg}</p>}
                        </div>
                        <div className="label-crd">
                          <label className="add-label" htmlFor="transc-amount">
                            Amount
                          </label>
                          <input
                            onBlur={this.onBlurAmount}
                            onChange={amntChange}
                            value={updateTransactionAmount}
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
                            onBlur={this.onBlurDate}
                            onChange={dateChange}
                            value={format(
                              parseISO(updateTransactionDate),
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
        }}
      </ResourceContext.Consumer>
    );
  }
}

export default UpdateTransactions;
