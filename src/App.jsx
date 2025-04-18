import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ChatbotComponent from './Chatbot'; // Import ChatbotComponent

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chatbot" element={<ChatbotComponent />} />
            </Routes>
        </Router>
    );
}

export default App;
