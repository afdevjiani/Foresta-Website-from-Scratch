/*
 * Enhanced Chat Widget Functionality
 *
 * Modern chat interface with improved UX, typing indicators, better responses,
 * and enhanced accessibility. Features include smooth animations, intelligent
 * responses, and optimized mobile experience.
 */

document.addEventListener('DOMContentLoaded', function () {
  const chatButton = document.getElementById('chatButton');
  const chatContainer = document.getElementById('chatContainer');
  const closeChat = document.getElementById('closeChat');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendChat = document.getElementById('sendChat');

  // Debug: Check if elements exist
  console.log('Chat elements found:', {
    chatButton: !!chatButton,
    chatContainer: !!chatContainer,
    closeChat: !!closeChat,
    chatMessages: !!chatMessages,
    chatInput: !!chatInput,
    sendChat: !!sendChat
  });

  // Enhanced suggestions with emojis
  const suggestions = [
    ' Get Pricing',
    '📞 Contact Support'
  ];

  // Enhanced responses database
  const responses = {
    greetings: [
      "Hello! Welcome to Foresta Wood Industries. How can I help you today?",
      "Hi there! I'm here to assist you with any questions about our premium wood solutions.",
      "Welcome! Looking for information about our MDF panels and wood solutions?"
    ],
    catalog: [
      "I'd be happy to help you explore our premium product collections! Here are our latest catalogs:",
      "Here are our beautiful product catalogs showcasing our premium MDF solutions:",
      "Discover our extensive range of high-quality wood panels:"
    ],
    pricing: [
      "Our pricing is competitive and depends on several factors including panel type, quantity, and specifications. For accurate pricing tailored to your project needs, I’d recommend getting a personalized quote. ",
      "Pricing varies based on your specific requirements. Let me connect you with our sales team for detailed quotes:",
      "Contact Person: Islam Gaafar",  
"Phone: +971 56 102 2975",  
"Email: islam@foresta.ae"

    ],
    delivery: [
      "We offer comprehensive delivery services across the UAE and MENA region.",
      "Our strategic location near major ports ensures efficient and cost-effective delivery.",
      "Delivery times and costs depend on your location and order size."
    ],
    contact: [
      "Our expert team is ready to assist you! Here are the best ways to reach us:",
      "We're here to help! Contact our team through multiple channels:",
      "Get in touch with our knowledgeable support team:"
    ],
    quality: [
      "Quality is our top priority! All our products feature superior durability and finish.",
      "We maintain the highest standards with ISO certifications and rigorous quality control.",
      "Our panels are engineered for exceptional performance, strength, and longevity."
    ],
    sustainability: [
      "Sustainability is at the core of everything we do at Foresta.",
      "We source materials exclusively from sustainable, environmentally responsible forests.",
      "Our eco-friendly approach ensures we're contributing to a greener future."
    ]
  };

  let isTyping = false;
  let chatHistory = [];
  let chatOpenTime = 0;

  // Initialize chat widget
  function initializeChat() {
    console.log('Initializing chat widget...');
    
    // Chat button events
    if (chatButton) {
      console.log('Adding click event to chat button');
      chatButton.addEventListener('click', function(e) {
        console.log('Chat button clicked!', e);
        e.preventDefault();
        e.stopPropagation();
        openChat();
      });
      
      // Also add keyboard support
      chatButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          console.log('Chat button activated via keyboard');
          e.preventDefault();
          openChat();
        }
      });
      
      // Test if button is visible
      const rect = chatButton.getBoundingClientRect();
      console.log('Chat button position and size:', rect);
      console.log('Chat button styles:', window.getComputedStyle(chatButton));
    } else {
      console.error('Chat button not found!');
    }
    
    // Close button events
    if (closeChat) {
      closeChat.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeChatWindow();
      });
    }
    
    sendChat.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', handleKeyPress);
    
    // Enhanced keyboard navigation
    chatButton.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openChat();
      }
    });
    
    // Close chat when clicking outside - improved logic with delay
    let chatOpenTime = 0;
    document.addEventListener('click', function(e) {
      // Only allow closing after chat has been open for at least 500ms
      if (chatContainer.classList.contains('active') && 
          Date.now() - chatOpenTime > 500 &&
          !chatContainer.contains(e.target) && 
          !chatButton.contains(e.target) &&
          !e.target.classList.contains('suggestion') &&
          !e.target.closest('.chat-suggestions')) {
        closeChatWindow();
      }
    });
    
    // Prevent chat from closing when clicking inside
    if (chatContainer) {
      chatContainer.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
    
    // Escape key to close chat
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && chatContainer.classList.contains('active')) {
        closeChatWindow();
      }
    });
  }

  // Open chat with enhanced animation
  function openChat() {
    console.log('openChat function called');
    if (!chatContainer) {
      console.error('Chat container not found!');
      return;
    }
    
    chatContainer.classList.add('active');
    chatContainer.setAttribute('aria-hidden', 'false');
    console.log('Chat container classes after opening:', chatContainer.classList.toString());
    
    // Set open time for click-outside protection
    chatOpenTime = Date.now();
    
    // Show greeting if first time opening
    if (chatMessages.childElementCount === 0) {
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addBotMessage(getRandomResponse('greetings'));
          addSuggestions();
        }, 1500);
      }, 300);
    }
    
    // Focus on input for accessibility
    setTimeout(() => chatInput.focus(), 100);
  }

  // Close chat with enhanced animation
  function closeChatWindow() {
    if (chatContainer) {
      chatContainer.classList.remove('active');
      chatContainer.setAttribute('aria-hidden', 'true');
    }
    
    // Clear focus from chat elements
    if (document.activeElement && chatContainer && chatContainer.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  }

  // Handle keyboard interaction
  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Enhanced typing indicator
  function showTypingIndicator() {
    if (isTyping) return;
    isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
    isTyping = false;
  }

  // Get random response from category
  function getRandomResponse(category) {
    const responseList = responses[category] || responses.greetings;
    return responseList[Math.floor(Math.random() * responseList.length)];
  }

  // Add bot message with animation
  function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'bot';
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatHistory.push({ type: 'bot', message: text });
    scrollToBottom();
  }

  // Add user message with animation
  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'user';
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatHistory.push({ type: 'user', message: text });
    scrollToBottom();
  }

  // Enhanced suggestions with better styling
  function addSuggestions() {
    // Remove existing suggestions
    const existingSuggestions = chatMessages.querySelector('.chat-suggestions');
    if (existingSuggestions) {
      existingSuggestions.remove();
    }

    const wrap = document.createElement('div');
    wrap.className = 'chat-suggestions';
    
    suggestions.forEach((suggestion) => {
      const btn = document.createElement('button');
      btn.className = 'suggestion';
      btn.textContent = suggestion;
      btn.setAttribute('aria-label', `Quick option: ${suggestion}`);
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        chatInput.value = suggestion;
        sendMessage();
      });
      wrap.appendChild(btn);
    });
    
    chatMessages.appendChild(wrap);
    scrollToBottom();
  }

  // Smooth scroll to bottom
  function scrollToBottom() {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: 'smooth'
    });
  }

  // Enhanced response handling with intelligent matching
  function handleResponse(text) {
    const message = text.toLowerCase().trim();
    
    // Remove existing suggestions
    const existingSuggestions = chatMessages.querySelector('.chat-suggestions');
    if (existingSuggestions) {
      existingSuggestions.remove();
    }

    // Show typing indicator
    showTypingIndicator();

    setTimeout(() => {
      hideTypingIndicator();
      
      if (message.includes('catalog') || message.includes('product') || message.includes('📋')) {
        addBotMessage(getRandomResponse('catalog'));
        addBotMessage('• Premium Lami Gloss Collection: Modern high-gloss finishes');
        addBotMessage('• Lami Matt Collection: Elegant matte textures');
        addBotMessage('• Marble & Acrylic Series: Luxurious stone-inspired designs');
        addBotMessage('• Wood Grain Collection: Natural wood aesthetics');
        setTimeout(() => {
          addBotMessage('Would you like me to connect you with our product specialist for detailed specifications?');
        }, 1000);
        
      } else if (message.includes('price') || message.includes('pricing') || message.includes('cost') || message.includes('💰')) {
        addBotMessage(getRandomResponse('pricing'));
        addBotMessage("Our pricing is competitive and depends on several factors including panel type, quantity, and specifications. For accurate pricing tailored to your project needs, I’d recommend getting a personalized quote.");
        addBotMessage('Pricing varies based on your specific requirements. Let me connect you with our sales team for detailed quotes:');
        addBotMessage('Contact Person: Islam Gaafar');
        addBotMessage('Phone: +971 56 102 2975');
        addBotMessage('Email: islam@foresta.ae');
        setTimeout(() => {
          addBotMessage('Shall I arrange for a sales representative to provide you with a detailed quote?');
        }, 1500);
        
      } else if (message.includes('deliver') || message.includes('shipping') || message.includes('🚚')) {
        addBotMessage(getRandomResponse('delivery'));
        addBotMessage('🚚 Delivery Coverage:');
        addBotMessage('• UAE: 1-3 business days');
        addBotMessage('• GCC Countries: 3-7 business days');
        addBotMessage('• MENA Region: 5-14 business days');
        setTimeout(() => {
          addBotMessage('Need help calculating delivery costs for your location?');
        }, 1200);
        
      } else if (message.includes('contact') || message.includes('support') || message.includes('📞')) {
        addBotMessage(getRandomResponse('contact'));
        addBotMessage('📞 Phone: +971 54 786 2986');
        addBotMessage('✉️ Email: reachus@foresta.ae');
        addBotMessage('🕒 Hours: Sunday-Thursday, 9 AM - 6 PM GST');
        addBotMessage('📍 Location: Umm Al Quwain, UAE');
        
      } else if (message.includes('quality') || message.includes('certification') || message.includes('standard')) {
        addBotMessage(getRandomResponse('quality'));
        addBotMessage('🏆 Our Quality Standards:');
        addBotMessage('• ISO 9001:2015 Quality Management');
        addBotMessage('• E1 Grade Emission Standards');
        addBotMessage('• FSC Certified Materials');
        addBotMessage('• 40+ Years Manufacturing Experience');
        
      } else if (message.includes('eco') || message.includes('environment') || message.includes('sustainable')) {
        addBotMessage(getRandomResponse('sustainability'));
        addBotMessage('🌱 Our Environmental Commitments:');
        addBotMessage('• 100% sustainably sourced materials');
        addBotMessage('• Zero-waste manufacturing processes');
        addBotMessage('• Carbon-neutral logistics');
        addBotMessage('• Recyclable packaging materials');
        
      } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        addBotMessage(getRandomResponse('greetings'));
        
      } else {
        addBotMessage('Thank you for your inquiry! Our team will review your message and get back to you with detailed information.');
        setTimeout(() => {
          addBotMessage('In the meantime, feel free to explore our product catalogs or contact us directly for immediate assistance.');
        }, 1000);
      }
      
      // Add suggestions after response
      setTimeout(() => {
        addSuggestions();
      }, 2000);
      
    }, Math.random() * 1000 + 800); // Random delay to simulate human response
  }

  // Enhanced send message function
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isTyping) return;
    
    addUserMessage(text);
    chatInput.value = '';
    handleResponse(text);
  }

  // Initialize the chat widget only if all required elements exist
  if (chatButton && chatContainer && closeChat && chatMessages && chatInput && sendChat) {
    console.log('All chat elements found, initializing chat...');
    initializeChat();
  } else {
    console.error('Some chat elements are missing:', {
      chatButton: !!chatButton,
      chatContainer: !!chatContainer,
      closeChat: !!closeChat,
      chatMessages: !!chatMessages,
      chatInput: !!chatInput,
      sendChat: !!sendChat
    });
  }

  // Add CSS for typing indicator
  const style = document.createElement('style');
  style.textContent = `
    .typing-indicator {
      padding: var(--space-md) var(--space-lg) !important;
    }
    
    .typing-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    
    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--muted);
      animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    .typing-dots span:nth-child(2) {
      animation-delay: -0.16s;
    }
    
    @keyframes typing {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
});
