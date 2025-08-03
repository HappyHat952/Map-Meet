import { useEffect } from "react";
import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();

  // navigate doesn't change, so this effect
  // just runs on component mount
  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 5000);
  }, [navigate])

  return (
    <>
      <h1>404: This page could not be found</h1>
      <p>You will be redirected back to the 
        home page after five seconds
      </p>
    </>
  );
};

export default PageNotFound;

