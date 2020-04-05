import createDataContext from "./helpers/data";
import reducer from "./reducer";
import initialState from "./state";
import actions from "./actions";

export const { Context, Provider } = createDataContext(
  reducer,
  actions,
  initialState
);
