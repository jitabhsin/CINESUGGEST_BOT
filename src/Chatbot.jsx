import React, { useState, useEffect, useRef } from 'react';
import { InferenceClient } from '@huggingface/inference'; // Import Hugging Face InferenceClient

export default function ChatbotComponent() {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [genre, setGenre] = useState('');
    const [preference, setPreference] = useState('');
    const messagesEndRef = useRef(null);

    // Use environment variable for the API token
    const client = new InferenceClient(process.env.REACT_APP_HF_TOKEN);

    const handleSend = async () => {
        if (!input.trim()) return;
        // Combine genre and preference with user input
        let combinedInput = input;
        if (genre) combinedInput = `Genre: ${genre}. ${combinedInput}`;
        if (preference) combinedInput = `Preference: ${preference}. ${combinedInput}`;
        const userMessage = { sender: 'user', text: combinedInput };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            // Fetch a response using Hugging Face InferenceClient
            const chatCompletion = await client.chatCompletion({
                provider: 'novita',
                model: 'deepseek-ai/DeepSeek-V3-0324',
                messages: [
                    ...messages.map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'assistant',
                        content: msg.text
                    })),
                    { role: 'user', content: combinedInput }
                ]
            });

            const botMessage = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
            setMessages(prev => [...prev, { sender: 'bot', text: botMessage }]);
        } catch (error) {
            console.error('Error fetching response:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' }]);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000', // Black background
            fontFamily: 'Arial, sans-serif',
            color: '#E0E0E0', // Light text color
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: '#181818', // Dark header
                color: '#E0E0E0',
                padding: '1rem',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                textAlign: 'center',
                borderBottom: '1px solid #222',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                letterSpacing: '2px',
            }}>
                CINESUGGEST
            </div>

            {/* Genre and Preference Selection */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#181818',
                padding: '0.5rem 1rem'
            }}>
                <select
                    value={genre}
                    onChange={e => setGenre(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid #222',
                        background: '#232323',
                        color: '#E0E0E0'
                    }}
                >
                    <option value="">Select Genre</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    {/* Add more genres as needed */}
                </select>
                <input
                    type="text"
                    value={preference}
                    onChange={e => setPreference(e.target.value)}
                    placeholder="Your preference (e.g. actor, mood)"
                    style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid #222',
                        background: '#232323',
                        color: '#E0E0E0',
                        width: '200px'
                    }}
                />
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#121212', // Dark background for messages
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                border: '1px solid #222',
                borderRadius: '8px',
                margin: '1rem',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === 'user' ? '#0078D7' : '#232323',
                            color: msg.sender === 'user' ? '#FFFFFF' : '#E0E0E0',
                            padding: '0.8rem 1.2rem',
                            borderRadius: '20px',
                            maxWidth: '70%',
                            fontSize: '1.2rem',
                            wordWrap: 'break-word',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid #222',
                backgroundColor: '#181818',
                display: 'flex',
                gap: '0.8rem',
                boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.3)',
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    style={{
                        flex: 1,
                        padding: '0.8rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid #222',
                        fontSize: '1.2rem',
                        backgroundColor: '#232323',
                        color: '#E0E0E0',
                        outline: 'none',
                    }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        backgroundColor: '#0078D7',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '20px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        transition: '0.3s',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#005BB5'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#0078D7'}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
