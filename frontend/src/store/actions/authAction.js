import axios from 'axios';
import {REGISTER_FAIL,REGISTER_SUCCESS,USER_LOGIN_SUCCESS,USER_LOGIN_FAIL} from "../types/authType";

export const userRegister = (data) => {
     return async (dispatch) => {

          const config = {
               headers: {
                    'Content-Type':'application/josn'
               } 
          }
          try{
               const response = await axios.post('/api/messenger/user-register',data,config);
               localStorage.setItem('authToken',response.data.token);

               dispatch({
                    type : REGISTER_SUCCESS,
                    payload:{
                         successMessage: response.data.successMessage,
                         token : response.data.token,
                         userImage : response.data.image

                    }
               })

          } catch(error){
                dispatch({
                    type: REGISTER_FAIL,
                    payload:{
                         error : error.response.data.error.errorMessage 
                    }
                })
          }

     }
}


export const userLogout = () => async(dispatch) => {
     try{
         const response = await axios.post('/api/messenger/user-logout');
         if(response.data.success){
             localStorage.removeItem('authToken');
             dispatch({
                 type : 'LOGOUT_SUCCESS'
             })
         }

     }catch (error) {

     }
}


export const userLogin = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(
      '/api/messenger/user-login',
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // to allow cookies if needed
      }
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: {
        successMessage: response.data.successMessage,
        token: response.data.token,
        userImage : response.data.user.image
      }
    });
    // Save token in localStorage for persistence
    localStorage.setItem('authToken', response.data.token);

  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: {
        error: error.response?.data?.error?.errorMessage || ['Login failed']
      }
    });
  }
};





