import React, { useState } from 'react';
import './Email.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handlechange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addUsers = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/verify-email', user);
      alert('You added a new user');
    } catch (error) {
      console.log(error);
    }
  };

  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const handlechange2 = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/login', values);
      if (res.data.Status === 'success') {
        console.log('New data', res);
        navigate('/LoginHome');
      } else {
        alert(res.data.Message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form>
            <label htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <input
              type="text"
              name="username"
              onChange={handlechange}
              autoComplete="off"
              placeholder="User name"
              required
            />
            <input
              type="email"
              name="email"
              onChange={handlechange}
              autoComplete="off"
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              onChange={handlechange}
              autoComplete="off"
              placeholder="Password"
              required
            />
            <button onClick={addUsers}>Sign up</button>
          </form>
        </div>

        <div className="login">
          <form>
            <label htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input
              type="text"
              name="username"
              onChange={handlechange2}
              autoComplete="off"
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              onChange={handlechange2}
              autoComplete="off"
              placeholder="Password"
              required
            />
            <button onClick={handleSubmit}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
