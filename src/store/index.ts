import { makeAutoObservable, observable , action ,  makeObservable} from "mobx";

interface TransactionType {
    transaction_name?: string
    user_id?:string
    amount: string
    category: string
    id: string
    type: string
    date: string
    transactionName?: string
    userId?: string
  }
  export class TransactionData {
    fetchedTransactionData = {}
    constructor(data: TransactionType) {
        this.fetchedTransactionData = {...data}
        makeObservable(this , {
            fetchedTransactionData: observable
        })
    }
    getFetchedData() {
        console.log(this.fetchedTransactionData)
    }
  }

export class TransactionStore {
    transactionList: TransactionType[] = []
    transactionName = ""
    transactionCategory = ""
    transactionType = ""
    transactionAmount = ""
    transactionDate = ""
    updateList: any = {}
    
    constructor() {
      makeAutoObservable(this , {
        transactionList: observable,
        createTransactionList: action,
        updateTransactionList: action,
        deleteTransactionList: action,
        addTransactionList: action,
        transactionName: observable,
        transactionCategory: observable ,
        transactionAmount: observable,
        transactionDate: observable,
        transactionType: observable,
        nameChange: action,
        typeChange: action , 
        catChange: action , 
        dateChange: action ,
        amntChange: action,
        updateList: observable,
        changeUpdateList: action,
      })
    }
    createTransactionList (data: TransactionType[]) {
      return this.transactionList = [...data]
    }
    addTransactionList (data: TransactionType) {
      return this.transactionList.push(data)
    }
    updateTransactionList (data: TransactionType) {
      const index = this.transactionList.findIndex((each) => each.id === data.id)
      return this.transactionList[index] = data
    }
    deleteTransactionList (data: TransactionType[]) {
      return this.transactionList = [...data]
    }
    nameChange(value: any) {
      this.transactionName = value
    }
    typeChange(value: any) {
      this.transactionType = value
    }
    catChange(value: any) {
      this.transactionCategory = value
    }
    amntChange(value: any) {
      this.transactionAmount = value
    }
    dateChange(value: any) {
      this.transactionDate = value
    }
    changeUpdateList(data: TransactionType) {
        this.updateList = {...data}
    }
    updateName(value: string) {
      this.updateList.transactionName = value
    }
    updateType(value: string) {
      this.updateList.type = value
    }
    updateAmnt(value: string) {
      this.updateList.amount = value
    }
    updateCat(value: string) {
      this.updateList.category = value
    }
    updateDate(value: any) {
      this.updateList.date = value
    }
  }