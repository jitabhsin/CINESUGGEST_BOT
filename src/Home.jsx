import { useState } from 'react';
import { InferenceClient } from '@huggingface/inference';

const bannerChip = {
  background: 'rgba(255,255,255,0.9)',
  color: '#232526', // revert to dark text
  borderRadius: '12px',
  padding: '0.4em 1em',
  fontWeight: 600,
  fontSize: '1em',
  margin: '0.3em',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  border: '1px solid #FFD700', // yellow border
  display: 'inline-block'
};

export default function Home() {
  const [genre, setGenre] = useState('');
  const [preference, setPreference] = useState('');
  const [year, setYear] = useState(''); // Add year state
  const [input, setInput] = useState('');
  const [responseBoxes, setResponseBoxes] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiToken = process.env.REACT_APP_HF_TOKEN;
  const client = new InferenceClient(apiToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    let prompt = '';
    if (genre) prompt += `Genre: ${genre}. `;
    if (preference) prompt += `Preference: ${preference}. `;
    if (year) prompt += `Year: ${year}. `; // Add year to prompt
    prompt += input;

    try {
      const chatCompletion = await client.chatCompletion({
        provider: 'novita',
        model: 'deepseek-ai/DeepSeek-V3-0324',
        messages: [{ role: 'user', content: prompt }]
      });
      const botMessage = chatCompletion.choices[0]?.message?.content || 'No response generated.';
      setResponseBoxes(prev => [...prev, { id: Date.now(), content: botMessage }]);
    } catch {
      setResponseBoxes(prev => [...prev, { id: Date.now(), content: 'Something went wrong. Try again later.' }]);
    }
    setLoading(false);
    setInput('');
  };

  const formatResponse = (text) => {
    // Split into possible suggestions (lines or list items)
    const lines = text
      .split(/\n|(?=\d+\.)|(?=•)/)
      .map(line => line.trim())
      .filter(Boolean);

    // Extract info using regex for each suggestion
    const suggestions = lines.map(line => {
      // Try to extract: Title (Year) by Creator, Company. Rating: X
      // Example: "Inception (2010) by Christopher Nolan, Warner Bros. Rating: 8.8"
      const match = line.match(
        /^(?<title>[^(\n]+)\s*\((?<year>\d{4})\)?(?:\s*by\s*(?<creator>[^,]+))?(?:,\s*(?<company>[^.]+))?(?:\.?\s*Rating[:\-]?\s*(?<rating>\d+(\.\d+)?))?/i
      );
      if (!match || !match.groups) return null;
      const { title, year, creator, company, rating } = match.groups;
      return {
        title: title?.trim(),
        year: year?.trim(),
        creator: creator?.trim(),
        company: company?.trim(),
        rating: rating ? parseFloat(rating) : null,
        raw: line
      };
    }).filter(s => s && s.rating);

    // Sort by rating descending
    suggestions.sort((a, b) => b.rating - a.rating);

    // If no suggestions with rating, fallback to original lines
    if (suggestions.length === 0) {
      return (
        <ul style={{ paddingLeft: '1.5em', marginBottom: 0 }}>
          {lines.map((line, i) => (
            <li key={i} style={{ marginBottom: '0.4em', lineHeight: 1.7 }}>
              {line}
            </li>
          ))}
        </ul>
      );
    }

    // Render structured output
    return (
      <ul style={{ paddingLeft: '1.5em', marginBottom: 0 }}>
        {suggestions.map((s, i) => (
          <li key={i} style={{ marginBottom: '0.7em', lineHeight: 1.7 }}>
            <strong>{s.title}</strong>
            {s.year && <> ({s.year})</>}
            {s.creator && <> by {s.creator}</>}
            {s.company && <>, {s.company}</>}
            {s.rating && <> — <span style={{ color: '#FFD700' }}>Rating: {s.rating}</span></>}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #18181c 0%, #232526 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#E0E0E0'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '100vh',
        gap: '2.5rem'
      }}>
        {/* Left Column */}
        <aside style={{
          flex: '0 0 260px',
          padding: '2.5rem 1.2rem 2.5rem 0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          color: '#FFD700',
          fontSize: '1.08rem',
          background: 'rgba(255,215,0,0.06)',
          borderRight: '1.5px solid rgba(255,215,0,0.13)',
          minHeight: '100vh',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          borderRadius: '0 24px 24px 0',
          boxShadow: '2px 0 16px 0 rgba(255,215,0,0.06)'
        }}>
          <div style={{
            marginTop: '2rem',
            background: 'rgba(40,40,40,0.14)',
            borderRadius: '18px',
            padding: '1.2rem 1rem',
            boxShadow: '0 2px 10px 0 rgba(255,215,0,0.04)'
          }}>
            <h3 style={{color: '#FFD700', fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.7em'}}>How CineSuggest Works</h3>
            <ul style={{margin: '0 0 0 1em', padding: 0, color: '#FFD700', fontSize: '1rem', lineHeight: 1.7, listStyle: 'disc'}}>
              <li>Choose a genre and year.</li>
              <li>Add your preferences.</li>
              <li>Ask for recommendations.</li>
              <li>Get structured, rated suggestions!</li>
            </ul>
          </div>
        </aside>
        {/* Main Content */}
        <main style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '2.5rem auto',
          padding: '2.5rem 1.5rem',
          minHeight: '100vh',
          background: 'rgba(30,32,38,0.97)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          border: '1.5px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: '#FFD700',
              marginBottom: '1rem',
              letterSpacing: '0.04em',
              textShadow: '0 2px 12px rgba(255,215,0,0.08)'
            }}>CineSuggest</h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#ccc',
              maxWidth: '600px',
              margin: 'auto',
              marginBottom: '1.5rem'
            }}>
              Discover movie, anime, manga, books, and more based on your taste instantly!
            </p>
            <div style={{
              marginTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5em'
            }}>
              {['Movies', 'Anime', 'Manga', 'Books', 'Manhwa', 'Web Series', 'Talk Shows', 'Reality Shows', 'Custom'].map(item =>
                <span key={item} style={bannerChip}>{item}</span>
              )}
            </div>
          </header>

          <form onSubmit={handleSubmit} style={{
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            alignItems: 'center',
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '18px',
            boxShadow: '0 2px 12px rgba(255,215,0,0.04)',
            padding: '1.5rem 1rem'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              width: '100%'
            }}>
              <select value={genre} onChange={e => setGenre(e.target.value)} style={selectStyle}>
                <option value=''>Select Genre</option>
                {[ 'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Anime', 'Manga', 'Books' ].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {/* Year selection dropdown */}
              <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
                <option value=''>Select Year</option>
                {Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <input value={preference} onChange={e => setPreference(e.target.value)} placeholder='Enter Preferences (optional)' style={inputStyle} />
              <input value={input} onChange={e => setInput(e.target.value)} placeholder='Ask something...' required style={inputStyle} />
            </div>
            <button type='submit' style={buttonStyle} disabled={loading}>{loading ? 'Thinking...' : 'Suggest'}</button>
          </form>

          <section style={{ marginTop: '2.5rem', width: '100%' }}>
            {responseBoxes.map(({ id, content }) => (
              <div key={id} style={{
                ...responseBoxStyle,
                border: '1.5px solid #FFD700',
                background: 'rgba(255,215,0,0.07)',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 24px rgba(255,215,0,0.08)'
              }}>
                {formatResponse(content)}
              </div>
            ))}
          </section>
        </main>
        {/* Right Column */}
        <aside style={{
          flex: '0 0 260px',
          padding: '2.5rem 0 2.5rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          color: '#FFD700',
          fontSize: '1.08rem',
          background: 'rgba(255,215,0,0.06)',
          borderLeft: '1.5px solid rgba(255,215,0,0.13)',
          minHeight: '100vh',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          borderRadius: '24px 0 0 24px',
          boxShadow: '-2px 0 16px 0 rgba(255,215,0,0.06)'
        }}>
          <div style={{
            marginTop: '2rem',
            background: 'rgba(40,40,40,0.14)',
            borderRadius: '18px',
            padding: '1.2rem 1rem',
            boxShadow: '0 2px 10px 0 rgba(255,215,0,0.04)'
          }}>
            <h3 style={{color: '#FFD700', fontWeight: 700, fontSize: '1.18rem', marginBottom: '0.7em'}}>Did You Know?</h3>
            <ul style={{margin: '0 0 0 1em', padding: 0, color: '#FFD700', fontSize: '1rem', lineHeight: 1.7, listStyle: 'disc'}}>
              <li>Supports movies, anime, manga, books, and more.</li>
              <li>Results are sorted by rating.</li>
              <li>Try different years for varied results.</li>
              <li>Discover hidden gems and classics alike.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: '0.85rem 1rem',
  borderRadius: '12px',
  border: '1.5px solid #FFD700',
  background: 'rgba(255,215,0,0.11)',
  color: '#fff', // changed from #232526 to #fff for better visibility
  fontSize: '1rem',
  outline: 'none',
  boxShadow: '0 2px 8px rgba(255,215,0,0.07)',
  transition: 'border 0.2s, box-shadow 0.2s'
};

const selectStyle = {
  ...inputStyle,
  backgroundColor: '#232526',
  color: '#fff',
  border: '1.5px solid #FFD700',
};

const buttonStyle = {
  padding: '0.8rem 2rem',
  borderRadius: '14px',
  border: 'none',
  background: '#FFD700',
  color: '#232526',
  fontSize: '1.1rem',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: '1rem',
  boxShadow: '0 4px 14px rgba(255,215,0,0.13)',
  transition: 'background 0.2s, box-shadow 0.2s'
};

const responseBoxStyle = {
  background: 'rgba(255,215,0,0.10)',
  borderRadius: '16px',
  padding: '1.25rem',
  marginBottom: '1.5rem',
  color: '#FFD700',
  lineHeight: 1.6,
  fontSize: '1.08rem'
};
