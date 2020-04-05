import { FETCH_CATEGORIES, FETCH_CATEGORIES2 } from "../types";
import AsyncStorage from "@react-native-community/async-storage";

export const fetchCategories = (dispatch, getState, api) => async (
  TypeId,
  forceUpdate
) => {
  const { auth } = getState;
  const _api = new api(false, auth.token);
  const name = TypeId && TypeId === 2 ? "categories2" : "categories1";
  const type = TypeId && TypeId === 2 ? FETCH_CATEGORIES2 : FETCH_CATEGORIES;

  dispatch({ type, list: [], isFetching: true });

  // if (!forceUpdate) {
  //   const categories = await AsyncStorage.getItem(name);

  //   if (categories) {
  //     dispatch({ type, list: categories, isFetching: false });
  //   }
  // }

  try {
    //{ TypeId: TypeId || 1 }
    const res = await _api.Get("AllCategories");
    dispatch({ type, list: res.data, isFetching: false });
    AsyncStorage.setItem(name, JSON.stringify(res.data));
  } catch (err) {
    dispatch({
      type,
      list: [],
      isFetching: false
    });
  }
};
