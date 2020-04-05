import React, { useReducer } from "react";
import api from "../../api";

export default (reducer, actions, initialState) => {
  const Context = React.createContext();

  const Provider = ({ children }) => {
    const [getState, dispatch] = useReducer(reducer, initialState);

    class MainApi extends api {
      constructor(base, token, content_type, response_type) {
        return new api(
          base || false,
          token || false,
          content_type || false,
          response_type || false,
          getState,
          dispatch
        );
      }
    }

    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch, getState, MainApi);
    }

    return (
      <Context.Provider value={{ getState, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };
  return { Context, Provider };
};
