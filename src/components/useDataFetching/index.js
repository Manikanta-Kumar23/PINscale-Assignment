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
    const fetchData = async ()  => {
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
    useEffect(() => {
        setIsLoading(apiStatus.inProgress)
        fetchData()
        
  // eslint-disable-next-line react-hooks/exhaustive-deps
        } , []) 
    return ({data , isLoading})
}

export default useDataFetching