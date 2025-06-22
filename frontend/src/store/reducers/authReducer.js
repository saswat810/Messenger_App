import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  SUCCESS_MESSAGE_CLEAR,
  ERROR_CLEAR,
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  LOGOUT_SUCCESS
} from "../types/authType";

import deCodeToken from 'jwt-decode';

const authState = {
  loading: true,
  authenticate: false,
  error: '',
  successMessage: '',
  myInfo: ''
};

// 🔐 Decode the JWT token and check expiry
const tokenDecode = (token) => {
  try {
    const tokenDecoded = deCodeToken(token);
    const expTime = new Date(tokenDecoded.exp * 1000);
    if (new Date() > expTime) {
      return null;
    }
    return tokenDecoded;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
};

// ✅ Load token and image from localStorage on app start
const getToken = localStorage.getItem('authToken');
const getUserImage = localStorage.getItem('userImage');

if (getToken) {
  const getInfo = tokenDecode(getToken);
  if (getInfo) {
    authState.myInfo = {
      ...getInfo,
      image: getUserImage ? JSON.parse(getUserImage) : null
    };
    authState.authenticate = true;
    authState.loading = false;
  }
}

// ✅ Reducer Function
export const authReducer = (state = authState, action) => {
  const { payload, type } = action;

  if (type === REGISTER_FAIL || type === USER_LOGIN_FAIL) {
    return {
      ...state,
      error: payload.error,
      authenticate: false,
      myInfo: '',
      loading: true
    };
  }

  if (type === REGISTER_SUCCESS || type === USER_LOGIN_SUCCESS) {
    const myInfo = tokenDecode(payload.token);

    // Save token to localStorage
    localStorage.setItem('authToken', payload.token);

    // Save user image (base64 + contentType) to localStorage
    if (payload.userImage) {
      localStorage.setItem('userImage', JSON.stringify(payload.userImage));
    }

    const completeInfo = {
      ...myInfo,
      image: payload.userImage || null
    };

    return {
      ...state,
      myInfo: completeInfo,
      successMessage: payload.successMessage,
      error: '',
      authenticate: true,
      loading: false
    };
  }

  if (type === SUCCESS_MESSAGE_CLEAR) {
    return {
      ...state,
      successMessage: ''
    };
  }

  if (type === ERROR_CLEAR) {
    return {
      ...state,
      error: ''
    };
  }

  if (type === LOGOUT_SUCCESS) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userImage');

    return {
      ...state,
      authenticate: false,
      myInfo: '',
      successMessage: 'Logout Successful'
    };
  }

  return state;
};
