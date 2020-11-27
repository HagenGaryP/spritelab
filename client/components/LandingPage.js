import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Login, Signup } from './auth-form';
import { logout, getSession, auth } from '../store';

let chars = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
let hash = '';
for (let j = 0; j < 6; j++) {
  hash += chars[Math.floor(Math.random() * 62)];
}

const LandingPage = ({ isLoggedIn, name, handleClick, user, getSession }) => {
  const [display, setDisplay] = useState('login');
  const [session, setSession] = useState([]);

  useEffect(() => {
    setDisplay('login');
  }, []);

  return (
    <div className="container">
      <div className="landing-container">
        <div className="center-box">
          <h1>SpriteFox</h1>
          {isLoggedIn && (
            <h2> Welcome, {name.charAt(0).toUpperCase() + name.slice(1)} </h2>
          )}
          <p>
            A real-time, collaborative editor
            <br />
            for creating animated sprites and pixel art
          </p>

          {isLoggedIn ? (
            <div className="divider">
              <Link className="btn landing-btn" to={`/${hash}`}>
                Create Sprite
              </Link>
              <div className="divider">
                <button
                  type="button"
                  className="btn landing-btn"
                  onClick={() => handleClick()}
                >
                  Log Out
                </button>
              </div>
              <div className="session-container">
                <h2>Sessions</h2>
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                className="btn landing-btn"
                onClick={() => {
                  setDisplay('login');
                  handleClick();
                }}
              >
                Login
              </button>
              <div className="divider">
                <button
                  type="button"
                  className="btn landing-btn"
                  onClick={() => setDisplay('signUp')}
                >
                  Sign Up
                </button>
                {display === 'login' ? <Login user={user} /> : <Signup />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------  REDUX LOGIC --------- //
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user.id,
    name: state.user.firstName,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
    getSession: () => dispatch(getSession()),
  };
};

export default connect(mapState, mapDispatch)(LandingPage);

/**
 * PROP TYPES
 */
LandingPage.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
