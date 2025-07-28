import DefaultLayout from '../layouts/default';
import axios from 'axios';
import { useState } from 'react';
import { HiMiniPaperAirplane } from 'react-icons/hi2';

export default function IndexPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: input, // Mengirimkan pesan dari pengguna ke API
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': 'AIzaSyCj-6mKI0kpvauRtcvhhKYu76tztuaTD8s', // Gantilah dengan API key yang valid
          },
        }
      );

      // Log respons untuk melihat struktur data
      console.log('Response:', response.data);

      // Akses data dari kandidat yang pertama dan ambil teksnya
      const botMessageText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (botMessageText) {
        const botMessage = { text: botMessageText, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.error('No valid response from the API.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className="text-3xl font-bold text-center">ChatBOT dari Gemini - Rizal Sujana</h1>
        <div className="flex flex-col items-center max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-lg">
          <div className="w-full h-96 overflow-auto space-y-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex w-full space-x-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tulis pesan..."
            />
            <button onClick={sendMessage} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <HiMiniPaperAirplane className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
