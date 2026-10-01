import "./Page404.scss";
import { Link } from "react-router-dom";
import { useEffect } from 'react';

const Page404 = () => {
  useEffect(() => {
    document.title = 'Page Not Found | Isha Kakadiya';
  }, []);

  return (
    <div className="st-page-not-found st-flex-center text-center">
      <div className="">
        <h1>4<span>0</span>4</h1>
        <h2>Page Not Found</h2>
        <p>The page may have moved, or the address may be incorrect.</p>
        <div className="st-page-not-found-actions">
          <Link to='/' className="st-btn st-style1 st-color1">Back home</Link>
          <Link to='/#portfolio' className="st-btn st-style1 st-color1 st-hero-secondary">View projects</Link>
        </div>
      </div>
    </div>
  )
}

export default Page404
