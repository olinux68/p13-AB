import { actions } from "../Reducers/user";
import { selectUser } from "../Utils/selectors";

// URL de base de l'API
const API_BASE_URL = "http://localhost:3001/api/v1/user";

// Fonction pour récupérer ou mettre à jour le token de l'utilisateur
export async function fetchUpdateToken(store, email, password) {
  
  // Récupération du statut du token et de la valeur de "Se souvenir de moi"
  const tokenStatus = selectUser(store.getState()).tokenStatus;
  const rememberMeValue = selectUser(store.getState()).rememberMe;

  // Si le token est en cours de récupération ou de mise à jour, on arrête la fonction
  if (tokenStatus === "pending" || tokenStatus === "updating") {
    return;
  }

  // Préparation de la requête pour récupérer le token
  store.dispatch(actions.tokenFetching());
  const optionsToken = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  try {
    // Envoi de la requête pour récupérer le token
    const response = await fetch(`${API_BASE_URL}/login`, optionsToken);
    const res = await response.json();
    // Fin de la récupération du token
    store.dispatch(actions.tokenResolved(res.body.token));
    // Si l'utilisateur a coché "Se souvenir de moi", on stocke le token dans le local storage et le session storage
    if (rememberMeValue) {
      localStorage.setItem("token", res.body.token);
      sessionStorage.setItem("token", res.body.token);
    }
    return res.body.token;
  } 
  catch (error) {
    // En cas d'erreur, on rejette la récupération du token
    store.dispatch(actions.tokenRejected(error));
    return null;
  }
}
  
// Fonction pour récupérer les données de l'utilisateur correspondant au token
export async function fetchUpdateData(store, token) {
  if (token === null) {
    return;
  }
  const dataStatus = selectUser(store.getState()).dataStatus;
  if (dataStatus === "pending" || dataStatus === "updating") {
    return;
  }
  store.dispatch(actions.dataFetching());
  const requestForProfilHeaders = {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, requestForProfilHeaders);
    const res = await response.json();
    if (res.status === 401) {
      signOut(store);
      return;
    }
    store.dispatch(actions.dataResolved(res.body));
  } catch (error) {
    store.dispatch(actions.dataRejected(error));
  }
}

// Fonction pour éditer le profil de l'utilisateur
export async function editProfil(store, firstName, lastName, token) {
  const optionsEditProfil = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ firstName, lastName }),
  };
  try {
    await fetch(`${API_BASE_URL}/profile`, optionsEditProfil);
    store.dispatch(actions.editProfil(firstName, lastName));
  } catch (error) {
    store.dispatch(actions.dataRejected(error));
  }
}

// Fonction pour vérifier la présence d'un token utilisateur et se rappeler de l'utilisateur
export function checkStorageToken(store) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    fetchUpdateData(store, token);
    store.dispatch(actions.remember());
  }
}

// Fonction pour garder l'utilisateur en mémoire si la case "Se souvenir de moi" est cochée  
export function rememberMe(store) {
  store.dispatch(actions.remember());
}
  
// Fonction pour supprimer le token du storage lors de la déconnexion
export function signOut(store) {
  store.dispatch(actions.logout());
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}