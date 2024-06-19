import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import { selectUser } from "../../Utils/selectors";
import { editProfil } from "../../Service/fetchData";
import './profile.css';

// Composant de profil
export default function Profil() {
  // Définition des états locaux
  const [newFirstName, setNewFirstName] = useState(""); // Nouveau prénom
  const [newLastName, setNewLastName] = useState(""); // Nouveau nom
  const [editName, setEditName] = useState(false); // État d'édition du nom
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // Message d'erreur
  const [success, setSuccess] = useState(""); // Message de succès
  const [isChanged, setIsChanged] = useState(false); // État de modification

  // Utilisation du store Redux et sélection de l'utilisateur
  const store = useStore();
  const user = useSelector(selectUser);

  // Effet pour définir isChanged en fonction des nouveaux prénom et nom
  useEffect(() => {
    setIsChanged(newFirstName !== "" || newLastName !== "");
  }, [newFirstName, newLastName]);

  // Fonction pour soumettre l'édition du nom
  async function editNameSubmit(e) {
    e.preventDefault();
    if (!isChanged) {
      setEditName(false);
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const token = user.token;
    try {
      await editProfil(store, newFirstName || user.data.firstName, newLastName || user.data.lastName, token);
      setSuccess("Profile updated successfully!");
      setEditName(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour afficher le formulaire d'édition du nom
  function editNameForm() {
    return editName ? (
      // Si editName est vrai, affiche le formulaire d'édition
      <div className="header editName-header">
        <h1 className="welcome">Welcome back</h1>
        <form onSubmit={editNameSubmit} className="editName-form">
          <div className="editName-input-container">
            <div className="editName-wrapper">
              <label htmlFor="newFirstName" className="editName-label"> New firstname:{" "} </label>
              <input
                type="text"
                id="newFirstName"
                className="editName-input"
                placeholder={user.data.firstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                value={newFirstName}
              />
            </div>
            <div className="editName-wrapper">
              <label htmlFor="newLastName" className="editName-label"> New lastname:{" "} </label>
              <input
                type="text"
                id="newLastName"
                className="editName-input"
                placeholder={user.data.lastName}
                onChange={(e) => setNewLastName(e.target.value)}
                value={newLastName}
              />
            </div>
          </div>
          <div className="editName-buttons-container">
            <button type="submit" className="editName-button" disabled={loading}>
              {isChanged ? "Save" : "Cancel"}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    ) : (
      // Sinon, affiche le bouton d'édition
      <div className="header">
        <h1 className="welcome">Welcome back<br /> {`${user.data.firstName} ${user.data.lastName}`}!</h1>
        <button className="edit-button" onClick={() => setEditName(!editName)}>Edit Name</button>
      </div>
    );
  }

  // Rendu du composant
  return user.data ? (
    // Si l'utilisateur est connecté, affiche le profil
    <main className="main bg-dark">
      {editNameForm()}
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  ) : (
    // Sinon, affiche un lien pour se connecter
    <div className="linkForSignInContainer">
      <h2>You must be authenticated...</h2>
      <Link to="/SignIn" className="linkToSignIn">Sign In</Link>
    </div>
  );
}