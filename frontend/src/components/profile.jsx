import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { UserContext } from '../UserContext'
import '../styles/profile.css'

import imageLogo from '../images/Logo(color).png';

const Profile = () => {
    const { user } = useContext(UserContext);
    const userId = user?.id;

    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({
        username: '',
        firstName: '',
        lastName: ''
    });

    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(`/api/users/${userId}`);
                if (response.status === 200) {
                    setUserData(response.data);
                    setUpdatedData({
                        username: response.data.username,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName
                    });
                } else {
                    console.error('Failed to fetch user details: ', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching user details: ', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleChange = (e) => {
        setUpdatedData({
            ...updatedData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`/api/users/update/${userId}`, updatedData);
            if (response.status === 200) {
                setUserData(response.data);
                setIsEditing(false);

                navigate(0);
            } else {
                console.error('Failed to update profile:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

  return (
    <div className='profile-container'>
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

       {userData ? (
                <div className='profile-details'>
                    {isEditing ? (
                        <div>
                            <label><strong>Username:</strong></label>
                            <input
                                type="text"
                                name="username"
                                value={updatedData.username}
                                onChange={handleChange}
                            />

                            <label><strong>First Name:</strong></label>
                            <input
                                type="text"
                                name="firstName"
                                value={updatedData.firstName}
                                onChange={handleChange}
                            />

                            <label><strong>Last Name:</strong></label>
                            <input
                                type="text"
                                name="lastName"
                                value={updatedData.lastName}
                                onChange={handleChange}
                            />

                            <p><strong>Email:</strong> {userData.email} (Cannot be changed)</p>

                            <button onClick={handleUpdate}>Save Changes</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Username:</strong> {userData.username}</p>
                            <p><strong>First Name:</strong> {userData.firstName}</p>
                            <p><strong>Last Name:</strong> {userData.lastName}</p>
                            <p><strong>Email:</strong> {userData.email} (Cannot be changed)</p>

                            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
    </div>
  );
};

export default Profile;
