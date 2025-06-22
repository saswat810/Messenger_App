import React, { useState } from 'react';
import { FaPhoneAlt, FaVideo, FaRocketchat } from "react-icons/fa";
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';

const RightSide = (props) => {
  const {
    currentfriend,
    inputHendle,
    newMessage,
    sendMessage,
    message,
    scrollRef,
    emojiSend,
    ImageSend,
    activeUser,
    typingMessage
  } = props;

  const [isDotChecked, setIsDotChecked] = useState(true); // toggle state for dot

const renderProfileImage = (img) => {
    if (!img || !img.data) return null;
    const base64String = `data:${img.contentType};base64,${btoa(
      new Uint8Array(img.data.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    )}`;
    return <img alt='' src={base64String} />;
  };
  return (
    <div className='col-9'>
      <div className='right-side'>
        <input
          type="checkbox"
          id='dot'
          checked={isDotChecked}
          onChange={() => setIsDotChecked(prev => !prev)}
          style={{ display: 'none' }}
        />

        <div className='row'>
          <div className='col-8'>
            <div className='message-send-show'>
              <div className='header'>
                <div className='image-name'>
                  <div className='image'>
                    {renderProfileImage(currentfriend.image)}
                    {
                      activeUser && activeUser.length > 0 &&
                      activeUser.some(u => u.userId === currentfriend._id) &&
                      <div className='active-icon'></div>
                    }
                  </div>
                  <div className='name'>
                    <h3>{currentfriend.userName}</h3>
                  </div>
                </div>

                <div className='icons'>
                  <div className='icon'>
                    <FaPhoneAlt />
                  </div>

                  <div className='icon'>
                    <FaVideo />
                  </div>

                  <div className='icon'>
                    <label htmlFor='dot'><FaRocketchat /></label>
                  </div>
                </div>
              </div>

              <Message
                message={message}
                currentfriend={currentfriend}
                scrollRef={scrollRef}
                typingMessage={typingMessage}
              />

              <MessageSend
                inputHendle={inputHendle}
                newMessage={newMessage}
                sendMessage={sendMessage}
                emojiSend={emojiSend}
                ImageSend={ImageSend}
              />
            </div>
          </div>

          {/* Conditionally render FriendInfo based on toggle */}
          {!isDotChecked && (
            <div className='col-4'>
              <FriendInfo
                message={message}
                currentfriend={currentfriend}
                activeUser={activeUser}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSide;
