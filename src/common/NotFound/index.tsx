import { withRouter } from "react-router-dom";

import "./index.css";

const NotFound = (props: any) => {
  const { history } = props;
  const onHome = () => {
    history.push("/");
  };
  return (
    <div className="not-found-card">
      <img
        alt="not found"
        className="not-found-image"
        src="http://res.cloudinary.com/djwve85r0/image/upload/v1690820309/not-found-404-error-page-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector_uxjqbf.jpg"
      />
      <h1 className="not-found-card-heading">Page Not Found</h1>
      <p className="not-found-card-para">
        We are sorry, the page you requested could not be found
      </p>
      <button className="back-to-home-btn" onClick={onHome} type="button">
        Back to Home
      </button>
    </div>
  );
};

export default withRouter(NotFound);
