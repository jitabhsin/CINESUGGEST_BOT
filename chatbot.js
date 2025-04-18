class Chatbot {
    constructor() {
        this.defaultReply = "I'm here to help! How can I assist you?";

        this.responses = {
            hello: [
                "Hello! How can I assist you today?",
                "Hi there! What can I do for you?",
                "Hey! Need any help?"
            ],
            help: [
                "Sure! Let me know what you need help with.",
                "I'm here to assist. What do you need?",
                "Happy to help! Tell me more."
            ],
            bye: [
                "Goodbye! Have a great day!",
                "See you later! Take care!",
                "Bye! Feel free to reach out anytime."
            ],
            thanks: [
                "You're welcome!",
                "No problem!",
                "Glad I could help!",
                "Anytime! Let me know if you need anything else.",
                "Happy to assist! Feel free to ask more questions."
            ],
            howareyou: [
                "I'm just a bot, but I'm here to help!",
                "I don't have feelings, but I'm ready to assist you.",
                "I'm doing well, thanks for asking! How can I help you today?"
            ],
            whatcanyoudo: [
                "I can answer questions, provide information, and assist with various tasks.",
                "I can help with a wide range of topics. Just ask!",
                "I'm here to assist with any questions or tasks you have. Let's get started!"
            ],
            default: [
                "I'm not sure how to respond to that. Can you please clarify?",
                "I didn't understand that. Could you rephrase your question?",
                "I'm not sure what you mean. Can you provide more details?"
            ]
        };
    }

    handleMessage(message) {
        console.log(`User: ${message}`);
        if (!message || typeof message !== "string" || !message.trim()) {
            return "Please provide a valid message.";
        }
        return this.generateReply(message.trim().toLowerCase());
    }

    generateReply(message) {
        for (const keyword in this.responses) {
            if (message.includes(keyword)) {
                const replies = this.responses[keyword];
                return replies[Math.floor(Math.random() * replies.length)]; // Randomize response
            }
        }
        return this.defaultReply;
    }
}

// Example usage
const chatbot = new Chatbot();
const userMessages = ["Hello", "Can you help me?", "Bye", "Thanks", "Random text", "How are you?", "What can you do?"];
userMessages.forEach((msg) => {
    const reply = chatbot.handleMessage(msg);
    console.log(`Chatbot: ${reply}`);
});