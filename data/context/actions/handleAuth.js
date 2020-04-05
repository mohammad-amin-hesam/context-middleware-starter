import { LOGIN } from "../types";
import AsyncStorage from "@react-native-community/async-storage";
import IMEI from "react-native-imei";

export const personPreLogin = (dispatch, getState, api) => async (
  Mobile,
  callback,
  type
) => {
  let _api = new api();
  const { auth } = getState;

  dispatch({ ...auth, isFetching: true, type: LOGIN });

  try {
    // const phoneIMEI = await IMEI.getImei();
    const phoneIMEI = ["2893492383"];
    // if (phoneIMEI[0] === null) {
    // notif("دستگاه بدون سیمکارت مجاز نمی‌باشد", "danger", 3);
    // dispatch({
    //   type: LOGIN,
    //   ...auth,
    //   isFetching: false
    // });
    // return;
    // }
    const res = await _api.Post("PersonPreLogin", {
      IMEI: phoneIMEI[0] !== null ? phoneIMEI[0] : "10022153",
      Mobile: type === "resend" ? Mobile : `09${Mobile}`,
    });
    if (res) {
      dispatch({
        type: LOGIN,
        token: res.data.token,
        role: "guest",
        mobile: `09${Mobile}`,
        isFetching: false,
      });
    }
    if (callback) callback();
    return res;
  } catch (err) {
    console.log(err);
    dispatch({ ...auth, isFetching: false, type: LOGIN });
    notif("خطایی پیش آمده است لطفاً دوباره امتحان کنید", "danger", 3);
  }
};

export const personLogin = (dispatch, getState, api) => async (
  Code,
  callback
) => {
  const { auth } = getState;
  const _api = new api(false, auth.token);

  dispatch({ ...auth, isFetching: true, type: LOGIN });

  try {
    const res = await _api.Post("PersonLogin", { Code });
    console.log("personLogin", res);
    if (res) {
      dispatch({
        type: LOGIN,
        token: res.data.token,
        role: res.data.role,
        isFetching: false,
      });
      const authInfo = {
        token: res.data.token,
        role: res.data.role,
      };
      AsyncStorage.setItem("auth", JSON.stringify(authInfo));
    }
    if (callback) callback();
    return res;
  } catch (err) {
    console.log("personLogin", err);
    dispatch({ ...auth, isFetching: false, type: LOGIN });
    if (err.response && err.response.status !== 500) {
      notif("کد وارد شده صحیح نمی‌باشد", "danger", 3);
    } else {
      notif("خطایی پیش آمده است لطفاً دوباره امتحان کنید", "danger", 3);
    }
  }
};

export const checkAuth = (dispatch, getState) => (callBack) => {
  return new Promise((resolve) => {
    AsyncStorage.getItem("auth").then((auth) => {
      if (auth) {
        const _auth = JSON.parse(auth);
        if (_auth.token) {
          dispatch({ ..._auth, isFetching: false, type: LOGIN });
          if (callBack) callBack();
        }
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
