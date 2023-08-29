import Cookies from "js-cookie";

const useUserId = () => {
    const userID = Cookies.get("id")
    return userID
}

export default useUserId