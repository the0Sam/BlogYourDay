import React, { useContext, useRef,  useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import imageLogo from '../images/Logo(color).png';
import loginImage from '../images/image-login.jpg';
import '../styles/login.css';

import { UserContext } from '../UserContext';

const Login = () => {
  
  const { setUser } = useContext(UserContext);
  const form = useRef();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation of login form input
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required!";
    if (!formData.password) newErrors.password = "Password is required!";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
          Object.values(newErrors).forEach((error) => {
            toast.error(error, { position: "top-right"});
          });
        return false;
    }

    return true;
  };
  
  // handle Changes to the input field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handling form submitted for login.
  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('/api/users/login', {
          username: formData.username,
          password: formData.password
        });
        console.log(response.data.user.email);

        const loggedUser = response.data.user;
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));

        navigate('/home');
        
      } catch (error) {
        console.log(error);

        if (error.response) {
          if (error.response.status === 400 ) {
            toast.error("Invalid username or password.", {
              position: "top-right",
            });
          } else if (error.response.status === 404) {
            toast.error("User does not exist.", {
              position: "top-right",
            });
          } else {
            toast.error("An unknown error occured. Please try again!", {
              position: "top-right",
            });
          }
        }
        setErrors('Error logging in');
      }
    }
  };


  return (
   <div className='container'>
      <ToastContainer />
        <nav>
          <img src={imageLogo} alt='My Vlog-logo' />
          <div>
            <Link to="/signup">Sign-Up</Link>
          
          </div>
        </nav>
      <div className='login'>
        <div>
          <img className='l-displayimage' src={loginImage} alt='login-image' />
        </div>
        <div className='login-formContainer'>
          <form ref={form} onSubmit={handleLogin} className='login-form'>
        
            <fieldset>
            <legend>Login</legend>
            <input 
              type='text' 
              name='username' 
              placeholder='Username' 
              value={formData.username} 
              onChange={handleChange} 
            />

            <input 
              type='password' 
              name='password' 
              placeholder='Password' 
              value={formData.password} 
              onChange={handleChange} 
            />

            <button type='submit'>Login</button>  

            </fieldset>
          </form>
          <p>
            Create an account with us &rarr; <a href='/signup'>Sign Up</a>
          </p>
        </div>
      </div> 
    </div>
  );
};

export default Login;
