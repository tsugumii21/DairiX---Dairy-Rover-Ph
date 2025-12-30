document.addEventListener('DOMContentLoaded', () => {
    // --- Global Modal System ---
    const body = document.body;
    const modalHTML = `
        <div class="modal-overlay" id="globalModal">
            <div class="modal-content">
                <h2 id="globalModalTitle">Notification</h2>
                <p id="globalModalMessage">Message goes here.</p>
                <button class="btn-modal" id="globalModalClose">Understood</button>
            </div>
        </div>
    `;
    
    if (!document.getElementById('globalModal')) {
        body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const globalModal = document.getElementById('globalModal');
    const globalModalTitle = document.getElementById('globalModalTitle');
    const globalModalMessage = document.getElementById('globalModalMessage');
    const globalModalClose = document.getElementById('globalModalClose');

    window.showModernModal = (title, message, callback) => {
        globalModalTitle.innerText = title;
        globalModalMessage.innerText = message;
        globalModal.classList.add('active');
        body.style.overflow = 'hidden';
        
        globalModalClose.onclick = () => {
            globalModal.classList.remove('active');
            body.style.overflow = 'auto';
            if (callback) callback();
        };
    };

    // --- Simulation Logic ---
    // Using sessionStorage for "simulation" type behavior (clears on tab close)
    // Strictly follow "gone on refresh" requirement
    if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
        sessionStorage.removeItem('user');
    }

    const currentUser = sessionStorage.getItem('user');
    const navRight = document.querySelector('.nav-right');
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html');

    if (currentUser && navRight && !isAuthPage) {
        // Replace Sign In or add status
        const signInLink = navRight.querySelector('a[href="login.html"]');
        const statusHTML = `
            <div class="user-status">
                <div class="user-info">
                    <span class="dot"></span>
                    <span class="username">${currentUser.split('@')[0]}</span>
                </div>
                <a href="javascript:void(0)" id="signOut" class="btn-signout">Sign Out</a>
            </div>
        `;

        if (signInLink) {
            signInLink.outerHTML = statusHTML;
        } else {
            // If sign in link doesn't exist (e.g. already replaced), just append if not there
            if (!navRight.querySelector('.user-status')) {
                navRight.insertAdjacentHTML('beforeend', statusHTML);
            }
        }
        
        document.getElementById('signOut')?.addEventListener('click', () => {
            window.showModernModal(
                "Sign Out", 
                "Are you sure you want to end your session?", 
                () => {
                    sessionStorage.removeItem('user');
                    window.location.reload();
                }
            );
        });
    }

    // --- Page Specific Logic ---

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-row').forEach(row => {
        observer.observe(row);
    });

    // Header effect on Scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    const inquiryForm = document.getElementById('inquiryForm');

    const handleFormSubmit = (form, title, successMsg) => {
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                showModernModal(title, successMsg);
                form.reset();
            });
        }
    };

    handleFormSubmit(contactForm, 'Message Sent', 'Thank you! We have received your message and will get back to you shortly.');
    handleFormSubmit(inquiryForm, 'Inquiry Received', 'Thank you! Our engineering team will review your inquiry and contact you soon.');

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
