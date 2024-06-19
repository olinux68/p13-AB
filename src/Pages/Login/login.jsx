import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUpdateToken, fetchUpdateData, rememberMe } from "../../Service/fetchData";
import { selectUser } from "../../Utils/selectors";
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

// Composant de connexion
export default function Login() {
  // Définition des états locaux
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Mot de passe

  // Utilisation du store Redux et sélection de l'utilisateur
  const store = useStore();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // Effet pour naviguer vers le profil si l'utilisateur est connecté
  useEffect(() => {
    if (user.token) {
      navigate("/Profil");
    }
  }, [navigate, user.token]);

  // Fonction pour gérer la case à cocher "Se souvenir de moi"
  const handleCheckbox = useCallback(() => {
    rememberMe(store);
  }, [store]);

  // Fonction pour soumettre le formulaire de connexion
  const loginSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = await fetchUpdateToken(store, email, password);
    if (token) {
      fetchUpdateData(store, token);
    }
  }, [store, email, password]);

  // Rendu du composant
  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <FontAwesomeIcon className='sign-in-icon' icon={faUserCircle} />
        <h1>Sign In</h1>
        <form onSubmit={loginSubmit}>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="input-remember">
            <input onChange={handleCheckbox} type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          {user.tokenStatus === "rejected" && <div className="errorInfo">Invalid E-mail or password</div>}
          <button type="submit" className="sign-in-button"> Sign In </button>
        </form>
      </section>
    </main>
  );
}
