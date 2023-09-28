import Cookies from "js-cookie";

const useUserId = () => {
  const userID: string | undefined = Cookies.get("id");
  return userID;
};

export default useUserId;
