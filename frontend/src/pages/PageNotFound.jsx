import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-lg">Oops! Page not found.</p>
      <Link to="/" className="mt-6 text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
};

export default PageNotFound;
