import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import imageLogo from '../images/Logo(color).png';
import "../styles/homePage.css";

const VlogPage = () => {

  const { vlogId } = useParams();
  const [ vlog, setVlog ] = useState(null);

  useEffect(() => {
    const fetchVlog = async () => {
      try {
        const response = await axios.get(`/api/vlogs/${vlogId}`);
        if (response.status === 200) {
           setVlog(response.data);
        } else {
          console.error('Failed to fetch vlog details: ', response.data);
        }
      } catch (error) {
        console.error('Error fetching vlog details: ', error);
      }
    };

    fetchVlog();
  }, [vlogId]);

  if (!vlog) return <p>Loading ....</p>;

  return (
    <div>
      <nav>
        <img src={imageLogo} alt='My Vlog-logo' />
        <div className='search-container'>
          <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
          <input type='text' placeholder='Enter vlog title'/>
        </div>
        <div>
            <Link to="/logout">Log Out</Link>
            <Link to="/profile">Profile</Link>
        </div>
       </nav>
      <div className="vlogPage">
        <h2>{vlog.vlogTitle}</h2>
        <div className="img-container">
          {vlog.vlogImage && <img src={vlog.vlogImage} alt={vlog.vlogTitle} />}
        </div>
        <p>{vlog.description}</p>
      </div>
    </div>
  );
};

export default VlogPage;
