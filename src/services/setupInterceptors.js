import client from "@/services/client.js";
import { AUTH_REFRESH } from "@/store/actions/auth";
import { AUTH_LOGOUT } from "@/store/actions/auth";
import { AUTH_REQUEST } from "../store/actions/auth";

const setup = (router, store) => {
  client.interceptors.request.use(
    config => {
      const user_token = JSON.parse(localStorage.getItem("user-token"));
      // console.log(user_token);
      if (user_token) {
        config.headers["Authorization"] = "Bearer " + user_token.access;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    res => {
      return res;
    },
    async err => {
      const originalConfig = err.config;

      if (originalConfig.url !== "/api/api-auth/" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          console.log(store.getters.authStatus);

          if (store.getters.authStatus == "unauthen") {
            return Promise.reject(err);
          }

          if (store.getters.authStatus == "loading") {
            return client(originalConfig);
          }

          // if (store.getters.authStatus != "success") {
          //   if (store.getters.authStatus != "loading") {
          //     console.log(
          //       "Pushing to login route with path: " + router.currentRoute.path
          //     );

          //     store.commit(AUTH_REQUEST);
          //     router.push({
          //       name: "login",
          //       query: { redirect: router.currentRoute.path }
          //     });
          //   }

          //   return Promise.reject(err);
          // }

          console.log("Try refresh auth token");

          await store
            .dispatch(AUTH_REFRESH)
            .then(data => {
              console.log(data);
            })
            .catch(err => {
              console.log(err);
              console.log(
                "Pushing to login route with path: " + router.currentRoute.path
              );

              router.push({
                name: "login",
                query: { redirect: router.currentRoute.path }
              });

              return Promise.reject(err);
            });

          return client(originalConfig);
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
