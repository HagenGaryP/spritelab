import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Login, Signup } from "./auth-form";
import history from "../history";

const LandingPage = ({ isLoggedIn, user, name }) => {
  const [display, setDisplay] = useState("login");

  useEffect(() => {
    setDisplay("login");
  }, [display]);

  let chars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  let hash = "";
  for (let j = 0; j < 6; j++) {
    hash += chars[Math.floor(Math.random() * 62)];
  }

  console.log("DISPLAY ------", display);
  console.log("logged in? --------", isLoggedIn);

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
        </div>
        {isLoggedIn ? (
          <div>
            <Link className="btn landing-btn" to={`/${hash}`}>
              Create Sprite
            </Link>
            <button
              type="button"
              className="btn landing-btn"
              onClick={() => setDisplay("login")}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="btn landing-btn"
              onClick={() => setDisplay("login")}
            >
              Login
            </button>
            <button
              type="button"
              className="btn landing-btn"
              onClick={() => setDisplay("signUp")}
            >
              Sign Up
            </button>
            {display === "login" ? <Login /> : <Signup />}
          </div>
        )}
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

export default connect(mapState)(LandingPage);

// ---------  PROP TYPES --------- //
LandingPage.propTypes = {
  // handleClick: PropTypes.func.isRequired, this is for logging out, not working yet
  isLoggedIn: PropTypes.bool.isRequired,
};

// import React, { useState } from 'react';

// function Example() {
//   // Declare a new state variable, which we'll call "count"
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <p>You clicked {count} times</p>
//       <button onClick={() => setCount(count + 1)}>
//         Click me
//       </button>
//     </div>
//   );
// }

// Equivalent Class Example
// class Example extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: 0
//     };
//   }
//   render() {
//     return (
//       <div>
//         <p>You clicked {this.state.count} times</p>
//         <button onClick={() => this.setState({ count: this.state.count + 1 })}>
//           Click me
//         </button>
//       </div>
//     );
//   }
// }
