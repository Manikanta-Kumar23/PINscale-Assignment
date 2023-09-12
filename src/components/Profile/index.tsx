import ThreeDots  from "react-loader-spinner";

import FailureView from "../FailureView";
import useDataFetching from "../../hooks/useDataFetching";
import useUserId from "../../hooks/useUserId";
import {OptionsType} from "../../types"
import { imagesUrl  ,apiStatus } from "../../constants";

import "./index.css";
import { useEffect } from "react";

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
    useEffect(() =>{
      profileData(url , options)
    } , [])

  const renderUserData = () => {
    const id = (userId);
    switch (isLoading) {
      case apiStatus.res:
        const userList = userDataList.users
        return (
          <div className="user-data">
            <img
              className="pro-icon"
              alt="profile-icon"
              src={imagesUrl.find((user) => user.id === userId)?.url}
            />
            <div className="inf-card">
              <div className="nae-card">
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="ur-name">
                    Your Name
                  </label>
                  <p className="pro-name" id="ur-name">
                    {id !== "3" ? userList[0].name : userList[2].name}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="name">
                    User Name
                  </label>
                  <p className="pro-name" id="name">
                    {id !== "3" ? userList[0].name : userList[2].name}
                  </p>
                </div>
              </div>
              <div className="nae-card">
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="email">
                    Email
                  </label>
                  <p className="pro-name" id="email">
                    {id !== "3"? userList[0].email : userList[2].email}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="pswd">
                    Password
                  </label>
                  <p className="pro-name" id="pswd">
                    ********
                  </p>
                </div>
              </div>
              <div className="nae-card">
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="birth">
                    Date Of Birth
                  </label>
                  <p className="pro-name" id="birth">
                    {id !== "3"
                      ? userList[0].dateOfBirth
                      : userList[2].dateOfBirth}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="address">
                    Present Address
                  </label>
                  <p className="pro-name" id="address">
                    {id !== "3"
                      ? userList[0].presentAddress === null && "N/A"
                      : userList[2].presentAddress === null && "N/A"}
                  </p>
                </div>
              </div>
              <div className="nae-card">
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="Prem-address">
                    Permanent Address
                  </label>
                  <p className="pro-name" id="prem-address">
                    {id !== "3"
                      ? userList[0].permanentAddress === null && "N/A"
                      : userList[2].permanentAddress === null && "N/A"}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="city">
                    City
                  </label>
                  <p className="pro-name" id="city">
                    {id !== "3"
                      ? userList[0].city === null && "N/A"
                      : userList[2].city === null && "N/A"}
                  </p>
                </div>
              </div>
              <div className="nae-card">
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="code">
                    Postal Code
                  </label>
                  <p className="pro-name" id="code">
                    {id !== "3"
                      ? userList[0].postalCode === null && "N/A"
                      : userList[2].postalCode === null && "N/A"}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="country">
                    Country
                  </label>
                  <p className="pro-name" id="country">
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="loader-container"
          >
            <ThreeDots
              height="80"
              width="80"
              radius={9}
              color="#4D78FF"
              type="ThreeDots"
              visible={true}
            />
          </div>
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
