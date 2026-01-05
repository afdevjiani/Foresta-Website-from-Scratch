/*
 * Enhanced Chat Widget - Omniyat Style with AI Intelligence
 * Green & White Theme for Foresta Wood Industries
 * Powered by Google Gemini AI with Role-Based Personalization
 */

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAuONT5-aL_iXMSHWaKCpF3Jje7EJQk-Ec';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Company context for AI - Enhanced with role awareness
const COMPANY_CONTEXT = `You are Foresta's premium AI assistant - a luxury MDF and wood solutions company in UAE.

COMPANY PROFILE:
- 45+ years of manufacturing excellence
- Premium Products: Lami Gloss, Lami Matt, Marble & Acrylic MDF panels
- Certifications: ISO 9001:2015, E1 Grade emissions, FSC certified
- 100% sustainable, eco-friendly materials
- Strategic location at world's busiest port
- Contact: +971 54 786 2986 | reachus@foresta.ae
- Location: Umm Al Quwain, UAE
- Hours: Sunday-Thursday, 9 AM - 6 PM GST

COMMUNICATION STYLE:
- Professional, warm, and helpful
- Concise responses (max 80 words)
- Personalized to user's role and needs
- Always offer next steps or assistance`;

// Role-specific AI contexts
const ROLE_AI_CONTEXTS = {
  developers: `USER IS A DEVELOPER/CONTRACTOR:
    - Focus on bulk orders, project timelines, technical specs
    - Mention certifications and quality standards
    - Offer bulk pricing and project quotations
    - Emphasize reliability and large-scale capabilities`,
  
  joineries: `USER IS A JOINERY/WORKSHOP OWNER:
    - Focus on materials, dimensions, finishes
    - Mention stock availability and quick delivery
    - Offer wholesale/B2B pricing information
    - Emphasize consistent quality and variety`,
  
  architects: `USER IS AN ARCHITECT/DESIGNER:
    - Focus on aesthetics, textures, design options
    - Mention sustainability and eco-certifications
    - Offer samples and design catalogs
    - Emphasize unique finishes and customization`,
  
  showrooms: `USER IS A SHOWROOM OWNER:
    - Focus on display products and resale options
    - Mention partnership and dealer programs
    - Offer marketing support materials
    - Emphasize brand value and margins`,
  
  homeowners: `USER IS A HOME OWNER:
    - Use simple, non-technical language
    - Focus on visual appeal and budget
    - Mention maintenance and care tips
    - Emphasize easy contact options`
};

