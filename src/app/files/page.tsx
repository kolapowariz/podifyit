import SendMessageForm from "@/components/dashboard/sendMessageForm";


async function fetchMessages() {
  const res = await fetch('http://localhost:3000/api/messages', {
    cache: 'no-store'
  })

  if (!res.ok) throw new Error('Failed to fetch messages');

  const data = await res.json()
  return data.messages;
}


export default async function Files() {
  const messages = await fetchMessages()



  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Files</h1>
      <h1 className="text-xl font-bold mb-4">Messages API test</h1>

      <ul className="mb-4">
        {messages.map((msg: string, index: number) => (
          <li key={index} className="border p-2 mb-2 rounded">{msg}</li>
        ))}
      </ul>


      <SendMessageForm />
    </div>
  )
}


