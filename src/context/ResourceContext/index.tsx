import React ,{ useState , useEffect } from "react";

import useUserId from "../../hooks/useUserId";
import { apiStatus } from "../../constants";
import { OptionsType } from "../../types";
import useDataFetching from "../../hooks/useDataFetching";

interface UserListType {
  name: string
  email: string
  country: string | null
  city: string
  id: number
  dateOfBirth?: string
  date_of_birth?: string
  permanentAddress?: string | null 
  permanent_address?:string | null
  postalCode?: string | null
  postal_code?: string | null
  presentAddress?: string | null
  present_address?: string | null
}

export const ResourceContext = React.createContext({
  userList: [] as UserListType[],
  isLoading: "",
  onClickTransaction: () => {},
  showTransactionPopup: false,
  onCancel: () => {},
  onClickEdit: () => {},
  showUpdatePopup: false,
  showSidebar: false,
  onShow: () => {},
  apiCall: () => {},
  showDeletePopup: false,
  onClickDelete: (a: any) => {} ,
  deleteTransacId: "" ,
  logoutPopup: false ,
  onLogClick: () => {} ,
  logoutPop: () => {},
  changeTypeId: (a: string) => {} ,
  activeTypeId: "" as string
});

const ResourceProvider = ({children}: any , props: any) => {
  const [showTransactionPopup , setShowTransactionPopup] = useState(false)
  const [showUpdatePopup , setShowUpdatePopup] = useState(false)
  const [showSidebar , setShowSidebar] = useState(false)
  const [showDeletePopup , setShowDeletePopup] = useState(false)
  const [deleteTransacId , setDeleteTransacId] = useState("")
  const [logoutPopup , setLogoutPopup] = useState(false)
  const [activeTypeId , setActiveTypeId] = useState("ALL TRANSACTIONS")

  const userId = useUserId()

  const userUrl = "https://bursting-gelding-24.hasura.app/api/rest/profile"
  const transactionsUrl =`https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0`
  let apiOptions: OptionsType = {method: "GET" , headers: {"content-type": "application/json",
  "x-hasura-admin-secret":
    "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",}}
    if ((userId) !== "3") {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "user",
      "x-hasura-user-id": `${userId}`,}}
    }
    else {
      apiOptions = {...apiOptions , headers: {...apiOptions.headers , "x-hasura-role": "admin"}}
    }

    const {data: userDataList ,  isLoading , fetchData: userDataApi} = useDataFetching()
    useEffect(() => {
      userDataApi(userUrl, apiOptions)
    } , [])
   
    let userList: UserListType[] = []
    if (isLoading === apiStatus.res) {
      userList = userDataList.users.map((each: UserListType) => {
        return {
          name: each.name,
          email: each.email,
          country: each.country,
          city: each.city,
          id: each.id,
          dateOfBirth: each.date_of_birth,
          permanentAddress: each.permanent_address,
          postalCode: each.postal_code,
          presentAddress: each.present_address,
        };
      });
    }

  const onClickTransaction = () => {
    setShowTransactionPopup(true)
};
const onClickDelete = (id: string) => {
  setDeleteTransacId(id)
  setShowDeletePopup(true)
}

const onCancel = () => {
  setShowTransactionPopup(false)
  setShowUpdatePopup(false)
  setShowDeletePopup(false)
  setLogoutPopup(false)
};
const apiCall = () => {
}
const onLogClick = () => {
  setLogoutPopup(true)
}
const logoutPop = () => {
  setLogoutPopup(false)
}

  const onShow = () => {
    setShowSidebar(s  => !s)
};

const onClickEdit = () => {
      setShowUpdatePopup(true)
};

const changeTypeId = (id: string) => {
  setActiveTypeId(id)
};
  return (<ResourceContext.Provider value = {{showTransactionPopup ,
                                              showUpdatePopup,
                                              showSidebar ,
                                              showDeletePopup ,
                                              deleteTransacId ,
                                              logoutPopup  ,
                                              activeTypeId  ,
                                              onClickTransaction ,
                                              onClickDelete ,
                                              onCancel ,
                                              onLogClick  ,
                                              logoutPop ,
                                              onShow ,
                                              onClickEdit ,
                                              changeTypeId ,
                                          apiCall ,
                                          userList ,
                                          isLoading }}>{children}</ResourceContext.Provider>)
}

export default (ResourceProvider);
