import "./index.css";

const FailureView = () => (
  <div className="failure-card">
    <h1 className="failure-head">
      Your Request cannot be processed right now.
    </h1>
    <p className="failure-para">
      Please refresh the page or try again later...
    </p>
  </div>
);

export default FailureView;
