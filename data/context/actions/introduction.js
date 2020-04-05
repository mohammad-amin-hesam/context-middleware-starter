import { FETCH_INTRO } from "../types";

export const introducePost = (dispatch, getState, api) => async (
  Data,
  callback,
  isEdit
) => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  try {
    const res = await _api.Post("Introduces", { ...Data });
    notif("درخواست شما پس از بررسی ثبت خواهد شد");
    if (callback) callback();
  } catch (err) {
    if (err.response && err.response.status === 401) {
      notif("این شماره مجاز نمی‌باشد", "danger", 3);
    }
  }
};

export const introduceGet = (dispatch, getState, api) => () => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  return new Promise(async (resolve, reject) => {
    try {
      const res = await _api.Get("Introduces");
      dispatch({ type: FETCH_INTRO, list: res.data });
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

export const introduceDelete = (dispatch, getState, api) => async id => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  try {
    const res = await _api.Delete(`Introduces/${id}`);
    // console.log(res);
  } catch (err) {
    console.log(err);
  }
};
