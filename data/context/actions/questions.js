import { FETCH_QUESTIONS, FETCH_SINGLE_QUESTIONS } from "../types";

export const fetchQuestions = (dispatch, getState, api) => async isFirst => {
  const { auth, questions } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  if (isFirst) {
    dispatch({ type: FETCH_QUESTIONS, ...questions, isFetching: true });
  }

  if (!questions.hasMore) return;

  try {
    const res = await _api.Get("Questions", {
      PageCount: questions.PageCount || 10,
      PageNumber: isFirst ? 1 : questions.PageNumber
    });
    if (isFirst) {
      dispatch({
        type: FETCH_QUESTIONS,
        list: res.data,
        isFetching: false,
        PageNumber: 2,
        PageCount: 10,
        hasMore: res.data.length < questions.PageCount ? false : true
      });
    } else {
      dispatch({
        type: FETCH_QUESTIONS,
        list: [...questions.list, ...res.data],
        isFetching: false,
        PageNumber: questions.PageNumber + 1,
        Count: 10,
        hasMore: res.data.length < questions.PageCount ? false : true
      });
    }
  } catch (err) {
    dispatch({
      ...questions,
      isFetching: false,
      type: FETCH_QUESTIONS
    });
  }
};

export const getOneQuestions = (dispatch, getState, api) => async id => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  dispatch({ type: FETCH_SINGLE_QUESTIONS, item: {}, isFetching: true });

  try {
    const res = await _api.Get(`Questions/${id}`);
    dispatch({
      type: FETCH_SINGLE_QUESTIONS,
      item: res.data,
      isFetching: false
    });
  } catch (err) {
    dispatch({ type: FETCH_SINGLE_QUESTIONS, item: {}, isFetching: false });
    console.log(err);
  }
};

export const postQuestions = (dispatch, getState, api) => async (
  Text,
  callback
) => {
  const { auth } = getState;
  const { token } = auth;
  const _api = new api(false, token);

  try {
    await _api.Post("Questions", { Text });
    if (callback) callback();
  } catch (err) {
    // console.log(err);
  }
};
