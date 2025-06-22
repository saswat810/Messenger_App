import React from 'react';
import { FaCaretSquareDown } from "react-icons/fa";

const renderMongoImage = (imageObj, fallback = '/default-profile.png') => {
  if (imageObj && imageObj.data) {
    try {
      const byteArray = new Uint8Array(imageObj.data.data);
      const base64String = btoa(
        byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      );
      return `data:${imageObj.contentType};base64,${base64String}`;
    } catch (error) {
      console.error("Image render error:", error);
      return fallback;
    }
  }
  return fallback;
};

const FriendInfo = ({ currentfriend, activeUser, message }) => {
  return (
    <div className='friend-info'>
      <input type="checkbox" id='gallery' />

      <div className='image-name'>
        <div className='image'>
          <img
            src={renderMongoImage(currentfriend.image)}
            alt='friend'
          />
        </div>

        {activeUser && activeUser.some(u => u.userId === currentfriend._id) && (
          <div className='active-user'>Active</div>
        )}

        <div className='name'>
          <h4>{currentfriend.userName}</h4>
        </div>
      </div>

      <div className='others'>
        <div className='custom-chat'>
          <h3>Customise Chat</h3>
          <FaCaretSquareDown />
        </div>

        <div className='privacy'>
          <h3>Privacy and Support</h3>
          <FaCaretSquareDown />
        </div>

        <div className='media'>
          <h3>Shared Media</h3>
          <label htmlFor='gallery'>
            <FaCaretSquareDown />
          </label>
        </div>
      </div>

      <div className='gallery'>
        {message && message.length > 0 &&
          message.map((m, index) =>
            m.message.image?.data ? (
              <img
                key={index}
                alt='shared'
                src={renderMongoImage(m.message.image)}
              />
            ) : null
          )}
      </div>
    </div>
  );
};

export default FriendInfo;