document.addEventListener('DOMContentLoaded', function () {
  const chatButton = document.getElementById('chatButton');
  const chatContainer = document.getElementById('chatContainer');
  const closeChat = document.getElementById('closeChat');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendChat = document.getElementById('sendChat');

  let isTyping = false;
  let conversationContext = [];

  // Enhanced response database with context awareness
  const responses = {
    greeting: {
      messages: [
        "celebrating our 20th anniversary and 20 Years of Imagining the Impossible.",
        "Welcome to Foresta Wood Industries! We're here to assist you with premium MDF and wood solutions."
      ],
      options: [
        { text: "View Product Catalogs", action: "catalogs" },
        { text: "Get Pricing Information", action: "pricing" },
        { text: "Contact Our Team", action: "contact" },
        { text: "About Our Company", action: "about" }
      ]
    },
    catalogs: {
      messages: [
        "Here are our premium product collections:",
        "• Lami Gloss - High-gloss MDF panels\n• Lami Matt - Matte finish MDF panels\n• Marble & Acrylic - Decorative solutions"
      ],
      options: [
        { text: "Download Catalogs", action: "download" },
        { text: "Speak with Sales", action: "contact" },
        { text: "Back to Main Menu", action: "greeting" }
      ]
    },
    pricing: {
      messages: [
        "Our pricing depends on several factors including panel type, quantity, and specifications.",
        "For accurate pricing tailored to your project:\n\nPhone: +971 54 786 2986\nEmail: reachus@foresta.ae\nContact: Islam Gaafar"
      ],
      options: [
        { text: "Request Quote", action: "quote" },
        { text: "Call Now", action: "call" },
        { text: "Back to Main Menu", action: "greeting" }
      ]
    },
    contact: {
      messages: [
        "Get in touch with our expert team:",
        "Phone: +971 54 786 2986\nEmail: reachus@foresta.ae\nLocation: Umm Al Quwain, UAE\nHours: Sunday-Thursday, 9 AM - 6 PM GST"
      ],
      options: [
        { text: "Send Email", action: "email" },
        { text: "Call Now", action: "call" },
        { text: "Back to Main Menu", action: "greeting" }
      ]
    },
    about: {
      messages: [
        "Foresta Wood Industries - 45 Years of Excellence",
        "We specialize in premium MDF panels and wood solutions with:\n\n✓ ISO 9001:2015 Certified\n✓ E1 Grade Standards\n✓ Sustainable Materials\n✓ UAE Manufacturing"
      ],
      options: [
        { text: "Quality Standards", action: "quality" },
        { text: "Sustainability", action: "sustainability" },
        { text: "Back to Main Menu", action: "greeting" }
      ]
    },
    quality: {
      messages: [
        "Our Quality Commitments:",
        "• ISO 9001:2015 Quality Management\n• E1 Grade Emission Standards\n• FSC Certified Materials\n• 45+ Years Manufacturing Experience\n• Rigorous Quality Control"
      ],
      options: [
        { text: "View Certifications", action: "certifications" },
        { text: "Back to Main Menu", action: "greeting" }
      ]
    },
    sustainability: {
      messages: [
        "Our Environmental Commitment:",
        "• 100% Sustainably sourced materials\n• Zero-waste manufacturing\n• Carbon-neutral logistics\n• Recyclable packaging\n• Reforestation programs"
      ],
      options: [
        { text: "Learn More", action: "about" },
        { text: "Back to Main Menu", action: "greeting" }
      ]
    }
  };

  // Initialize chat with welcome message
  function initChat() {
    if (!chatMessages.hasChildNodes()) {
      showWelcomeMessage();
    }
  }

  function showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'chat-welcome';
    welcomeDiv.innerHTML = `
      <div class="chat-welcome-title">${responses.greeting.messages[0]}</div>
      <div class="chat-welcome-text">${responses.greeting.messages[1]}</div>
      <div class="chat-welcome-text">Please select an option below to guide us in assisting you:</div>
    `;
    chatMessages.appendChild(welcomeDiv);
    
    showOptions(responses.greeting.options);
    scrollToBottom();
  }

  function showOptions(options) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'chat-options';
    
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-btn';
      btn.textContent = option.text;
      btn.onclick = () => handleOptionClick(option);
      optionsDiv.appendChild(btn);
    });
    
    chatMessages.appendChild(optionsDiv);
    scrollToBottom();
  }

  function handleOptionClick(option) {
    // Remove all option buttons
    document.querySelectorAll('.chat-options').forEach(el => el.remove());
    
    // Add user message
    addMessage(option.text, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Handle the action
    setTimeout(() => {
      removeTypingIndicator();
      handleAction(option.action);
    }, 800 + Math.random() * 400);
  }

  function handleAction(action) {
    if (responses[action]) {
      responses[action].messages.forEach((msg, index) => {
        setTimeout(() => {
          addMessage(msg, 'bot');
          
          if (index === responses[action].messages.length - 1 && responses[action].options) {
            setTimeout(() => showOptions(responses[action].options), 500);
          }
        }, index * 600);
      });
    } else if (action === 'call') {
      addMessage("Calling +971 54 786 2986...", 'bot');
      setTimeout(() => {
        window.location.href = 'tel:+971547862986';
      }, 1000);
    } else if (action === 'email') {
      addMessage("Opening email client...", 'bot');
      setTimeout(() => {
        window.location.href = 'mailto:reachus@foresta.ae?subject=Inquiry from Website';
      }, 1000);
    } else if (action === 'download') {
      addMessage("Our product catalogs are available in the Products section of our website. Redirecting...", 'bot');
      setTimeout(() => {
        window.location.href = '#products';
        closeChat.click();
      }, 1500);
    } else if (action === 'quote') {
      addMessage("Please provide your project details, and our team will prepare a customized quote for you:", 'bot');
      addMessage("Phone: +971 54 786 2986\\nEmail: reachus@foresta.ae", 'bot');
    }
  }

  function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = text;
    messageDiv.style.whiteSpace = 'pre-line';
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
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

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isTyping) return;
    
    addMessage(text, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    isTyping = true;
    
    // Check if it's a quick action keyword
    const quickKeywords = ['price', 'cost', 'catalog', 'product', 'contact', 'phone', 'email', 'quality', 'certificate', 'eco', 'sustain', 'about', 'hello', 'hi'];
    const hasQuickKeyword = quickKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    if (hasQuickKeyword) {
      // Use quick predefined responses
      setTimeout(() => {
        removeTypingIndicator();
        isTyping = false;
        handleUserMessage(text.toLowerCase());
      }, 800 + Math.random() * 400);
    } else {
      // Use AI for complex queries
      getAIResponse(text).then(response => {
        removeTypingIndicator();
        isTyping = false;
        addMessage(response, 'bot');
        
        // Suggest options after AI response
        setTimeout(() => {
          addMessage("How else can I help you?", 'bot');
          showOptions([
            { text: "View Products", action: "catalogs" },
            { text: "Get Pricing", action: "pricing" },
            { text: "Contact Us", action: "contact" }
          ]);
        }, 1000);
      }).catch(error => {
        console.error('AI Error:', error);
        removeTypingIndicator();
        isTyping = false;
        handleUserMessage(text.toLowerCase());
      });
    }
  }
  
  async function getAIResponse(userMessage) {
    // Get user role context for personalized responses
    const userRole = window.forestaUserRole || sessionStorage.getItem('forestaUserRole') || 'general';
    const roleContext = ROLE_AI_CONTEXTS[userRole] || '';
    
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${COMPANY_CONTEXT}

${roleContext}

CONVERSATION CONTEXT:
Previous messages: ${conversationContext.slice(-3).join(' | ')}

USER MESSAGE: ${userMessage}

INSTRUCTIONS:
- Provide a professional, personalized response
- Keep it concise (max 80 words)
- Be role-aware in your suggestions
- End with a helpful next step if appropriate`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      return aiResponse.trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I'd be happy to help! For immediate assistance, please contact our team at +971 54 786 2986 or email reachus@foresta.ae";
    }
  }

  function handleUserMessage(text) {
    // Intelligent keyword detection
    if (text.includes('price') || text.includes('cost') || text.includes('quote')) {
      handleAction('pricing');
    } else if (text.includes('catalog') || text.includes('product') || text.includes('panel')) {
      handleAction('catalogs');
    } else if (text.includes('contact') || text.includes('call') || text.includes('phone') || text.includes('email')) {
      handleAction('contact');
    } else if (text.includes('quality') || text.includes('certificate') || text.includes('iso')) {
      handleAction('quality');
    } else if (text.includes('eco') || text.includes('sustain') || text.includes('environment')) {
      handleAction('sustainability');
    } else if (text.includes('about') || text.includes('company') || text.includes('who')) {
      handleAction('about');
    } else if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      handleAction('greeting');
    } else {
      // Default helpful response
      addMessage("I'd be happy to help! Let me show you what I can assist with:", 'bot');
      setTimeout(() => showOptions(responses.greeting.options), 500);
    }
  }

  // Event Listeners
  if (chatButton) {
    chatButton.addEventListener('click', function() {
      chatContainer.classList.add('active');
      chatButton.style.display = 'none';
      initChat();
    });
  }

  if (closeChat) {
    closeChat.addEventListener('click', function() {
      chatContainer.classList.remove('active');
      chatButton.style.display = 'flex';
    });
  }

  if (sendChat) {
    sendChat.addEventListener('click', sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  console.log('Modern Omniyat-style chat initialized successfully!');
});
