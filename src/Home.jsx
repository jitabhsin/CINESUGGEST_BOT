import { useState } from 'react';
import { InferenceClient } from '@huggingface/inference';

export default function Home() {
    const [genre, setGenre] = useState('');
    const [preference, setPreference] = useState('');
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    // Use environment variable for the API token
    const client = new InferenceClient(process.env.REACT_APP_HF_TOKEN);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        setResponse('');
        let prompt = '';
        if (genre) prompt += `Genre: ${genre}. `;
        if (preference) prompt += `Preference: ${preference}. `;
        prompt += input;

        try {
            const chatCompletion = await client.chatCompletion({
                provider: 'novita',
                model: 'deepseek-ai/DeepSeek-V3-0324',
                messages: [
                    { role: 'user', content: prompt }
                ]
            });
            const botMessage = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
            setResponse(botMessage);
        } catch (err) {
            setResponse('Sorry, something went wrong. Please try again later.');
        }
        setLoading(false);
    };

    function formatResponse(text) {
        const lines = text
            .split(/\n|(?=\d+\.)|(?=•)/)
            .map(line => line.trim())
            .filter(line => line.length > 0);
        if (lines.length <= 1) return <span>{text}</span>;
        return (
            <ul style={{ paddingLeft: '1.5em', margin: 0 }}>
                {lines.map((line, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5em', lineHeight: 1.6 }}>{line.replace(/^(\d+\.\s*|•\s*)/, '')}</li>
                ))}
            </ul>
        );
    }

    return (
        <div
            style={{
                minHeight: '92vh',
                minWidth: '92vw',
                background: 'linear-gradient(120deg, #18181c 0%, #232526 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                color: '#E0E0E0',
                overflow: 'hidden',
            }}
        >
            <main
                style={{
                    background: 'rgba(30,32,38,0.85)',
                    borderRadius: '40px',
                    boxShadow: '0 20px 80px 0 rgba(0,0,0,0.70)',
                    padding: '5.5rem 6rem 4.5rem 6rem',
                    minWidth: '900px',
                    maxWidth: '99vw',
                    minHeight: '700px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    backdropFilter: 'blur(18px) saturate(180%)',
                    border: '2px solid rgba(255,255,255,0.10)',
                    position: 'relative',
                    fontSize: '1.35rem', // Increased base font size for the box
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '2.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    textAlign: 'center',
                }}>
                    <h1
                        style={{
                            fontSize: '3.8rem',
                            fontWeight: 800,
                            letterSpacing: '0.18em',
                            color: '#fff',
                            margin: 0,
                            textShadow: '0 6px 32px rgba(0,0,0,0.7)',
                            userSelect: 'none',
                            fontFamily: 'Segoe UI, Arial, sans-serif',
                        }}
                    >
                        CINESUGGEST
                    </h1>
                    <p style={{
                        fontSize: '1.35rem',
                        color: '#cfcfcf',
                        margin: '1.2rem 0 0 0',
                        textAlign: 'center',
                        fontWeight: 400,
                        letterSpacing: '0.03em',
                        textShadow: '0 2px 8px rgba(0,0,0,0.18)',
                        maxWidth: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Get instant movie recommendations tailored to your genre and preferences.
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.7rem',
                        width: '100%',
                        alignItems: 'center',
                        marginTop: '8.5rem',
                    }}
                >
                    <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                        <select
                            value={genre}
                            onChange={e => setGenre(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '1.2rem 1.3rem',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'rgba(40,40,48,0.98)',
                                color: '#fff',
                                fontSize: '1.12rem',
                                outline: 'none',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
                                transition: 'background 0.2s',
                                fontWeight: 500,
                            }}
                        >
                            <option value="">Select Genre</option>
                            <option value="Action">Action</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Drama">Drama</option>
                            <option value="Horror">Horror</option>
                            <option value="Romance">Romance</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                        </select>
                        <input
                            type="text"
                            value={preference}
                            onChange={e => setPreference(e.target.value)}
                            placeholder="Preference (actor, mood, etc)"
                            style={{
                                flex: 2,
                                padding: '1.2rem 1.3rem',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'rgba(40,40,48,0.98)',
                                color: '#fff',
                                fontSize: '1.12rem',
                                outline: 'none',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
                                fontWeight: 500,
                            }}
                        />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Describe what you want to watch..."
                        style={{
                            width: '100%',
                            padding: '1.3rem',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'rgba(40,40,48,0.98)',
                            color: '#fff',
                            fontSize: '1.22rem',
                            outline: 'none',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
                            fontWeight: 500,
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1.5rem',
                            fontSize: '1.5rem', // Increased button font size
                            fontWeight: 800,
                            background: 'linear-gradient(90deg, #FFD700 0%, #FFB300 100%)',
                            color: '#181818',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '0.7rem',
                            boxShadow: '0 2px 24px rgba(255,215,0,0.13)',
                            transition: 'background 0.2s, box-shadow 0.2s',
                            opacity: loading ? 0.7 : 1,
                            letterSpacing: '0.04em',
                            textShadow: '0 1px 6px rgba(255,255,255,0.08)',
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Get Recommendation'}
                    </button>
                </form>
                {response && (
                    <div
                        style={{
                            marginTop: '2.7rem',
                            background: 'rgba(35,42,52,0.98)',
                            borderRadius: '22px',
                            padding: '2.2rem 2.1rem',
                            color: '#fff',
                            minHeight: '90px',
                            width: '100%',
                            boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
                            fontSize: '1.35rem', // Increased font size for response box
                            textAlign: 'left',
                            wordBreak: 'break-word',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <strong style={{ color: '#FFD700', fontWeight: 800, fontSize: '1.18em' }}>Recommendation:</strong>
                        <div style={{ marginTop: '1.1rem' }}>
                            {formatResponse(response)}
                        </div>
                    </div>
                )}
                <footer style={{
                    marginTop: '3.5rem',
                    padding: '1.5rem 0 0.5rem 0',
                    width: '100%',
                    textAlign: 'center',
                    color: '#b0b0b0',
                    fontSize: '1.08rem',
                    letterSpacing: '0.05em',
                    opacity: 0.7,
                    userSelect: 'none'
                }}>
                    &copy; {new Date().getFullYear()} CINESUGGEST. All rights reserved.
                </footer>
            </main>
        </div>
    );
}
