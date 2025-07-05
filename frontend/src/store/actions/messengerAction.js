import axios from 'axios';
import {FRIEND_GET_SUCCESS,MESSAGE_GET_SUCCESS,MESSAGE_SEND_SUCCESS,THEME_GET_SUCCESS,THEME_SET_SUCCESS} from "../types/messengerType";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getFriends = () => async(dispatch) => {
     try{
          const response = await axios.get(`${BASE_URL}/api/messenger/get-friends`);
           dispatch({
                type: FRIEND_GET_SUCCESS,
                payload : {
                     friends : response?.data?.friends ? response?.data?.friends : "No Users Yet"
                }
           })

     }catch (error){
          console.log(error.response.data);
     }
}

export const messageSend = (data) => async(dispatch) => {
    try{
     const response = await axios.post(`${BASE_URL}/api/messenger/send-message`,data);
     dispatch({
          type : MESSAGE_SEND_SUCCESS,
          payload : {
               message : response.data.message
          }
     })
    }catch (error){
     console.log(error.response.data);
    }
}


export const getMessage = (id) => {
     return async(dispatch) => {
          try{
               const response = await axios.get(`${BASE_URL}/api/messenger/get-message/${id}`)
              dispatch({
                   type : MESSAGE_GET_SUCCESS,
                   payload : {
                    message : response.data.message
                   }
              })
          }catch (error){
               console.log(error.response.data)
          }
     }
}


export const ImageMessageSend = (data) => async(dispatch)=>{

     try{
          const response = await axios.post(`${BASE_URL}/api/messenger/image-message-send`,data);
          dispatch({
               type: MESSAGE_SEND_SUCCESS,
               payload : {
                    message : response.data.message
               }
          })
     }catch (error){
          console.log(error.response.data);

     }

}

export const seenMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post(`${BASE_URL}/api/messenger/seen-message`,msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const updateMessage = (msg) => async(dispatch)=> {
     try{
          const response = await axios.post(`${BASE_URL}/api/messenger/delivared-message`,msg);
          console.log(response.data);
     }catch (error){
          console.log(error.response.message)

     }
}


export const getTheme = () => async(dispatch) => {

     const theme = localStorage.getItem('theme');
     dispatch({
          type: THEME_GET_SUCCESS,
          payload : {
               theme : theme? theme : 'white'
          }
     })

}


export const themeSet = (theme) => async(dispatch) => {

     localStorage.setItem('theme',theme);
     dispatch({
          type: THEME_SET_SUCCESS,
          payload : {
               theme : theme
          }
     })
     
}
