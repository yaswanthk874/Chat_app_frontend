import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io("https://chat-backend-ylef.onrender.com");

function App() {
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  // Load messages from DB
  useEffect(() => {
    axios.get('http://localhost:5000/messages')
      .then(res => setMessages(res.data));

    // Listen for new messages
    socket.on('chat message', msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('chat message');
  }, []);

  const sendMessage = () => {
    if (!username || !text) return;

    const msg = { username, text };
    socket.emit('chat message', msg);
    setText('');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>💬 Real-Time Chat</h2>

      <input
        placeholder="Your name"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10, marginBottom: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.username}</b>: {m.text}
          </div>
        ))}
      </div>

      <input
        placeholder="Type your message"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
