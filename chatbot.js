// AI Chatbot for Dr. Anna Brameli Website

(function() {
  'use strict';

  // Chatbot Configuration
  const CHATBOT_CONFIG = {
    name: 'עוזר וירטואלי - ד״ר ברמלי',
    welcomeMessage: 'שלום! אני העוזר הוירטואלי של מרפאת ד״ר אנה ברמלי. איך אוכל לעזור לך היום?',
    position: 'bottom-left', // or 'bottom-right'
    primaryColor: '#0066cc',
    enabled: true
  };

  // Quick reply buttons
  const QUICK_REPLIES = [
    { text: '📅 קביעת תור', action: 'appointment' },
    { text: '🏥 שירותים', action: 'services' },
    { text: '📍 איך מגיעים', action: 'location' },
    { text: '📞 צור קשר', action: 'contact' }
  ];

  // Pre-defined responses
  const RESPONSES = {
    appointment: 'לקביעת תור, אנא מלא את הטופס בדף. לחץ כאן לעבור לקביעת תור. ניתן גם ליצור קשר בטלפון: 054-580-8008',
    services: 'ד״ר ברמלי מתמחה ב:\n• אלרגיה למזון\n• אסתמה ילדים\n• נזלת אלרגית\n• אלרגיה לתרופות\n• דרמטיטיס אטופית\n• חסר חיסוני\n\nלמידע נוסף, גלול למטה לקטע השירותים.',
    location: 'המרפאה ממוקמת ב:\nמרכז רפואי שניידר לילדים\nרחוב קפלן 14, פתח תקווה\n\nלניווט: השתמש בכפתורי Waze או Google Maps בעמוד.',
    contact: 'ניתן ליצור קשר:\n📞 טלפון: 054-580-8008\n📧 דוא״ל: info@dr-anna-brameli.co.il\n\nשעות פעילות: א׳-ה׳ 08:00-16:00',
    default: 'תודה על פנייתך. לשירות טוב יותר, אנא בחר באחת האפשרויות למעלה או צור קשר ישיר בטלפון 054-580-8008'
  };

  // Create chatbot HTML structure
  function createChatbotUI() {
    if (!CHATBOT_CONFIG.enabled) return;

    const chatbotHTML = `
      <div id="chatbot-container" class="chatbot-container">
        <div id="chatbot-button" class="chatbot-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
            <path d="M7 9H9V11H7V9ZM11 9H13V11H11V9ZM15 9H17V11H15V9Z" fill="white"/>
          </svg>
        </div>
        
        <div id="chatbot-window" class="chatbot-window" style="display: none;">
          <div class="chatbot-header">
            <h3>${CHATBOT_CONFIG.name}</h3>
            <button id="chatbot-close" class="chatbot-close">×</button>
          </div>
          
          <div id="chatbot-messages" class="chatbot-messages">
            <div class="chatbot-message bot-message">
              ${CHATBOT_CONFIG.welcomeMessage}
            </div>
          </div>
          
          <div class="chatbot-quick-replies" id="chatbot-quick-replies">
            ${QUICK_REPLIES.map(reply => 
              `<button class="quick-reply-btn" data-action="${reply.action}">${reply.text}</button>`
            ).join('')}
          </div>
          
          <div class="chatbot-input">
            <input type="text" id="chatbot-input-field" placeholder="הקלד הודעה..." />
            <button id="chatbot-send">שלח</button>
          </div>
        </div>
      </div>
    `;

    // Inject chatbot into page
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Inject chatbot styles
    injectChatbotStyles();

    // Initialize event listeners
    initializeChatbot();
  }

  // Inject chatbot CSS
  function injectChatbotStyles() {
    const styles = `
      <style>
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          ${CHATBOT_CONFIG.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
          z-index: 9999;
          font-family: 'Heebo', sans-serif;
        }

        .chatbot-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${CHATBOT_CONFIG.primaryColor} 0%, #004d99 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
          transition: all 0.3s ease;
        }

        .chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
        }

        .chatbot-window {
          position: absolute;
          bottom: 80px;
          ${CHATBOT_CONFIG.position === 'bottom-right' ? 'right: 0;' : 'left: 0;'}
          width: 350px;
          max-width: calc(100vw - 40px);
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          max-height: 500px;
          display: flex;
          flex-direction: column;
        }

        .chatbot-header {
          background: linear-gradient(135deg, ${CHATBOT_CONFIG.primaryColor} 0%, #004d99 100%);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .chatbot-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.3s ease;
        }

        .chatbot-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f8f9fa;
          max-height: 300px;
        }

        .chatbot-message {
          margin-bottom: 12px;
          padding: 12px;
          border-radius: 12px;
          max-width: 80%;
          word-wrap: break-word;
          white-space: pre-line;
          font-size: 14px;
          line-height: 1.5;
        }

        .bot-message {
          background: white;
          color: #1a1a1a;
          border: 1px solid #e0e0e0;
          margin-left: auto;
          text-align: right;
        }

        .user-message {
          background: ${CHATBOT_CONFIG.primaryColor};
          color: white;
          margin-right: auto;
          text-align: right;
        }

        .chatbot-quick-replies {
          padding: 12px;
          background: white;
          border-top: 1px solid #e0e0e0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .quick-reply-btn {
          padding: 8px 12px;
          background: #f0f0f0;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Heebo', sans-serif;
        }

        .quick-reply-btn:hover {
          background: ${CHATBOT_CONFIG.primaryColor};
          color: white;
          border-color: ${CHATBOT_CONFIG.primaryColor};
        }

        .chatbot-input {
          display: flex;
          padding: 12px;
          background: white;
          border-top: 1px solid #e0e0e0;
        }

        .chatbot-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          outline: none;
          font-family: 'Heebo', sans-serif;
          font-size: 14px;
        }

        .chatbot-input input:focus {
          border-color: ${CHATBOT_CONFIG.primaryColor};
        }

        .chatbot-input button {
          margin-right: 8px;
          padding: 10px 20px;
          background: ${CHATBOT_CONFIG.primaryColor};
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Heebo', sans-serif;
          font-size: 14px;
          transition: background 0.3s ease;
        }

        .chatbot-input button:hover {
          background: #004d99;
        }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 40px);
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  // Initialize chatbot functionality
  function initializeChatbot() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const messagesContainer = document.getElementById('chatbot-messages');

    // Toggle chatbot window
    chatbotButton.addEventListener('click', () => {
      const isVisible = chatbotWindow.style.display !== 'none';
      chatbotWindow.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        chatbotInput.focus();
      }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', () => {
      chatbotWindow.style.display = 'none';
    });

    // Send message
    function sendMessage() {
      const message = chatbotInput.value.trim();
      if (message) {
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
          handleBotResponse(message);
        }, 500);
      }
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // Quick reply buttons
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');
    quickReplyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        addMessage(btn.textContent, 'user');
        setTimeout(() => {
          addMessage(RESPONSES[action] || RESPONSES.default, 'bot');
        }, 500);
      });
    });
  }

  // Add message to chat
  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender === 'bot' ? 'bot-message' : 'user-message'}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Handle bot response
  function handleBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword matching
    if (lowerMessage.includes('תור') || lowerMessage.includes('קביעה')) {
      addMessage(RESPONSES.appointment, 'bot');
    } else if (lowerMessage.includes('שירות') || lowerMessage.includes('טיפול')) {
      addMessage(RESPONSES.services, 'bot');
    } else if (lowerMessage.includes('איפה') || lowerMessage.includes('מיקום') || lowerMessage.includes('כתובת')) {
      addMessage(RESPONSES.location, 'bot');
    } else if (lowerMessage.includes('טלפון') || lowerMessage.includes('קשר')) {
      addMessage(RESPONSES.contact, 'bot');
    } else {
      addMessage(RESPONSES.default, 'bot');
    }
  }

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbotUI);
  } else {
    createChatbotUI();
  }

})();
