import { useEffect } from "react";

import LoadingWrapper from "../../common/LoadingWrapper";
import FailureView from "../../common/FailureView";
import useDataFetching from "../../hooks/useDataFetching";
import useUserId from "../../hooks/useUserId";
import {OptionsType} from "../../types"
import { imagesUrl  ,apiStatus } from "../../constants";

import "./index.css";

const Profile = () => {
  const userId = useUserId()
  let url: string;
  let options: OptionsType;
  if ((userId) !== "3") {
    url = "https://bursting-gelding-24.hasura.app/api/rest/profile";
    options = {
      method: "GET",
      headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "user",
          "x-hasura-user-id": `${userId}`,
      },
    };
  } else {
      url = "https://bursting-gelding-24.hasura.app/api/rest/profile";
      options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "admin",
        },
      };
    }
    const {data:userDataList , isLoading , fetchData:profileData} = useDataFetching()
    useEffect(() => {
      profileData(url , options)
    } , [])

  const renderUserData = () => {
    const id = (userId);
    switch (isLoading) {
      case apiStatus.res:
        const userList = userDataList.users
        return (
          <div className="user-profile-card">
            <img
              className="profile-icon"
              alt="profile-icon"
              src={imagesUrl.find((user) => user.id === userId)?.url}
            />
            <div className="user-info-card">
              <div className="user-data-body">
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="urName">
                    Your Name
                  </label>
                  <p className="user-name-card-input" id="urName">
                    {id !== "3" ? userList[0].name : userList[2].name}
                  </p>
                </div>
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="name">
                    User Name
                  </label>
                  <p className="user-name-card-input" id="name">
                    {id !== "3" ? userList[0].name : userList[2].name}
                  </p>
                </div>
              </div>
              <div className="user-data-body">
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="email">
                    Email
                  </label>
                  <p className="user-name-card-input" id="email">
                    {id !== "3"? userList[0].email : userList[2].email}
                  </p>
                </div>
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="password">
                    Password
                  </label>
                  <p className="user-name-card-input" id="password">
                    ********
                  </p>
                </div>
              </div>
              <div className="user-data-body">
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="birth">
                    Date Of Birth
                  </label>
                  <p className="user-name-card-input" id="birth">
                    {id !== "3"
                      ? userList[0].dateOfBirth
                      : userList[2].dateOfBirth}
                  </p>
                </div>
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="address">
                    Present Address
                  </label>
                  <p className="user-name-card-input" id="address">
                    {id !== "3"
                      ? userList[0].presentAddress === null && "N/A"
                      : userList[2].presentAddress === null && "N/A"}
                  </p>
                </div>
              </div>
              <div className="user-data-body">
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="premanentAddress">
                    Permanent Address
                  </label>
                  <p className="user-name-card-input" id="premanentAddress">
                    {id !== "3"
                      ? userList[0].permanentAddress === null && "N/A"
                      : userList[2].permanentAddress === null && "N/A"}
                  </p>
                </div>
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="city">
                    City
                  </label>
                  <p className="user-name-card-input" id="city">
                    {id !== "3"
                      ? userList[0].city === null && "N/A"
                      : userList[2].city === null && "N/A"}
                  </p>
                </div>
              </div>
              <div className="user-data-body">
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <p className="user-name-card-input" id="postalCode">
                    {id !== "3"
                      ? userList[0].postalCode === null && "N/A"
                      : userList[2].postalCode === null && "N/A"}
                  </p>
                </div>
                <div className="user-name-card">
                  <label className="user-name-card-label" htmlFor="country">
                    Country
                  </label>
                  <p className="user-name-card-input" id="country">
                    {id !== "3"
                      ? userList[0].country === null && "N/A"
                      : userList[2].country === null && "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case apiStatus.inProgress:
        return (
          <LoadingWrapper />
        );
      case apiStatus.rej:
        return <FailureView />;
      default:
        return null;
    }
  };
    return (
      <div className="main-content">
      {renderUserData()}
      </div>
    );
}

export default Profile;
