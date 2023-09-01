export interface UrlType {
    creditUrl: string
    overviewUrl: string
  }
  interface HeaderType  {
    "content-type": string
    "x-hasura-admin-secret": string
    "x-hasura-role"?: string
    "x-hasura-user-id"?: string

  }
 export  interface OptionsType  {
    method: string
    headers: HeaderType
  }