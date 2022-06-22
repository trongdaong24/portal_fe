import axios from "axios";

export const getHeader = function() {
  const user_token = JSON.parse(window.localStorage.getItem("user-token"));
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + user_token.access
  };
  return headers;
};
