import { useMachine } from "@xstate/react"
import { FetchMachine } from "../../machines/FetchingMachine"
import useUserId from "../../hooks/useUserId"
import {useEffect} from "react"

const Xstate = () => {
    const userId = useUserId()
    const [state , send] = useMachine(FetchMachine ,
        {
            services: {
                fetchApi: async () => {

                    const creditUrl = `https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0`
                    const options = {method: 'GET' , headers: {"content-type": "application/json",
                    "x-hasura-admin-secret":
                      "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
                      "x-hasura-role": "user",
                      "x-hasura-user-id": `${userId}`}}
                      const res = await fetch(creditUrl , options)
                      const data = await res.json()
                      if (res.ok) {
                        return data
                      }
                      else {
                        throw new Error
                      }
                }
            }
        })
        useEffect(() => {
            send("transacFetch")
        })
        console.log(state.context)
    return (
        <div>
            <h1>{JSON.stringify(state.value)}</h1>
            <h1>{JSON.stringify(state.context.fetchedData)}</h1>
        </div>
    )
}

export default Xstate