import { FETCH_PROBLEMS, FETCH_PROBLEM_DETAIL } from "../types";
import { fetch } from "whatwg-fetch";

export const fetchProblemDetails = (dispatch, getState, api) => async (
  id,
  type,
  isAssistant
) => {
  const { auth, problemDetails } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  dispatch({
    type: FETCH_PROBLEM_DETAIL,
    item: {},
    isFetching: true,
    PageCount: 10,
    PageNumber: 1,
  });

  let url = type === "public" ? `/Problems1/${id}` : `/Problems4/${id}`;

  if (isAssistant) {
    url = `Experiences/${id}`;
  }

  try {
    const res = await _api.Get(url);
    const { data } = res;
    console.log(res);
    dispatch({ type: FETCH_PROBLEM_DETAIL, item: data, isFetching: false });
  } catch (err) {
    dispatch({
      type: FETCH_PROBLEM_DETAIL,
      item: problemDetails.item,
      isFetching: false,
    });
  }
};

export const postProblem = (dispatch, getState, api) => async (
  data,
  callback,
  isAssistant
) => {
  const { auth, problems } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  const url = isAssistant ? "Experiences" : "Problems1";

  try {
    const res = await _api.Post(url, data);
    notif("گزارش شما با موفقیت ثبت شد", "success", 3);
    if (callback) callback();
  } catch (err) {
    console.warn(err);
  }
};

export const fetchProblems = (dispatch, getState, api) => async (
  url = "Problems1",
  fetchMore
) => {
  const { auth, problems } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  // console.log(fetchMore && problems.hasMore);
  // if (fetchMore && problems.hasMore) return;

  if (!fetchMore) {
    dispatch({
      type: FETCH_PROBLEMS,
      isFetching: true,
      list: [],
      hasMore: true,
      PageCount: 10,
      PageNumber: 2,
    });
  }

  try {
    const config = {
      PageCount: problems.PageCount || 10,
      PageNumber: fetchMore ? problems.PageNumber : 1,
    };
    const res = await _api.Get(url, config);
    list = [];
    const PageNumber = fetchMore ? problems.PageNumber + 1 : 1;

    if (fetchMore) {
      list = [...problems.list, ...res.data];
    } else {
      list = res.data;
    }
    dispatch({
      type: FETCH_PROBLEMS,
      isFetching: false,
      list,
      PageCount: problems.PageCount,
      PageNumber,
      hasMore: res.data.length < 10,
    });
  } catch (err) {
    dispatch({ type: FETCH_PROBLEMS, ...problems, isFetching: false });
  }
};

export const postAssisAnswer = (dispatch, getState, api) => async (
  Id,
  answer,
  callback
) => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  try {
    const res = await _api.Post(`Problems5`, { Id, ResultText: answer });
    if (callback) callback(res);
  } catch (err) {
    console.log(err);
  }
};

export const sendScore = (dispatch, getState, api) => async (Id, Score) => {
  const { auth, problems } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  try {
    await _api.Post("Problems8", { Id, Score });
    let _list = [...problems.list];
    let list = [];
    for (let i = 0; i < _list.length; i++) {
      const item = _list[i];
      if (item.id === Id) {
        item.score = Score;
      }
      list.push(item);
    }
    dispatch({ type: FETCH_PROBLEMS, isFetching: false, list });
  } catch (err) {
    console.log(err);
  }
};

export const verifyFunc = (dispatch, getState, api) => async (
  Id,
  ResultStatus,
  callback
) => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  try {
    const res = await _api.Post("Problems5", {
      Id,
      ResultText: "",
      ResultStatus,
    });
    if (res && callback) {
      callback(res);
    }
  } catch (err) {
    console.log(err.response);
  }
};
