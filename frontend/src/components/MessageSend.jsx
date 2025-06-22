import React, { useState } from 'react';
import { FaPlusCircle, FaFileImage, FaGift, FaPaperPlane } from "react-icons/fa";

const MessageSend = ({ inputHendle, newMessage, sendMessage, emojiSend, ImageSend }) => {
  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = [
    //'🗓️', '📅', // WhatsApp-style calendar emojis (Feb 24-like)
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '😏', '😒',
    '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
    '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰',
    '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶',
    '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮',
    '😲', '🥱', '😴', '🤤', '😪',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
    '👊', '✊', '👏', '🙌', '👐', '🙏', '🤲', '🤝',
    '🎉', '🎊', '🎈', '🥳', '💃', '🕺', '🪩', '🎂',
    '🎁', '🍰', '🍕', '🍔', '🍟', '🍻', '🍺', '🍹',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
    '🌞', '🌝', '🌚', '🌛', '🌜', '🌟', '✨', '🌈',
    '🔥', '💧', '🌊', '🍀', '🌻', '🌸', '🌼', '🌺',
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏍️', '🚲', '✈️',
    '🚁', '🚀', '⛵', '🚢',
    '💯', '✔️', '❌', '💤', '🔔', '📞', '💬', '📸'
  ];

  const handleEmojiClick = (emoji) => {
    emojiSend(emoji);
    setShowEmojis(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      sendMessage();
      setShowEmojis(false);
    }
  };

  return (
    <form className='message-send-section' onSubmit={handleSendMessage}>
      <div className='file hover-attachment'>
        <div className='add-attachment'>Add Attachment</div>
        <FaPlusCircle />
      </div>

      <div className='file hover-image'>
        <div className='add-image'>Add Image</div>
        <input onChange={ImageSend} type="file" id="pic" className='form-control' />
        <label htmlFor='pic'><FaFileImage /></label>
      </div>

      <div className='file hover-gift'>
        <div className='add-gift'>Add gift</div>
        <FaGift />
      </div>

      <div className='message-type'>
        <input
          type="text"
          onChange={inputHendle}
          name='message'
          id='message'
          placeholder='Aa'
          className='form-control'
          value={newMessage}
        />
        <div className='file hover-gift'>
          <span style={{ cursor: 'pointer' }} onClick={() => setShowEmojis(prev => !prev)}>❤</span>
        </div>
      </div>

      <button type="submit" className='file'>
        <FaPaperPlane />
      </button>

      {showEmojis && (
        <div className='emoji-section'>
          <div className='emoji'>
            {emojis.map((e, index) => (
              <span key={index} onClick={() => handleEmojiClick(e)}>{e}</span>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageSend;
