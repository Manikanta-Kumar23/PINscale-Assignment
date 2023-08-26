import SideBar from "../SideBar";

import Navbar from "../Navbar";

import useDataFetching from "../DataFetching";

import { ThreeDots } from "react-loader-spinner";

import FailureView from "../FailureView";

import useUserId from "../UserId";

import "./index.css";

const apiStatus = {
  res: "SUCCESS",
  rej: "FAIL",
  inProgress: "PENDING",
  initial: "",
};

const imagesUrl = [
  {
    id: "1",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866080/1_lpiuao.jpg",
  },
  {
    id: "2",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/3_qucosn.png",
  },
  {
    id: "3",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/2_eldytb.png",
  },
  {
    id: "4",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/4_rcbfqe.jpg",
  },
  {
    id: "5",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/5_eh0vcd.jpg",
  },
  {
    id: "6",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/6_sjfjgn.png",
  },
  {
    id: "7",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/8_db8inh.png",
  },
  {
    id: "8",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/13_ndiaz0.jpg",
  },
  {
    id: "9",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/7_yl58qh.png",
  },
  {
    id: "10",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/9_jm7jij.png",
  },
  {
    id: "11",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/10_dsqqep.png",
  },
  {
    id: "12",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/15_p6p4f8.jpg",
  },
  {
    id: "13",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866077/11_ttbomw.jpg",
  },
  {
    id: "14",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866078/16_plswkt.jpg",
  },
  {
    id: "15",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866079/14_f7spqo.jpg",
  },
  {
    id: "16",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690771289/Group_206_lfmsk4.png",
  },
  {
    id: "17",
    url:
      "https://res.cloudinary.com/djwve85r0/image/upload/v1690866076/12_klifgi.jpg",
  },
];

const Profile = () => {
  const userId = useUserId()
  let url;
    let options;
    if (parseInt(userId) !== 3) {
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
    const profileData = useDataFetching(url , options)

  const userData = () => {
    const id = parseInt(userId);
    switch (profileData.isLoading) {
      case apiStatus.res:
        const userList = profileData.data.users
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
                    {id !== 3 ? userList[0].name : userList[2].name}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="name">
                    User Name
                  </label>
                  <p className="pro-name" id="name">
                    {id !== 3 ? userList[0].name : userList[2].name}
                  </p>
                </div>
              </div>
              <div className="nae-card">
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="email">
                    Email
                  </label>
                  <p className="pro-name" id="email">
                    {id !== 3 ? userList[0].email : userList[2].email}
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
                    {id !== 3
                      ? userList[0].dateOfBirth
                      : userList[2].dateOfBirth}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="address">
                    Present Address
                  </label>
                  <p className="pro-name" id="address">
                    {id !== 3
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
                    {id !== 3
                      ? userList[0].permanentAddress === null && "N/A"
                      : userList[2].permanentAddress === null && "N/A"}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="city">
                    City
                  </label>
                  <p className="pro-name" id="city">
                    {id !== 3
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
                    {id !== 3
                      ? userList[0].postalCode === null && "N/A"
                      : userList[2].postalCode === null && "N/A"}
                  </p>
                </div>
                <div className="pro-crd">
                  <label className="profile-label" htmlFor="country">
                    Country
                  </label>
                  <p className="pro-name" id="country">
                    {id !== 3
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
              radius="9"
              color="#4D78FF"
              ariaLabel="loading"
              wrapperStyle
              wrapperClass
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
      <div className="home-bg">
        <SideBar />
        <div className="home-content">
          <Navbar />
          <div className="main-content">{userData()}</div>
        </div>
      </div>
    );
}

export default Profile;
