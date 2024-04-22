import React from "react";
import "./login.css";
import icon from "./assets/fingerprint.svg";
import arrow from "./assets/arrow.svg";

function Login() {
  return (
    
      <div className="container">      
      <img className="arrow" src={arrow} />

        <div className="form-container sign-in">
          <form>
            <div className="social-icons">
              <img className="fingerprint" src={icon} />
            </div>
            <h1>Connectez-vous</h1>
            <span>utilisez votre email & mot de passe</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Mot de Passe Oublier?</a>
            <button>Connectez-vous</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <h1>Mission!</h1>
              <p>
                permettre à tout unn chacun de révéler son plein potenntiel et
                d'aquerir un métier pour aspirer à un meilleur avenir.
              </p>
            </div>
          </div>
        </div>
      </div>
 
  );
}

export default Login;
