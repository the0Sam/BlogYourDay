import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { useContext } from 'react';
import { UserContext } from '../UserContext';
import VlogCard from './vlogCard';

import '../styles/homePage.css';
import imageLogo from '../images/Logo(color).png';

const Homepage = () => {
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const [vlogs, setVlogs] = useState([]); 
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ notepad, setNotepad ] = useState('');
  const [ notepadStatus, setNotepadStatus ] = useState('');

  const form = useRef();
  const [ formData, setFormData ] = useState({
    vlogTitle: "",
    description: "",
    vlogImage: null,
    previewImage: null,
  });

  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVlogs = async () => {
      try {
        const response = await axios.get(`/api/vlogs/allVlogs/${userId}`);

        if (response.status === 200) {  
          setVlogs(response.data);  
        } else {
          console.error('Failed to fetch vlogs:', response.data.message);  
        }

      } catch (error) {
        console.error('Error fetching vlogs: ', error);
      }
    };
    fetchVlogs();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`/api/users/${userId}`)
      .then(res => setNotepad(res.data.notepad || ''))
      .catch(err => console.error('Error fetching notepad: ', err));
  }, [userId]);

  const saveNotepad = async () => {
    if (!userId) return;
    setNotepadStatus('Saving...');
    try {
      await axios.put(`/api/users/update/${userId}`, { notepad });
      setNotepadStatus('Saved');
      setTimeout(() => setNotepadStatus(''), 1500);
    } catch (err) {
      console.error('Error saving notepad: ', err);
      setNotepadStatus('Failed to save');
    }
  };

  const handleChange = async (e) => {
    const {name, type} = e.target;

    if (type === "file") {
      const file = e.target.files[0];

      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          vlogImage: file,
          previewImage: URL.createObjectURL(file),
        }));
      }
    } else {
      setFormData({ 
        ...formData, 
        [e.target.name]: e.target.value, 
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      vlogImage: null,
      previewImage: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId){
      alert("please log in");
      return;
    }

    const formDataToSend = new FormData();

    // Append form data
    formDataToSend.append('vlogTitle', formData.vlogTitle);
    formDataToSend.append('description', formData.description);

    if (formData.vlogImage) {
      formDataToSend.append('vlogImage', formData.vlogImage);
    }

    try {
      const response = await axios.post(`/api/vlogs/users/${userId}/vlogs`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log('Vlog created: ', response.data);
        alert('Vlog created successfully');

        navigate(0);
      } else {
        throw new Error('Failed to create vlog');
      }

    } catch (error) {
      console.error('Error creating vlog: ', error);
      alert('Failed to create vlog');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className='homepage-container'>
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
      
      {/* Add Vlog Button */}
      <button className='add-vlog-btn' onClick={toggleModal}>
        Add Vlog
      </button>

      {/* Pop-Up Modal */}
      {isModalOpen && (
        <div className= 'modal-overlay'>
          <div className= 'modal-content'>
            <h2>Add Entry</h2>
            <form ref={form} onSubmit={handleSubmit}>

              <input type='text'  
                name='vlogTitle'
                placeholder='Vlog Title' 
                value={formData.vlogTitle}
                onChange={handleChange}
              />
            
              <div className='custom-file-upload'>
                {!formData.previewImage ? (
                  <>
                    <label htmlFor='vlogImage' className='upload-label'>Upload Image</label>
                    <input
                      type='file'
                      id='vlogImage'
                      name='vlogImage'
                      accept='image/*'
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  /* Show preview image if available */
                  <div className='image-preview'>
                    <img src={formData.previewImage} alt='preview' />
                    <button onClick={handleRemoveImage} className="remove-btn">Remove</button>
                  </div>
                )}

              </div>
              

              <textarea
                name='description' 
                placeholder='Enter description'
                value={formData.description}
                onChange={handleChange}
              />
            
              <div className='submit-cancel-btn'>
              <button type='submit'>Post</button>
              <button type='button' onClick={toggleModal}>Cancel</button>
              </div>
            </form>
          </div> 
        </div>
      )}

      <div className='content-wrapper'>
        <div className='vlog-list'>
          {Array.isArray(vlogs) && vlogs.length > 0 ? (
            vlogs.map((vlogs) => (
              <VlogCard
                key={vlogs._id}
                id={vlogs._id}
                title={vlogs.vlogTitle}
                vlogImage={vlogs.vlogImage} />
            ))
          ) : (
            <p>No vlogs!!</p>
          )}
        </div>

        <div className='checklist-container'>
          <h2>Notepad</h2>
          <textarea
            className='notepad-textarea'
            value={notepad}
            onChange={(e) => setNotepad(e.target.value)}
            onBlur={saveNotepad}
            placeholder='Jot down your thoughts...'
          />
          <div className='notepad-status'>{notepadStatus}</div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
