import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RootBoundary = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

export default RootBoundary;
