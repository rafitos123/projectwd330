const chatButton = document.getElementById("chatButton");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBody = document.getElementById("chatBody");

//show/hide chatbox
chatButton.onclick = () => chatBox.classList.add("show");
closeChat.onclick = () => chatBox.classList.remove("show");

//add message to chat
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}-message`;
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

//send message to server
sendBtn.onclick = async () => {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  addMessage("Typing...", "bot");

  try {
    const response = await fetch("https://projectwd330.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    const botReply = data.reply || "Sorry, I didn't understand";

    const lastBotMsg = chatBody.querySelector(".bot-message:last-child");
    if (lastBotMsg) lastBotMsg.textContent = botReply;
    else addMessage(botReply, "bot");

  } catch (error) {
    console.error("Erro na API Gemini:", error);
    addMessage("Erro ao conectar com a API Gemini.", "bot");
  }
};

