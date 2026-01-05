// Foresta Wood Industries - JavaScript Functions

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
    
    console.log('DOM loaded, initializing menu'); // Debug
    
    // Menu elements
    const menuToggle = document.getElementById('menuToggle');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const menuImageOverlay = document.getElementById('menuImageOverlay');
    const menuClose = document.getElementById('menuClose');
    
    console.log('Menu toggle found:', !!menuToggle); // Debug
    console.log('Fullscreen menu found:', !!fullscreenMenu); // Debug
    
    // Open fullscreen menu
    if (menuToggle && fullscreenMenu && menuImageOverlay) {
        menuToggle.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu toggle clicked!'); // Debug
            fullscreenMenu.classList.add('active');
            menuImageOverlay.classList.add('active');
            menuToggle.classList.add('active');
            document.body.classList.add('menu-active');
            return false;
        };
    }
    
    // Close fullscreen menu
    if (menuClose && fullscreenMenu && menuImageOverlay) {
        menuClose.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close menu clicked!'); // Debug
            fullscreenMenu.classList.remove('active');
            menuImageOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-active');
            return false;
        };
    }
    
    // Close menu when clicking nav items in fullscreen menu
    if (fullscreenMenu && menuImageOverlay) {
        const fullscreenNavLinks = fullscreenMenu.querySelectorAll('a');
        fullscreenNavLinks.forEach(function(item) {
            item.onclick = function() {
                fullscreenMenu.classList.remove('active');
                menuImageOverlay.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
                document.body.classList.remove('menu-active');
            };
        });
    }
    
    // Close menu when clicking on the image overlay
    if (menuImageOverlay && fullscreenMenu) {
        menuImageOverlay.onclick = function() {
            fullscreenMenu.classList.remove('active');
            menuImageOverlay.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.classList.remove('menu-active');
        };
    }
    
    // Enhanced Header Scroll Effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for styling
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Auto-hide header when scrolling down fast
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up or at top - show header
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Parallax effects disabled for static navbar
    /*
    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            // Add subtle 3D tilt effect
            this.style.transform = `translateY(-3px) rotateX(5deg) translateZ(10px) rotateY(${index % 2 === 0 ? '2deg' : '-2deg'})`;
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    */
    
    // Logo 3D interaction - keeping this for brand interaction
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotateY(5deg) translateZ(10px)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }

    // Chat Widget
    const chatButton = document.getElementById('chatButton');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChat');
    const sendChat = document.getElementById('sendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (chatButton && chatContainer) {
        chatButton.addEventListener('click', function() {
            chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
        });

        if (closeChat) {
            closeChat.addEventListener('click', function() {
                chatContainer.style.display = 'none';
            });
        }

        if (sendChat && chatInput) {
            sendChat.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';

            // Simulate bot response
            setTimeout(() => {
                addMessage("Thank you for your message! Our team will get back to you soon. For immediate assistance, please call +971 6 5684786.", 'bot');
            }, 1000);
        }
    }

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Enhanced Mobile Select Dropdown - Custom Implementation
    function enhanceMobileSelect() {
        const isMobile = window.innerWidth <= 768;
        const selectElement = document.getElementById('subject');
        
        if (isMobile && selectElement && !selectElement.dataset.customized) {
            selectElement.dataset.customized = 'true';
            
            // Create custom dropdown
            const customDropdown = document.createElement('div');
            customDropdown.className = 'custom-mobile-dropdown';
            customDropdown.innerHTML = `
                <div class="custom-select-trigger">
                    <span class="custom-select-text">Select a topic...</span>
                    <div class="custom-select-arrow">▼</div>
                </div>
                <div class="custom-select-options" style="display: none;">
                    <div class="custom-option" data-value="">Select a topic...</div>
                    <div class="custom-option" data-value="product-inquiry">Product Inquiry</div>
                    <div class="custom-option" data-value="quote-request">Quote Request</div>
                    <div class="custom-option" data-value="technical-support">Technical Support</div>
                    <div class="custom-option" data-value="partnership">Partnership</div>
                    <div class="custom-option" data-value="other">Other</div>
                </div>
            `;
            
            // Hide original select and add custom dropdown
            selectElement.style.display = 'none';
            selectElement.parentNode.appendChild(customDropdown);
            
            // Add custom dropdown functionality
            const trigger = customDropdown.querySelector('.custom-select-trigger');
            const options = customDropdown.querySelector('.custom-select-options');
            const textElement = customDropdown.querySelector('.custom-select-text');
            const arrow = customDropdown.querySelector('.custom-select-arrow');
            
            // Toggle dropdown
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const isOpen = options.style.display === 'block';
                options.style.display = isOpen ? 'none' : 'block';
                arrow.textContent = isOpen ? '▼' : '▲';
                arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            });
            
            // Handle option selection
            options.addEventListener('click', function(e) {
                if (e.target.classList.contains('custom-option')) {
                    const value = e.target.dataset.value;
                    const text = e.target.textContent;
                    
                    // Update original select
                    selectElement.value = value;
                    
                    // Update custom dropdown
                    textElement.textContent = text;
                    textElement.style.color = value ? '#333' : '#999';
                    
                    // Close dropdown
                    options.style.display = 'none';
                    arrow.textContent = '▼';
                    arrow.style.transform = 'rotate(0deg)';
                    
                    // Trigger change event
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!customDropdown.contains(e.target)) {
                    options.style.display = 'none';
                    arrow.textContent = '▼';
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        }
    }

    // Initialize mobile select enhancement
    enhanceMobileSelect();
    
    // Re-enhance on window resize
    window.addEventListener('resize', enhanceMobileSelect);

    // Contact Form with Email Integration
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Initialize EmailJS
    emailjs.init("614VLrCVpLFN3izit");
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.querySelector('.button-text').textContent;
            submitBtn.querySelector('.button-text').textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Prepare email data
                const formData = new FormData(contactForm);
                const templateParams = {
                    from_name: formData.get('name'),
                    from_email: formData.get('email'),
                    phone: formData.get('phone') || 'Not provided',
                    company: formData.get('company') || 'Not provided',
                    subject: formData.get('subject') || 'General Inquiry',
                    message: formData.get('message'),
                    newsletter: formData.get('newsletter') ? 'Yes' : 'No',
                    to_email: 'reachus@foresta.ae'
                };
                
                console.log('Sending email with params:', templateParams);
                console.log('Using Service ID:', 'service_3p5b3uy');
                console.log('Using Template ID:', 'template_9bk98d1');

                // Send email using EmailJS
                await emailjs.send(
                    'service_3p5b3uy',     // Your updated EmailJS service ID
                    'template_9bk98d1',    // Your updated EmailJS template ID
                    templateParams
                );
                
                console.log('Email sent successfully!');
                
                // Store customer record locally
                storeCustomerRecord(templateParams);
                
                // Show success message
                showSuccessMessage();
                contactForm.reset();
                clearErrors();
                
            } catch (error) {
                console.error('Email sending failed:', error);
                console.error('Error details:', error.message);
                console.error('Error status:', error.status);
                console.error('Error text:', error.text);
                showErrorMessage('Failed to send message. Please try again or contact us directly.');
            } finally {
                // Reset button state
                submitBtn.querySelector('.button-text').textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Store customer record locally
    function storeCustomerRecord(customerData) {
        try {
            // Get existing records
            let customerRecords = JSON.parse(localStorage.getItem('forestaCustomerRecords') || '[]');
            
            // Add timestamp and unique ID
            const record = {
                id: Date.now(),
                timestamp: new Date().toLocaleString(),
                ...customerData
            };
            
            // Add new record
            customerRecords.unshift(record); // Add to beginning of array
            
            // Keep only last 100 records to avoid storage issues
            if (customerRecords.length > 100) {
                customerRecords = customerRecords.slice(0, 100);
            }
            
            // Save to localStorage
            localStorage.setItem('forestaCustomerRecords', JSON.stringify(customerRecords));
            
            console.log('Customer record stored:', record);
        } catch (error) {
            console.error('Failed to store customer record:', error);
        }
    }
    
    // Function to view all customer records (for admin use)
    function viewCustomerRecords() {
        const records = JSON.parse(localStorage.getItem('forestaCustomerRecords') || '[]');
        console.table(records);
        return records;
    }
    
    // Function to export customer records as CSV
    function exportCustomerRecords() {
        const records = JSON.parse(localStorage.getItem('forestaCustomerRecords') || '[]');
        
        if (records.length === 0) {
            alert('No customer records found.');
            return;
        }
        
        // Create CSV content
        const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Subject', 'Message', 'Newsletter'];
        const csvContent = [
            headers.join(','),
            ...records.map(record => [
                record.id,
                `"${record.timestamp}"`,
                `"${record.from_name}"`,
                record.from_email,
                `"${record.phone}"`,
                `"${record.company}"`,
                `"${record.subject}"`,
                `"${record.message.replace(/"/g, '""')}"`, // Escape quotes
                record.newsletter
            ].join(','))
        ].join('\n');
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `foresta_customer_records_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
    
    // Make functions available globally for admin use
    window.viewCustomerRecords = viewCustomerRecords;
    window.exportCustomerRecords = exportCustomerRecords;
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        clearErrors();
        
        // Validate name
        const name = document.getElementById('name').value.trim();
        if (name.length < 2) {
            showFieldError('name', 'Please enter your full name (at least 2 characters)');
            isValid = false;
        }
        
        // Validate email
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone (if provided)
        const phone = document.getElementById('phone').value.trim();
        if (phone && phone.length < 7) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate message
        const message = document.getElementById('message').value.trim();
        if (message.length < 10) {
            showFieldError('message', 'Please enter a detailed message (at least 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show field error
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + '-error');
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Clear all errors
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const fields = document.querySelectorAll('input, textarea, select');
        
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        fields.forEach(field => {
            field.classList.remove('error');
        });
    }

    function showSuccessMessage() {
        // Create success modal
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="success-icon">✅</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting Foresta Wood Industries! We've received your message and will get back to you within 24 hours.</p>
                <p class="modal-note">A copy of your inquiry has been sent to our team at reachus@foresta.ae</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Close modal
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', function() {
            modal.remove();
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }
    
    function showErrorMessage(message) {
        // Create error modal
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="error-icon">❌</div>
                <h3>Message Failed to Send</h3>
                <p>${message}</p>
                <p class="modal-note">You can also reach us directly at: <a href="mailto:reachus@foresta.ae">reachus@foresta.ae</a> or <a href="tel:+971547862986">+971 54 786 2986</a></p>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Close modal
        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', function() {
            modal.remove();
        });

        // Auto close after 8 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 8000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .product-card, .section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Enhanced Gallery Filter System with Auto-Reordering based on Scroll Position
    function initializeGalleryFilterSystem() {
        const galleryFilters = document.querySelector('.gallery-filters');
        const productCatalogBtn = document.querySelector('.filter-btn[data-filter="product-catalog"]');
        
        if (!galleryFilters || !productCatalogBtn) return;

        // Define sections and their corresponding filters
        const sections = [
            {
                id: 'lami-gloss-section',
                filter: 'lami-gloss',
                element: document.getElementById('lami-gloss-section')
            },
            {
                id: 'lami-matt-section', 
                filter: 'lami-matt',
                element: document.getElementById('lami-matt-section')
            },
            {
                id: 'marble-acrylic-section',
                filter: 'interior', 
                element: document.getElementById('marble-acrylic-section')
            }
        ];

        let currentActiveSection = null;
        let isReordering = false;
        let originalButtonOrder = [];
        
        // Store original button order
        function updateButtonOrder() {
            originalButtonOrder = [];
            const currentButtons = document.querySelectorAll('.filter-btn');
            currentButtons.forEach(btn => {
                originalButtonOrder.push({
                    element: btn,
                    filter: btn.getAttribute('data-filter')
                });
            });
        }
        
        // Initial button order setup
        updateButtonOrder();

        // Function to restore original button order
        function restoreOriginalOrder() {
            if (isReordering) return;
            
            isReordering = true;
            
            // Remove active class from all buttons except Product Catalog
            const allButtons = document.querySelectorAll('.filter-btn');
            allButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') !== 'product-catalog') {
                    btn.classList.remove('active');
                }
            });
            
            // Restore original order using the stored order
            const container = galleryFilters;
            originalButtonOrder.forEach((buttonInfo) => {
                if (buttonInfo.element.parentNode !== container) {
                    container.appendChild(buttonInfo.element);
                }
            });
            
            setTimeout(() => {
                isReordering = false;
            }, 100);
        }

        // Function to reorder filter buttons
        function reorderFilterButtons(activeFilter) {
            if (isReordering || activeFilter === 'product-catalog') return;
            
            isReordering = true;
            const targetButton = document.querySelector(`.filter-btn[data-filter="${activeFilter}"]`);
            
            if (!targetButton) {
                isReordering = false;
                return;
            }

            // Remove active class from all buttons first
            const allFilterButtons = document.querySelectorAll('.filter-btn');
            allFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Move the target button to position after Product Catalog
            targetButton.classList.add('filter-reordered');
            productCatalogBtn.insertAdjacentElement('afterend', targetButton);
            
            // Add active class to both Product Catalog and the moved button
            productCatalogBtn.classList.add('active');
            targetButton.classList.add('active');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                targetButton.classList.remove('filter-reordered');
                isReordering = false;
                // Re-add click listeners after DOM changes
                addClickListeners();
            }, 500);
        }

        // Function to handle filter button clicks
        function handleFilterClick(filterType) {
            // Remove active class from all buttons
            const allButtons = document.querySelectorAll('.filter-btn');
            allButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button and Product Catalog
            productCatalogBtn.classList.add('active');
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterType}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
            }
            
            // Update current active section to match clicked filter
            currentActiveSection = filterType;
            
            // Scroll to the corresponding section
            const section = sections.find(s => s.filter === filterType);
            if (section && section.element) {
                section.element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Force reorder after scroll
                setTimeout(() => {
                    reorderFilterButtons(filterType);
                }, 100);
            }
        }

        // Function to check which section is in view
        function checkSectionInView() {
            const scrollTop = window.scrollY;
            const viewportHeight = window.innerHeight;
            const viewportCenter = scrollTop + (viewportHeight / 2);
            let activeSection = null;
            let closestDistance = Infinity;
            
            sections.forEach(section => {
                if (section.element) {
                    const rect = section.element.getBoundingClientRect();
                    const elementTop = rect.top + scrollTop;
                    const elementBottom = elementTop + rect.height;
                    const elementCenter = elementTop + (rect.height / 2);
                    
                    // Check if section is visible in viewport
                    const isVisible = elementBottom > scrollTop && elementTop < (scrollTop + viewportHeight);
                    
                    if (isVisible) {
                        // Calculate distance from viewport center to element center
                        const distance = Math.abs(viewportCenter - elementCenter);
                        
                        // The section closest to viewport center becomes active
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            activeSection = section.filter;
                        }
                    }
                }
            });
            
            // Only change if we have a different active section
            if (activeSection !== currentActiveSection) {
                if (activeSection) {
                    currentActiveSection = activeSection;
                    reorderFilterButtons(activeSection);
                } else {
                    // No section is prominently visible, restore original order
                    currentActiveSection = null;
                    restoreOriginalOrder();
                }
            }
        }

        // Add click listeners to filter buttons
        function addClickListeners() {
            const currentButtons = document.querySelectorAll('.filter-btn');
            currentButtons.forEach(button => {
                // Remove existing listeners to avoid duplicates
                button.removeEventListener('click', handleButtonClick);
                button.addEventListener('click', handleButtonClick);
            });
        }
        
        function handleButtonClick(e) {
            e.preventDefault();
            const filterType = this.getAttribute('data-filter');
            
            if (filterType !== 'product-catalog' && filterType !== 'catalog') {
                handleFilterClick(filterType);
            }
        }
        
        // Initial click listeners setup
        addClickListeners();

        // Initialize scroll listener with improved throttling and direction detection
        let scrollTimeout;
        let lastScrollPosition = window.scrollY;
        let scrollDirection = 'down';
        
        window.addEventListener('scroll', function() {
            const currentScrollPosition = window.scrollY;
            scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
            lastScrollPosition = currentScrollPosition;
            
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            // Immediate check for scroll up to be more responsive
            if (scrollDirection === 'up') {
                checkSectionInView();
            }
            
            // Also do throttled check for smoother performance
            scrollTimeout = setTimeout(() => {
                checkSectionInView();
            }, 30); // Even faster response
        });

        // Initial check after page load
        setTimeout(() => {
            checkSectionInView();
        }, 1000);
        
        // Additional scroll position checks for better upward scroll detection
        let positionCheckInterval = setInterval(() => {
            // Check every 500ms if we missed any section changes during fast scrolling
            checkSectionInView();
        }, 500);
    }

    // Initialize the gallery filter system
    initializeGalleryFilterSystem();
});
