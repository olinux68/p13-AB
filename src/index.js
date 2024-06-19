// Importation des bibliothèques nécessaires
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

// Importation du store Redux
import store from "./Utils/store.js";

// Importation des composants
import Header from "./Components/Header/Header.jsx";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/login.jsx";
import Profil from "./Pages/Profil/Profile.jsx";
import Error from "./Pages/Error/Error.jsx";
import Footer from "./Components/Footer/Footer.jsx";

// Importation du fichier CSS principal
import "./main.css";

// Définition des routes de l'application
const routes = [
  { path: "/", element: <Home /> }, // Route pour la page d'accueil
  { path: "/Login", element: <Login /> }, // Route pour la page de connexion
  { path: "/Profil", element: <Profil /> }, // Route pour la page de profil
  { path: "*", element: <Error /> }, // Route pour la page d'erreur (affichée lorsque la route demandée n'existe pas)
];

// Création de la racine de l'application React
const root = ReactDOM.createRoot(document.getElementById("root"));

// Rendu de l'application React
// Fourniture du store Redux à l'application
// Utilisation du Router pour gérer les routes
// Affichage de l'en-tête
// Affichage des routes
// Affichage du pied de page

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Header /> 
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
        <Footer /> 
      </Router>
    </Provider>
  </React.StrictMode>
);
