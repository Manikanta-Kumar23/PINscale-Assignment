import { useEffect,useState} from "react"

const apiStatus = {
    res: "SUCCESS",
    rej: "FAIL",
    inProgress: "PENDING",
    initial: "",
  };

const useDataFetching = (url , options) => {
    const [data , setData] = useState([])
    const [isLoading , setIsLoading] = useState(apiStatus.initial)
    useEffect(() => {
        setIsLoading(apiStatus.inProgress)
        const option = options
        async function fetchData() {
            const res = await fetch(url , option)
                const data = await res.json()
                if (res.ok) {
                    setData(data)
                    setIsLoading(apiStatus.res)
                }
                else {
                    setIsLoading(apiStatus.rej)
                }
            }
        fetchData()
        
  // eslint-disable-next-line react-hooks/exhaustive-deps
        } , []) 
    return ({data , isLoading})
}

export default useDataFetching