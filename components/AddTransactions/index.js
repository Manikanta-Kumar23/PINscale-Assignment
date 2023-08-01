import { Component } from "react";

import ResourceContext from "../../context/ResourceContext";

import { RxCross2 } from "react-icons/rx";

import "./index.css";

const transactionCategoryTypes = [
  { name: "Select", value: "null" },
  { name: "Entertainment", value: "Entertainment" },
  { name: "Shopping", value: "shopping" },
  { name: "Food", value: "food" },
  { name: "Gaming", value: "gaming" },
  { name: "Others", value: "others" },
];

class AddTransactions extends Component {
  state = {
    transactionName: "",
    transactionType: "",
    transactionDate: "",
    transactionAmount: "",
    transactionCategory: "",
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

  onTransactionName = (event) => {
    this.setState({
      transactionName: event.target.value,
    });
  };

  onTransactionType = (event) => {
    this.setState({
      transactionType: event.target.value,
    });
  };

  onTransactionCategory = (event) => {
    this.setState({
      transactionCategory: event.target.value,
    });
  };

  onTransactionAmount = (event) => {
    this.setState({
      transactionAmount: event.target.value,
    });
  };

  onTransactionDate = (event) => {
    this.setState({
      transactionDate: event.target.value,
    });
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
    console.log(event.target.value);
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
            showTransactionPopup,
            onCancel,
            onAddTransaction,
            transactionSuccessMssg,
          } = value;
          const {
            transactionName,
            transactionType,
            transactionCategory,
            transactionAmount,
            transactionDate,
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
          const addTransc = async (event) => {
            event.preventDefault();
            await onAddTransaction(
              transactionName,
              transactionType,
              transactionCategory,
              transactionAmount,
              transactionDate
            );
            this.setState({
              transactionName: "",
              transactionAmount: "",
              transactionCategory: "null",
              transactionType: "null",
              transactionDate: "",
            });
          };
          const close = () => {
            onCancel();
          };
          return (
            showTransactionPopup && (
              <div className="add-transactions">
                <form onSubmit={addTransc} className="add-form-crd">
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
                            onBlur={this.onBlurName}
                            onChange={this.onTransactionName}
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
                            onBlur={this.onBlurType}
                            value={transactionType}
                            onChange={this.onTransactionType}
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
                            onChange={this.onTransactionCategory}
                            onBlur={this.onBlurCat}
                            value={transactionCategory}
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
                            onChange={this.onTransactionAmount}
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
                            onBlur={this.onBlurDate}
                            onChange={this.onTransactionDate}
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
}

export default AddTransactions;
