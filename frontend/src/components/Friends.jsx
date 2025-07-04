import React from 'react';
import moment from 'moment';
import { FaRegCheckCircle } from "react-icons/fa";

const Friends = (props) => {
  const { fndInfo, msgInfo } = props.friend;
  const myId = props.myId;
  const { activeUser } = props;

const renderProfileImage = (img) => {
    if (!img || !img.data) return null;
    const base64String = `data:${img.contentType};base64,${btoa(
      new Uint8Array(img.data.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    )}`;
    return <img alt='' src={base64String} />;
  };
  return (
    <div className='friend'>
      <div className='friend-image'>
        <div className='image'>
          {renderProfileImage(fndInfo.image)}
          {
            activeUser?.length > 0 && activeUser.some(u => u.userId === fndInfo._id) ?
              <div className='active_icon'></div> : ''
          }
        </div>
      </div>

      <div className='friend-name-seen'>
        <div className='friend-name'>
          <h4 className={
            msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen'
              ? 'unseen_message Fd_name'
              : 'Fd_name'
          }>
            {fndInfo.userName}
          </h4>

          <div className='msg-time'>
            {
              msgInfo?.senderId === myId
                ? <span>You: </span>
                : <span className={
                    msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen'
                      ? 'unseen_message'
                      : ''
                  }>
                    {fndInfo.userName}:
                  </span>
            }

            {
              msgInfo?.message.text
                ? <span className={
                    msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen'
                      ? 'unseen_message'
                      : ''
                  }>
                    {" " + msgInfo.message.text.slice(0, 10)}
                  </span>
                : msgInfo?.message.image?.data
                  ? <span>Sent an image</span>
                  : <span>Connect You</span>
            }

            <span>
              {
                msgInfo
                  ? ' ' + moment(msgInfo.createdAt).startOf('mini').fromNow()
                  : ' ' + moment(fndInfo.createdAt).startOf('mini').fromNow()
              }
            </span>
          </div>
        </div>

        {
          myId === msgInfo?.senderId ?
            <div className='seen-unseen-icon'>
              {
                msgInfo.status === 'seen'
                  ? renderProfileImage(fndInfo.image)
                  : msgInfo.status === 'delivared'
                    ? <div className='delivared'><FaRegCheckCircle /></div>
                    : <div className='unseen'></div>
              }
            </div>
            :
            <div className='seen-unseen-icon'>
              {
                msgInfo?.status !== undefined && msgInfo.status !== 'seen'
                  ? <div className='seen-icon'></div>
                  : ''
              }
            </div>
        }
      </div>
    </div>
  );
};

export default Friends;
