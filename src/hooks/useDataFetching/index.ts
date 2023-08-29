import {useState} from "react"

const apiStatus = {
    res: "SUCCESS",
    rej: "FAIL",
    inProgress: "PENDING",
    initial: "",
  };

const useDataFetching = () => {
    const [data , setData] = useState<any>([])
    const [isLoading , setIsLoading] = useState(apiStatus.initial)
    const fetchData = async (url , options)  => {
                setIsLoading(apiStatus.inProgress)
                const res = await fetch(url , options)
                const data = await res.json()
                if (res.ok) {
                    setData(data)
                    setIsLoading(apiStatus.res)
                }
                else {
                    setIsLoading(apiStatus.rej)
                }
    }
    return ({data , isLoading , fetchData})
}

export default useDataFetching