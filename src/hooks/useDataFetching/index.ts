import { useState } from "react";
import { apiStatus } from "../../constants";

const useDataFetching = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<string>(apiStatus.initial);
  const fetchData = async (url: string, options: object) => {
    setIsLoading(apiStatus.inProgress);
    const res = await fetch(url, options);
    const data = await res.json();
    if (res.ok) {
      setData(data);
      setIsLoading(apiStatus.res);
    } else {
      setIsLoading(apiStatus.rej);
    }
  };
  return { data, isLoading, fetchData };
};

export default useDataFetching;
