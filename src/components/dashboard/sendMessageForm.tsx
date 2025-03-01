'use client'

import { useState } from "react";

export default function SendMessageForm() {
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)


  async function sendMessage() {
    if (!newMessage.trim()) return;

    setLoading(true)

    try {
      const res = await fetch('/api/messages', {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      })

      if (!res.ok) throw new Error('Failed to send message');

      setNewMessage('')
      window.location.reload();

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  return (
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
        {loading ? 'Sending...' : 'Send'}
      </button>

    </div>
  )
}


