import {
  LOGIN,
  FETCH_CATEGORIES,
  FETCH_CATEGORIES2,
  FETCH_QUESTIONS,
  FETCH_PROBLEMS,
  GET_USER_PROFILE,
  FETCH_USER_PIC,
  FETCH_PROBLEM_DETAIL,
  FETCH_INTRO,
  FETCH_NOTIFICATION,
  FETCH_SINGLE_QUESTIONS,
  GET_USER_LOCATION,
  SET_ASK_LOCATION,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        auth: {
          role: action.role,
          token: action.token,
          mobile: action.mobile,
          isFetching: action.isFetching,
        },
      };

    case FETCH_CATEGORIES:
      return {
        ...state,
        categories: {
          isFetching: action.isFetching,
          list: action.list,
        },
      };

    case FETCH_CATEGORIES2:
      return {
        ...state,
        categories: {
          isFetching: action.isFetching,
          list: action.list,
        },
      };

    case FETCH_QUESTIONS:
      return {
        ...state,
        questions: {
          list: action.list || [],
          isFetching: action.isFetching || false,
          PageNumber: action.PageNumber || 1,
          PageCount: action.PageCount || 10,
          hasMore: action.hasMore || true,
        },
      };

    case FETCH_PROBLEMS:
      return {
        ...state,
        problems: {
          list: action.list || [],
          isFetching: action.isFetching || false,
          PageNumber: action.PageNumber || 1,
          PageCount: action.PageCount || 10,
          hasMore: action.hasMore || true,
        },
      };

    case GET_USER_PROFILE:
      return {
        ...state,
        profile: {
          family: action.family || "",
          mobile: action.mobile || "",
          name: action.name || "",
          nationalCode: action.nationalCode || "",
          statusId: action.statusId || 0,
          isFetching: action.isFetching || false,
          birthday: action.birthday.trim() || "",
          acceptedLatitude: action.acceptedLatitude || 0,
          acceptedLongitude: action.acceptedLongitude || 0,
          requestedLatitude: action.requestedLatitude || 0,
          requestedLongitude: action.requestedLongitude || 0,
          introduceCount: action.introduceCount || 0,
        },
      };

    case FETCH_USER_PIC:
      return {
        ...state,
        userPic: action.path,
      };

    case FETCH_PROBLEM_DETAIL:
      return {
        ...state,
        problemDetails: { isFetching: action.isFetching, item: action.item },
      };

    case FETCH_INTRO:
      return {
        ...state,
        introList: action.list,
      };

    case FETCH_NOTIFICATION:
      return {
        ...state,
        notification: {
          assistantProblemsCount: action.assistantProblemsCount || 0,
          categoryTime: action.categoryTime,
          personProblemsCount: action.personProblemsCount || 0,
          personQuestionCount: action.personQuestionCount || 0,
          version: action.version,
          isFetching: action.isFetching,
        },
      };

    case FETCH_SINGLE_QUESTIONS:
      return {
        ...state,
        singleQuestion: {
          item: action.item,
          isFetching: action.isFetching,
        },
      };

    case GET_USER_LOCATION:
      return {
        ...state,
        userLocation: action.location,
      };

    case SET_ASK_LOCATION:
      return {
        ...state,
        askLocation: action.mood,
      };

    default:
      return state;
  }
};
