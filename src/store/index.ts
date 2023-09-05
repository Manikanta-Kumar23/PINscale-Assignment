import { makeAutoObservable, observable , action ,  makeObservable} from "mobx";

interface TransactionModelType {
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
  export class TransactionModel {
    type = ""
    category = ""
    amount = ""
    id? = ""
    transactionName = ""
    userId? = ""
    date = ""
    fetchedTransactionData = {}
    constructor(transactionName: string  , type: string, category: string  , amount: string ,date: string , id?: string , userId?: string) {
      this.transactionName = transactionName 
      this.amount = amount
      this.type = type
      this.category = category
      this.date = date
      this.userId = userId
      this.id = id
        makeObservable(this , {
            fetchedTransactionData: observable ,
            transactionName: observable , 
            type: observable ,
            category: observable ,
            amount: observable ,
            date: observable , 
            userId: observable , 
            id: observable,
            setName: action.bound,
            setType: action , 
            setCategory: action , 
            setDate: action ,
            setAmount: action,
        })
        this.fetchedTransactionData = {transactionName , type , category , amount , date, id , userId}
    }
    setName(value: string) {
      this.transactionName = value
    }
    setType(value: string) {
      this.type = value
    }
    setCategory(value: string) {
      this.category = value
    }
    setAmount(value: string) {
      this.amount = value
    }
    setDate(value:string) {
      this.date = value
    }
  }

export class TransactionStore {
    transactionList: TransactionModelType[] = []
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
        updateList: observable,
        changeUpdateList: action,
      })
    }
    createTransactionList (data: TransactionModelType[]) {
      return this.transactionList = [...data]
    }
    addTransactionList (data: TransactionModelType) {
      return this.transactionList.push(data)
    }
    updateTransactionList (data: TransactionModelType) {
      const index = this.transactionList.findIndex((each) => each.id === data.id)
      return this.transactionList[index] = data
    }
    deleteTransactionList (data: TransactionModelType[]) {
      return this.transactionList = [...data]
    }
    changeUpdateList(data: TransactionModel) {
        this.updateList = {...data}
    }
  }