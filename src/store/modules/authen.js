import axios from "axios";
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REFRESH
} from "../actions/auth";
import utils from "@/utils.js";

const state = {
  token: localStorage.getItem("user-token") || "",
  status: "",
  permission: "manager"
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  permission: state => state.permission
};

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      axios({ url: "/api/token/", data: user, method: "POST" })
        .then(resp => {
          let access = resp.data.access;
          let refresh = resp.data.refresh;
          const token = {
            access: access,
            refresh: refresh
          };

          localStorage.setItem("user-token", JSON.stringify(token));

          commit(AUTH_SUCCESS, JSON.stringify(token));
          resolve(resp);
        })
        .catch(err => {
          commit(AUTH_ERROR, err);
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },

  [AUTH_REFRESH]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);

      let user_token = localStorage.getItem("user-token");
      if (!user_token) {
        commit(AUTH_LOGOUT);
        localStorage.removeItem("user-token");
        reject("No token");
      }

      let refresh = JSON.parse(user_token).refresh;
      axios({ url: "/api/token/refresh/", data: { refresh }, method: "POST" })
        .then(resp => {
          console.log("Refresh token successfully");
          let access = resp.data.access;
          const token = JSON.parse(localStorage.getItem("user-token"));
          token.access = access;
          localStorage.setItem("user-token", JSON.stringify(token));
          commit(AUTH_SUCCESS, JSON.stringify(token));
          resolve(resp);
        })
        .catch(err => {
          commit(AUTH_LOGOUT, err);
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },

  [AUTH_LOGOUT]: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem("user-token");
      resolve();
    });
  }
};

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = "loading";
  },
  [AUTH_SUCCESS]: (state, token) => {
    state.status = "success";
    state.token = token;
    var token_data = utils.parseJwt(token);
    if (token_data.is_admin) {
      state.permission = "admin";
    } else {
      state.permission = "pentester";
    }
  },
  [AUTH_ERROR]: (state, err) => {
    state.status = "error";
    state.permission = null;
  },
  [AUTH_LOGOUT]: state => {
    state.token = "";
    state.status = "unauthen";
    state.permission = null;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
