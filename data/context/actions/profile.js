import {
  GET_USER_PROFILE,
  FETCH_NOTIFICATION,
  FETCH_QUESTIONS,
  FETCH_PROBLEMS,
  GET_USER_LOCATION,
  SET_ASK_LOCATION,
} from "../types";
import { PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import GeoLocation from "@react-native-community/geolocation";
import { BackHandler, DeviceEventEmitter } from "react-native";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

export const fetchProfile = (dispatch, getState, api) => async (location) => {
  const { auth, profile } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  if (location) {
    dispatch({
      type: GET_USER_PROFILE,
      ...profile,
      latitude: location.latitude,
      longitude: location.longitude,
      isFetching: true,
    });
    return;
  }

  dispatch({ type: GET_USER_PROFILE, ...profile, isFetching: true });

  try {
    const res = await _api.Get("Person");
    dispatch({ type: GET_USER_PROFILE, ...res.data, isFetching: false });
  } catch (err) {}
};

export const postAssisLocation = (dispatch, getState, api) => async ([
  longitude,
  latitude,
]) => {
  const { auth, profile } = getState;
  const { token, role } = auth;
  const _api = new api(false, token);

  if (role === "Assistant") {
    try {
      const res = await _api.Put("Person", { ...profile, latitude, longitude });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
};

export const fetchNotifications = (dispatch, getState, api) => async () => {
  const { auth, notification } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  dispatch({ type: FETCH_NOTIFICATION, ...notification, isFetching: true });

  try {
    const res = await _api.Get("PersonNotifications");
    console.log("notif", res);
    AsyncStorage.setItem("notificationsData", JSON.stringify(res.data));
    dispatch({ type: FETCH_NOTIFICATION, ...res.data, isFetching: false });
  } catch (err) {
    dispatch({ type: FETCH_NOTIFICATION, ...notification, isFetching: false });
  }
};

export const putProfile = (dispatch, getState, api) => async (data) => {
  const { auth } = getState;
  const { token } = auth;

  const _api = new api(false, token);

  try {
    _api.Put("Person", data);
    notif("اطلاعات شما با موفقیت ثبت شد", "success", 3);
  } catch (err) {}
};

export const notifSeener = (dispatch, getState) => (id, type) => {
  const { notification, questions, problems } = getState;

  const updater = () => {
    let list = [];
    for (let i = 0; i < problems.list.length; i++) {
      const item = problems.list[i];
      if (item.id === id) {
        item.seenStatus = 1;
      }
      list.push(item);
    }
    dispatch({ type: FETCH_PROBLEMS, isFetching: false, list });
  };

  switch (type) {
    case "questions":
      notification.personQuestionCount = notification.personQuestionCount - 1;
      let list = [];
      for (let i = 0; i < questions.list.length; i++) {
        const item = questions.list[i];
        if (item.id === id) {
          item.seenStatus = 1;
        }
        list.push(item);
      }
      dispatch({
        isFetching: false,
        list,
        type: FETCH_QUESTIONS,
      });
      break;

    case "normalProblems":
      notification.personQuestionCount = notification.personProblemsCount - 1;
      updater();
      break;

    case "assisProblems":
      notification.personQuestionCount =
        notification.assistantProblemsCount - 1;
      updater();
      break;

    default:
      break;
  }
};

export const setLocation = (dispatch) => async () => {
  let access = {
    fine: false,
    coarse: false,
  };

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );
    if (granted) {
      access.coarse = true;
    }
  } catch (err) {
    console.warn(err);
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted) {
      access.fine = true;
    }
  } catch (err) {
    console.warn(err);
  }

  if (!access.fine && !access.coarse) {
    return;
  }

  LocationServicesDialogBox.checkLocationServicesIsEnabled({
    message:
      "<h2>دسترسی به مکان</h2><p>لطفاً مکان خود را روشن کنید : <br/><br/>شهر یاران جهت خدمت رسانی بهتر نیاز به روشن بودن مکان‌نما شما دارد<br/></p>",
    ok: "اجازه میدهم",
    cancel: "خیر",
    enableHighAccuracy: false,
    showDialog: true,
    openLocationServices: true,
    preventOutSideTouch: false,
    preventBackClick: false,
    providerListener: false,
  })
    .then(function (success) {
      dispatch({
        type: SET_ASK_LOCATION,
        mood: false,
      });
      GeoLocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          console.log("location", position);
          dispatch({
            type: GET_USER_LOCATION,
            location: { lat: latitude, lng: longitude },
          });
        },
        (error) => {
          dispatch({
            type: GET_USER_LOCATION,
            location: { lat: null, lng: null },
          });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      GeoLocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          dispatch({
            type: GET_USER_LOCATION,
            location: { lat: latitude, lng: longitude },
          });
        },
        (error) => {
          dispatch({
            type: GET_USER_LOCATION,
            location: { lat: null, lng: null },
          });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    })
    .catch((error) => {
      dispatch({
        type: GET_USER_LOCATION,
        location: { lat: null, lng: null },
      });
      dispatch({
        type: SET_ASK_LOCATION,
        mood: false,
      });
    });
};
