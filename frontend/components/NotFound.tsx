import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="fixed profile-card-bg-color text-gray-200 top-0 left-0 w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-[10rem] about-title-family">404</h1>
      <h3 className="about-title-family">Page not found</h3>
      <p className="about-family">
        We're sorry, we couldn't find the page you requested.
      </p>
      <Link to="/">
        <button className="bg-blue txt-cyan px-4 py-2 m-4 w-48 border rounded-lg about-family">
          Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
