import axios from "axios";

//----ACTION TYPES----/
const GET_SESS = "GET_SESS";
const CREATE_SESS = "CREATE_SESS";
const UPDATE_SESS = "UPDATE_SESS";

//----ACTION CREATORS----/
const getSess = (session) => ({ type: GET_SESS, session });
const createSess = (newSession) => ({ type: CREATE_SESS, newSession });
const updateSess = (sessionId) => ({ type: UPDATE_SESS, sessionId });

//----THUNK CREATORS----/
export const getSession = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/session");
    dispatch(getSess(data));
  } catch (error) {
    console.error(error);
  }
};

export const createSession = (canvas) => async (dispatch) => {
  try {
    const { data } = await axios.post("api/session/new", canvas);
    dispatch(createSess(data));
  } catch (error) {
    console.error(error);
  }
};

export const saveSession = (sessId) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/session/${sessId}`);
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
