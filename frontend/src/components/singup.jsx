import React, { useRef, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { UserContext } from '../UserContext';

import imageLogo from '../images/Logo(color).png';
import imageSignup from '../images/image-signup.jpg';
import '../styles/signup.css';

const Singup = () => {
  const form = useRef();
  const navigate = useNavigate();
  const [ formData, setFormData ] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [ errors, setErrors ] = useState({});

  // const { user } = useContext(UserContext);


  // Validation of input fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "Username is requried.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords does not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => {
        toast.error(error, { position: "top-right"});
      });
      return false;
    }
    return true;
  };

  // Send data to backend on successful validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("inside handleSubmit");
    if(validateForm()) {
      try {
        const response = await fetch('/api/users/signup', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("Account successfully created!", {
            position: "top-right",
          });

          setFormData({
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          setTimeout(() => {
            navigate('/login');
          }, 5000);

        } else if (response.status === 400) {
           toast.error("Existing username or email.", {
                position: "top-right",
           });    
        } else {
          toast.error("Failed to create an account.", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error: \n", error);
        toast.error("Error occured during signup.", {
          position: "top-right",
        });
      }
    }
  };

  // Handle changes made in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className='container'>
      <ToastContainer />
      <nav>
          <img src={imageLogo} alt='My Vlog-logo' />
        <div>
          <Link to="/">Login</Link>
          
        </div>
      </nav>

      <div className='signup'>
        <div>
          <img className='s-displayimage' src={imageSignup} alt='login-image' />
        </div>
        <div className='s-formContainer'>
          <form ref={form} onSubmit={handleSubmit} className='signup-form'>
            
           <fieldset>
            <legend>Sign Up</legend>
            <input 
              type='text' 
              name='username' 
              placeholder='Username'
              value={formData.username}
              onChange={handleChange} 
            />
    
            <input 
              type='text' 
              name='firstName' 
              placeholder='First Name' 
              value={formData.firstName}
              onChange={handleChange}
            />
            
            <input 
              type='text' 
              name='lastName' 
              placeholder='Last Name' 
              value={formData.lastName}
              onChange={handleChange}
            />

            <input 
              type='email' 
              name='email' 
              placeholder='Your email address'
              value={formData.email}
              onChange={handleChange} 
            />

            <input 
              type='password' 
              name='password' 
              placeholder='Create Password' 
              value={formData.password}
              onChange={handleChange}
            />
            <input 
              type='password' 
              name='confirmPassword' 
              placeholder='Confirm Password' 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
    
            <button type='submit'>Sign Up</button>  
    
           </fieldset>
          </form>
          <p>
            Existing User? &rarr; <a href='/login'>Login</a>
          </p>
        </div>
       </div> 
    </div>
  );
};

export default Singup;
