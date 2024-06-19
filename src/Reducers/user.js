import { createSlice } from "@reduxjs/toolkit";

// Initialisation de l'état initial
const initialState = {
  tokenStatus: "void", // Statut du token
  dataStatus: "void", // Statut des données
  token: null, // Token de l'utilisateur
  data: null, // Données de l'utilisateur
  tokenError: null, // Erreur de token
  dataError: null, // Erreur de données
  rememberMe: false, // Se souvenir de moi
};

// Création du slice Redux
export const {actions, reducer} = createSlice({
  name: "user", // Nom du slice
  initialState, // État initial
  reducers: {
    // Début de la récupération du token
    tokenFetching: (state) => { 
      if (state.tokenStatus === "void" || state.tokenStatus === "rejected") {
        state.tokenStatus = "pending";
        state.tokenError = null;
      } else if (state.tokenStatus === "resolved") {
        state.tokenStatus = "updating";
      }
    },
    // Résolution de la récupération du token
    tokenResolved: (state, action) => {
      if (state.tokenStatus === "pending" || state.tokenStatus === "updating") {
        state.tokenStatus = "resolved";
        state.token = action.payload;
      }
    },
    // Rejet de la récupération du token
    tokenRejected: {
      prepare: (tokenError) => ({
        payload: {tokenError},
      }),
      reducer: (state, action) => {
        if (state.tokenStatus === "pending" || state.tokenStatus === "updating") {
          state.tokenStatus = "rejected";
          state.tokenError = action.payload.message;
          state.token = null;
        }
      }
    },
    // Début de la récupération des données
    dataFetching: (state) => {
      if (state.dataStatus === "void" || state.dataStatus === "rejected") {
        state.dataStatus = "pending";
        state.dataError = null;
      } else if (state.dataStatus === "resolved") {
        state.dataStatus = "updating";
      }
    },
    // Résolution de la récupération des données
    dataResolved: (state, action) => {
      if (state.dataStatus === "pending" || state.dataStatus === "updating") {
        state.dataStatus = "resolved";
        state.data = action.payload;
      }
    },
    // Rejet de la récupération des données
    dataRejected: {
      prepare: (dataError) => ({
        payload: {dataError},
      }),
      reducer: (state, action) => {
        if (state.dataStatus === "pending" || state.dataStatus === "updating") {
          state.dataStatus = "rejected";
          state.dataError = action.payload.message;
          state.data = null;
        }
      }
    },
    // Déconnexion de l'utilisateur
    logout: (state) => {
      Object.assign(state, initialState);
    },
    // Gestion de la case à cocher "Se souvenir de moi"
    remember: (state) => {
      state.rememberMe = state.token ? true : !state.rememberMe;
    },
    // Édition du profil de l'utilisateur
    editProfil: {
      prepare: (firstName, lastName) => ({
        payload: {firstName, lastName},
      }),
      reducer: (state, action) => {
        state.data.firstName = action.payload.firstName;
        state.data.lastName = action.payload.lastName;
      }
    }
  }
})

// Exportation du réducteur
export default reducer