'use client'

import { useEffect, useState } from "react";

export default function Files() {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')


  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('/api/messages');
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        console.log(data)
        console.log(data.messages)
        setMessages(data.messages)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessages()
  }, []);

  async function sendMessage() {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      })

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json()
      setMessages(data.messages);
      setNewMessage('')

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Files</h1>
      <h1 className="text-xl font-bold mb-4">Messages API test</h1>

      <ul className="mb-4">
        {messages.map((msg, index) => (
          <li key={index} className="border p-2 mb-2 rounded">{msg}</li>
        ))}
      </ul>


      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 flex-1 rounded"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>

    </div>
  )
}


