import RNFetchBlob from "react-native-fetch-blob";
import { FETCH_USER_PIC, FETCH_PROBLEM_DETAIL } from "../types";
import Axios from "axios";

export const upload = (dispatch, getState, api) => (arr, uploadCallback) => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token, "multipart/form-data");

  return new Promise(async (resolve, reject) => {
    let _arr = [];
    for (let i = 0; i < arr.length; i++) {
      const data = arr[i];
      const res = await _api.Upload(
        "ProblemDocumentaries",
        data,
        uploadCallback
          ? (num) => {
              uploadCallback(num, i, arr.length);
            }
          : false
      );
      if (res && res.data) {
        _arr.push(res.data);
      }
    }
    if (_arr.length !== 0) {
      resolve(_arr);
    } else {
      reject("There's a problem");
    }
  });
};

export const uploadUserImage = (dispatch, getState, api) => async (body) => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token, "multipart/form-data");

  try {
    const res = await _api.Upload("PersonImage", body, () => {});
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

export const getUserImage = (dispatch, getState, api) => async (
  url = "PersonImage",
  val
) => {
  const { auth } = getState;
  const { token } = auth;

  return new Promise((resolve, reject) => {
    let dirs = RNFetchBlob.fs.dirs;
    let _id = Math.floor(Math.random() * 9999999);

    RNFetchBlob.config({
      path:
        dirs.DownloadDir +
        "/ShahreYaran" +
        // dirs.DocumentDir +
        `/${url === "PersonImage" ? "personImage" : "problems"}${
          val ? val.id : _id
        }${val ? val.type : ".jpg"}`,
      fileCache: true,
      appendExt: val ? val.type.split(".")[1] : "jpg",
    })
      .fetch("GET", `http://api.shahreyaran.ir/api/${url}`, {
        Authorization: `Bearer ${token}`,
      })
      .then(async (res) => {
        const path = await res.path();
        const blob = await res.blob();
        // const fileName = res.respInfo.headers["Content-Disposition"]
        //   .split("filename=")[1]
        //   .split(";")[0];
        // const fileType = "." + fileName.split(".")[1];

        console.log(res);
        console.log(res.path());

        if (url === "PersonImage") {
          dispatch({
            type: FETCH_USER_PIC,
            path: Platform.OS === "android" ? "file://" + path : "" + path,
          });
        }
        resolve({
          path: Platform.OS === "android" ? "file://" + path : "" + path,
          readStream: res.readStream,
          mimeFile: blob,
          viewPath: path,
        });
      });
  });
};
