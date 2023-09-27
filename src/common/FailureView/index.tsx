import "./index.css";

const FailureView = () => (
  <div className="failure-card">
    <h1 className="failure-card-heading">
      Your Request cannot be processed right now.
    </h1>
    <p className="failure-card-para">
      Please refresh the page or try again later...
    </p>
  </div>
);

export default FailureView;
