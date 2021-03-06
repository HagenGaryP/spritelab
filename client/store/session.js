import axios from 'axios';

//----ACTION TYPES----/
const GET_SESS = 'GET_SESS';
const CREATE_SESS = 'CREATE_SESS';
const UPDATE_SESS = 'UPDATE_SESS';

//----ACTION CREATORS----/
const getSess = (session) => ({ type: GET_SESS, session });
const createSess = (newSession) => ({ type: CREATE_SESS, newSession });
const updateSess = (sessionId) => ({ type: UPDATE_SESS, sessionId });

//----THUNK CREATORS----/
export const getSession = (userId) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/session/${userId}`);
    dispatch(getSess(data));
  } catch (error) {
    console.error(error);
  }
};

export const createSession = (canvas) => async (dispatch) => {
  try {
    const { userId } = canvas;
    const { data } = await axios.post(`/api/session/${userId}`, canvas);
    dispatch(createSess(data));
  } catch (error) {
    console.error(error);
  }
};

export const saveSession = (info) => async (dispatch) => {
  try {
    const { userId } = info;
    const { data } = await axios.put(`/api/session/${userId}`, info);
    dispatch(updateSess(data));
  } catch (error) {
    console.error(error);
  }
};

//----INITIAL STATE----/
const defaultSess = [];

//----REDUCER----/
export default function (state = defaultSess, action) {
  switch (action.type) {
    case GET_SESS:
      return action.session;
    case CREATE_SESS:
      return [...state, action.newSession];
    case UPDATE_SESS:
      return [...state, action.session];
    default:
      return state;
  }
}
