import React, { createContext, useContext, useReducer } from 'react';

import PropTypes from 'prop-types';

const initialState = {
  formData: {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    buildingId: null,
  },
  meetings: [],
  idCounter: 1,
};
const context = createContext(initialState);
const { Provider } = context;

const actions = {
  SET_FORM_DATA: 'SET_FORM_DATA',
  SAVE_MEETING: 'SAVE_MEETING',
  SET_ID_COUNTER: 'SET_ID_COUNTER',
};

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, { type, payload }) => {
    switch (type) {
      case actions.SET_ID_COUNTER:
        return {
          ...state,
          idCounter: payload,
        };
      case actions.SET_FORM_DATA:
        return {
          ...state,
          formData: {
            ...payload,
          },
        };
      case actions.SAVE_MEETING:
        const newId = state.idCounter + 1;
        return {
          formData: {
            title: '',
            date: '',
            startTime: '',
            endTime: '',
            buildingId: null,
          },
          idCounter: newId,
          meetings: [
            ...state.meetings,
            {
              id: newId,
              date: state.formData.date,
              startTime: state.formData.startTime,
              endTime: state.formData.endTime,
              meetingRoomId: payload.selectedRoom,
            },
          ],
        };
      default:
        console.warn('unhandled action called');

        return state;
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

StateProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

/**
 * HOC to bind state to a component
 * @param {JSX.Element} WrappedComponent child component
 * @returns {JSX.Element}
 */
const withContext = WrappedComponent => {
  // eslint-disable-next-line react/display-name
  return props => (
    <StateProvider>
      <WrappedComponent {...props} />
    </StateProvider>
  );
};

/**
 * hook to get state and dispatch function
 * @returns {object}
 */
const useStore = () => useContext(context);

export { actions, useStore, withContext };
