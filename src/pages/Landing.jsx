import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const demoData = [
    { "imgLink": "./images/demo/demo1.jpg", "title": "Portfolio V1", "version": "/" },
    { "imgLink": "./images/demo/demo2.jpg", "title": "Portfolio V2", "version": "/home-v2" },
    { "imgLink": "./images/demo/demo3.jpg", "title": "Portfolio V3", "version": "/home-v3" },
    { "imgLink": "./images/demo/demo4.jpg", "title": "Portfolio V4", "version": "/home-v4" }
  ]
  return (
    <div className='st-demos'>
      {demoData.map((element, index) => (
        <div className="st-demo" key={index} style={{ backgroundImage: `url(${element.imgLink})` }}>
          <Link to={element.version} className="st-demo-link" target="_blank">
            <img src={element.imgLink} alt="" />
            <h2>{element.title}</h2>
          </Link>
        </div>
      ))}
    </div>
  )
}

{/* <Link to={element.version} className="st-demo-link" target="_blank">
  <img src={element.imgLink} alt="" />
  <h2>{element.title}</h2>
</Link> */}

export default Landing;
