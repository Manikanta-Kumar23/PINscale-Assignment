import ThreeDots  from "react-loader-spinner";

const LoadingWrapper = () => {
    return (
        <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "13"
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
    )
}

export default LoadingWrapper