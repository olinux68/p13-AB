// Importation des bibliothèques et des composants nécessaires
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import { signOut, checkStorageToken } from "../../Service/fetchData";
import { selectUser } from "../../Utils/selectors";
import './header.css';
import logo from "../../Assets/argentBankLogo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOut } from "@fortawesome/free-solid-svg-icons";

// Définition du composant Header
export default function Header() {
  // Utilisation du hook useStore pour accéder au store Redux
  const store = useStore();
  // Utilisation du hook useSelector pour sélectionner les données de l'utilisateur dans le store Redux
  const user = useSelector(selectUser);

  // Utilisation du hook useEffect pour vérifier la présence d'un token utilisateur lors du montage du composant
  useEffect(() => {
    checkStorageToken(store);
  }, [store]);

  // Définition de la fonction handleSignOut pour gérer la déconnexion de l'utilisateur
  const handleSignOut = () => {
    signOut(store);
  };

  // Rendu du composant Header
  return (
    <nav className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo"/>
        <h1 className="sr-only">Argent Bank</h1>
      </Link>

      {/* Si l'utilisateur est connecté, affiche un lien vers le profil de l'utilisateur et un lien pour se déconnecter */}
      {user.data ? (
        <div>
          <Link className="main-nav-item" to="/Profil">
            <FontAwesomeIcon className='main-nav-icon' icon={faUserCircle} />
            {`${user.data.firstName}`}
          </Link>
          <Link className="main-nav-item" to="/" onClick={handleSignOut}>
            <FontAwesomeIcon className='main-nav-icon' icon={faSignOut} />
            Sign Out
          </Link>
        </div>
      ) : (
        // Si l'utilisateur n'est pas connecté, affiche un lien pour se connecter
        <div>
          <Link className="main-nav-item" to="/Login">
            <FontAwesomeIcon className='main-nav-icon' icon={faUserCircle} />
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}
