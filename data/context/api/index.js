import Axios from "axios";
import { navigate } from "../helpers/RootNavigation";
import AsyncStorage from "@react-native-community/async-storage";
import { LOGIN } from "../context/types";
import { fetch } from "whatwg-fetch";

export default class api {
  constructor(base, token, content_type, response_type, getState, dispatch) {
    Axios.defaults.headers = {
      // "Content-Type": "application/x-www-form-urlencoded",
      // Accept: "application/json",
    };
    const headers = {
      // "X-Requested-With": "XMLHttpRequest",
      // Accept: "application/json",
      // "Content-Type": content_type || "application/json; charset=UTF8",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    this.time_out = 10000;
    this.token = token;
    this.auth = `Bearer ${token}`;
    this.getState = getState;
    this.dispatch = dispatch;
    this.maxRedirects = 2;
    this.xhr = Axios.create({
      // baseURL: base || "https://api.shahreyaran.ir/api/",
      baseURL: base || "http://192.168.43.126:11136/api/",
      headers,
      responseType: response_type || "json",
    });
  }

  handleErr = (err) => {
    if (err.response) {
      console.log(err.response);
      if (err.response.status === 401) {
        AsyncStorage.removeItem("auth").then(() => {
          this.dispatch({
            type: LOGIN,
            token: "",
            role: "",
            mobile: ``,
            isFetching: false,
          });
          navigate("Phone", { isFromLogout: true });
        });
      }
    }
    if (!err.response) {
      notif("سرور متصل نمی‌باشد", "danger", 3);
    } else if (err.response > 499 && err.response < 600) {
      notif("خطا در اتصال، مجدداً تلاش کنید", "danger", 3);
    }
  };

  handleRes = (res) => {};

  Get(url, params) {
    return new Promise((resolve, reject) => {
      const data = { method: "get" };
      if (params) data.params = params;
      this.xhr
        .request(url, data)
        .then((res) => {
          this.handleRes(res);
          resolve(res);
        })
        .catch((err) => {
          this.handleErr(err);
          reject(err);
        });
    });
  }

  Navigate(url, params) {
    navigate(url, params);
  }

  Put(url, params) {
    return new Promise((resolve, reject) => {
      this.xhr
        .put(url, params)
        .then((res) => {
          this.handleRes(res);
          resolve(res);
        })
        .catch((err) => {
          this.handleErr(err);
          reject(err);
        });
    });
  }

  Post(url, params) {
    return new Promise((resolve, reject) => {
      this.xhr
        .post(url, params ? params : null)
        .then((res) => {
          this.handleRes(res);
          resolve(res);
        })
        .catch((err) => {
          this.handleErr(err);
          reject(err);
        });
    });
  }

  Upload(url, data, uploadCallback) {
    return new Promise(async (resolve, reject) => {
      this.xhr
        .post(url, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data;",
          },
          onUploadProgress: uploadCallback
            ? (e) => {
                let progress = Math.floor((e.loaded * 100) / e.total);
                uploadCallback(progress);
              }
            : null,
        })
        .then((res) => {
          this.handleRes(res);
          resolve(res);
          console.log(res);
        })
        .catch((err) => {
          this.handleErr(err);
          reject(err);
          console.log(err);
          console.log(err.request);
        });
    });
  }

  Delete(url, data) {
    return new Promise((resolve, reject) => {
      this.xhr
        .delete(url, data ? { data } : null)
        .then((res) => {
          this.handleRes(res);
          resolve(res);
        })
        .catch((err) => {
          this.handleErr(err);
          reject(err);
        });
    });
  }
}
