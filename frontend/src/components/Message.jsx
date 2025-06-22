import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { FaRegCheckCircle } from "react-icons/fa";

const Message = ({ message, currentfriend, scrollRef, typingMessage }) => {
  const { myInfo } = useSelector(state => state.auth);

  const renderImage = (img) => {
    if (!img || !img.data) return null;
    const base64String = `data:${img.contentType};base64,${btoa(
      new Uint8Array(img.data.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    )}`;
    return <img alt='' src={base64String} />;
  };
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
  return (
    <>
      <div className='message-show'>
        {
          message && message.length > 0 ? message.map((m, index) =>
            m.senderId === myInfo.id ? (
              <div ref={scrollRef} className='my-message' key={m._id}>
                <div className='image-message'>
                  <div className='my-text'>
                    <p className='message-text'>
                      {m.message.text === '' ? renderImage(m.message.image) : m.message.text}
                    </p>
                    {
                      index === message.length - 1 && m.senderId === myInfo.id ? (
                        m.status === 'seen' ? <img className='img' src={renderMongoImage(currentfriend.image)} alt='' /> :
                          <span><FaRegCheckCircle /></span>
                      ) : ''
                    }
                  </div>
                </div>
                <div className='time'>
                  {moment(m.createdAt).startOf('minute').fromNow()}
                </div>
              </div>
            ) : (
              <div ref={scrollRef} className='fd-message' key={m._id}>
                <div className='image-message-time'>
                  <img src={renderMongoImage(currentfriend.image)} alt='' />
                  <div className='message-time'>
                    <div className='fd-text'>
                      <p className='message-text'>
                        {m.message.text === '' ? renderImage(m.message.image) : m.message.text}
                      </p>
                    </div>
                    <div className='time'>
                      {moment(m.createdAt).startOf('minute').fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className='friend_connect'>
              <img src={renderMongoImage(currentfriend.image)} alt='' />
              <h3>{currentfriend.userName} Connect You</h3>
              <span>{moment(currentfriend.createdAt).startOf('minute').fromNow()}</span>
            </div>
          )
        }
      </div>

      {typingMessage && typingMessage.msg && typingMessage.senderId === currentfriend._id ? (
        <div className='typing-message'>
          <div className='fd-message'>
            <div className='image-message-time'>
              <img src={renderMongoImage(currentfriend.image)} alt='' />
              <div className='message-time'>
                <div className='fd-text'>
                  <p className='time'>Typing Message....</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Message;
