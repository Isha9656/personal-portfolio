import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';
import CustomCursor from '../CustomCursor/CustomCursor';

const LandingLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);


  return (
    <>
      {isLoading ? <Preloader /> : (
        <div>
          <CustomCursor />
          <Outlet />
        </div>
      )
      }
    </>
  )
}
export default LandingLayout;
