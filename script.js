document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SMILEY HOVER & SMOOTH SCROLL LOGIC
    // ==========================================
    const smiley = document.querySelector('.smiley');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll(".navbar a");
    const sections = document.querySelectorAll("main, section");
    
    // Interaction logic for the smiley face hover effect
    if (smiley) {
        smiley.addEventListener('mouseenter', () => {
            smiley.style.transform = 'translateY(-0.35rem) scale(1.08) rotate(8deg)';
        });

        smiley.addEventListener('mouseleave', () => {
            smiley.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    }

    // Smooth scrolling behavior for navigation anchors
    document.querySelectorAll('.navbar a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // 2. DYNAMIC NAVBAR THEME & SCROLLSPY SYSTEM
    // ==========================================
    function updateNavbar() {
        if (!navbar) return;
        let currentSection = null;
        const navbarHeight = navbar.offsetHeight || 80;

        // Track which section is currently occupying the navbar viewport area
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= navbarHeight + 20 && rect.bottom >= navbarHeight) {
                currentSection = section;
            }
        });

        if (!currentSection) return;

        // Determine if the active section features a dark layout background
        const isDark = 
            currentSection.classList.contains("about-section") || 
            currentSection.classList.contains("certifications-section") || 
            (currentSection.classList.contains("tools-section") && currentSection.classList.contains("dev-mode"));

        // Toggle light typography mode on the navigation frame
        if (isDark) {
            navbar.classList.add("nav-light-mode");
        } else {
            navbar.classList.remove("nav-light-mode");
        }

        // Update Active Underline Indicator (Scrollspy)
        const id = currentSection.getAttribute("id");
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            
            if (href === `#${id}`) {
                link.classList.add("active-nav");
            } else if (href === "projects.html" && window.location.pathname.includes("projects.html")) {
                link.classList.add("active-nav");
            } else {
                link.classList.remove("active-nav");
            }
        });
    }

    // Fire events on scroll and browser window scaling actions
    window.addEventListener("scroll", updateNavbar);
    window.addEventListener("resize", updateNavbar);

    // Fix for Tools Toggle: Watch for real-time class modifications on #tools
    const toolsSection = document.getElementById("tools");
    if (toolsSection) {
        const observer = new MutationObserver(() => {
            updateNavbar(); 
        });
        observer.observe(toolsSection, { attributes: true, attributeFilter: ["class"] });
    }

    // ==========================================
    // 3. TOOLS SCROLL-PINNED CAROUSEL SYSTEM
    // ==========================================
    // Dynamic Pin Track Injection (Wraps your #tools element smoothly via code)
    let pinWrapper = null;
    if (toolsSection) {
        pinWrapper = document.createElement("div");
        pinWrapper.className = "tools-pin-wrapper";
        toolsSection.parentNode.insertBefore(pinWrapper, toolsSection);
        pinWrapper.appendChild(toolsSection);
    }

    // Page 1 Data: Virtual Assistance / Design
    const designTools = [
        { title: "Google Calendar", category: "VIRTUAL ASSISTANCE", description: "Used in building web apps like my SubanenGo Web app", img: "assets/tools/google-calendar.webp" },
        { title: "Gmail", category: "VIRTUAL ASSISTANCE", description: "Managing operational communications and system routing notifications seamlessly.", img: "assets/tools/gmail.png" },
        { title: "Canva", category: "GRAPHIC DESIGN", description: "Creating rapid production mockups and asset presentation layout graphics.", img: "assets/tools/canva.png" },
        { title: "Photoshop", category: "GRAPHIC DESIGN", description: "Meticulous asset optimization and composition rendering tweaks.", img: "assets/tools/photoshop.png" },
        { title: "Figma", category: "BRANDING & UI/UX", description: "High fidelity interface wireframing blueprint vector mapping prototypes.", img: "assets/tools/figma.png" }
    ];

    // Page 2 Data: Development Environment Tech Stack
    const devTools = [
        { title: "React", category: "VIRTUAL ASSISTANCE", description: "Used in building web apps like my SubanenGo Web app", img: "assets/tech-used/react.png" },
        { title: "TypeScript", category: "WEB DEVELOPMENT", description: "Adding type safety and scalable structures to modern client projects.", img: "assets/tech-used/typescript.png" },
        { title: "Next.js", category: "WEB DEVELOPMENT", description: "Production ready React frameworks for server optimized rendering delivery.", img: "assets/tech-used/next-js.png" },
        { title: "HTML, CSS, Javascript", category: "SYSTEM ARCHITECTURE", description: "Optimizing development environments with custom microservices.", img: "assets/tech-used/html-css-js.png" },
        { title: "Kotlin", category: "MOBILE DEVELOPMENT", description: "Architecting native environments with optimal system reliability.", img: "assets/tech-used/kotlin-logo.png" }
    ];

    let currentPage = "design"; 
    let activeIndex = 0;
    let rotationInterval;

    const pageToggleBtn = document.getElementById('pageToggleBtn');
    const items = document.querySelectorAll('.carousel-item');
    const titleEl = document.getElementById('toolTitle');
    const badgeEl = document.getElementById('toolBadge');
    const descEl = document.getElementById('toolDescription');
    const mainHeadingEl = document.getElementById('toolsMainHeading'); // Dynamic Title Selector
    const totalItems = items.length;

    function getCurrentData() {
        return currentPage === "design" ? designTools : devTools;
    }

    function updateNodeImages() {
        const data = getCurrentData();
        items.forEach((item, index) => {
            const imgTag = item.querySelector('img');
            if (imgTag && data[index]) {
                imgTag.src = data[index].img;
                imgTag.alt = data[index].title;
            }
        });
    }

    function updateCarouselPositions() {
        items.forEach((item) => {
            const indexAttribute = parseInt(item.getAttribute('data-index'));
            let relativePos = indexAttribute - activeIndex;
            if (relativePos < -totalItems / 2) relativePos += totalItems;
            if (relativePos > totalItems / 2) relativePos -= totalItems;

            const angleStep = (2 * Math.PI) / totalItems;
            const itemAngle = relativePos * angleStep;

            const isMobile = window.innerWidth <= 768;
            const radiusX = isMobile ? window.innerWidth * 0.38 : 340; 
            const radiusY = isMobile ? 35 : 50; // Slightly smoothed ellipse depth to clear typography fields

            const translateX = Math.sin(itemAngle) * radiusX;
            const translateY = (1 - Math.cos(itemAngle)) * radiusY + (relativePos === 0 ? 25 : 0); 
            
            let scale = 1 - Math.abs(relativePos) * 0.18;
            let opacity = 1 - Math.abs(relativePos) * 0.35;
            
            if (relativePos === 0) {
                item.classList.add('active');
                scale = 1.0;
                opacity = 1;
            } else {
                item.classList.remove('active');
            }

            item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = 10 - Math.abs(relativePos);
        });

        const currentData = getCurrentData()[activeIndex];
        if (currentData && titleEl && badgeEl && descEl) {
            titleEl.textContent = currentData.title;
            badgeEl.textContent = currentData.category;
            descEl.textContent = currentData.description;
        }
    }

    function rotateNext() {
        activeIndex = (activeIndex + 1) % totalItems;
        updateCarouselPositions();
    }

    function startTimer() {
        clearInterval(rotationInterval);
        rotationInterval = setInterval(rotateNext, 3000);
    }

    function switchToolsPage(targetPage) {
        if (!targetPage) {
            currentPage = (currentPage === "design") ? "dev" : "design";
        } else {
            if (currentPage === targetPage) return;
            currentPage = targetPage;
        }

        if (currentPage === "dev") {
            toolsSection.classList.add('dev-mode');
            if (pageToggleBtn) pageToggleBtn.innerHTML = "&lt;"; 
            if (mainHeadingEl) mainHeadingEl.textContent = "Tools I Use for Web and App Development";
        } else {
            toolsSection.classList.remove('dev-mode');
            if (pageToggleBtn) pageToggleBtn.innerHTML = "&gt;"; 
            if (mainHeadingEl) mainHeadingEl.textContent = "Tools I Use for VA and Graphic Design";
        }

        activeIndex = 0;        
        updateNodeImages();     
        updateCarouselPositions(); 
        startTimer();  
    }

    items.forEach((item) => {
        item.addEventListener('click', () => {
            const clickedIndex = parseInt(item.getAttribute('data-index'));
            if (activeIndex !== clickedIndex) {
                activeIndex = clickedIndex;
                updateCarouselPositions();
                startTimer(); 
            }
        });
    });

    if (pageToggleBtn) {
        pageToggleBtn.addEventListener('click', () => {
            switchToolsPage();
        });
    }

    // --- SCROLL MATRIX TRACKER FOR PINNED CONTAINER VIEWPORTS ---
    window.addEventListener('scroll', () => {
        if (!pinWrapper) return;
        
        const rect = pinWrapper.getBoundingClientRect();
        const totalScrollableTrack = rect.height - window.innerHeight;
        const currentProgressY = -rect.top;
        
        const scrollProgress = Math.min(Math.max(currentProgressY / totalScrollableTrack, 0), 1);

        if (scrollProgress >= 0.5 && currentPage === "design") {
            switchToolsPage("dev");
        } 
        else if (scrollProgress < 0.5 && currentPage === "dev") {
            switchToolsPage("design");
        }
    });

    // Initialize Tools Carousel
    if (items.length > 0) {
        updateNodeImages();
        updateCarouselPositions();
        startTimer();
        window.addEventListener('resize', updateCarouselPositions);
    }

    // Initial load check for navbar
    updateNavbar();

    // ==========================================
    // 4. 3D OVERLAPPING CERTIFICATIONS SYSTEM
    // ==========================================
    const certDescriptions = [
        {
            title: "Master Virtual Assistance 2026: A Step-by-Step Guide",
            desc: "I earned my certificate in Master Virtual Assistance 2026: A Step-by-Step Guide through Udemy in March 2024. This 4-hour course taught me the core basics of Virtual Assistance, how to manage modern workflows, and the essential tools I need to effectively support clients."
        },
        {
            title: "Email Marketing Certification",
            desc: "Earned via HubSpot Academy. Covered strategies for lifecycle marketing, segmentation, email design validation, deliverability mechanics, and analytics optimization to foster authentic brand relationships and drive conversion performance."
        },
        {
            title: "Advanced Networking Devices",
            desc: "Cisco Networking Academy certification proving core competencies in router configuration, subnet mapping, access control lists, transport layers, and troubleshooting live enterprise-level network architectures."
        },
        {
            title: "Ethical Hacker Course Completion",
            desc: "Acquired critical defensive validation spanning penetration testing modules, network vulnerability footprint mapping, system counter-measures implementation, and mitigation framework deployment techniques."
        },
        {
            title: "Operating Systems Fundamentals",
            desc: "Deep dive into architecture resource allocation, Linux/Unix kernel execution trees, administrative shell script profiles, file privilege configurations, and thread management processing blueprints."
        },
        {
            title: "Digital Client Workflows & Automation",
            desc: "Specialized optimization training targeted at building asynchronous operation channels, cross-platform engine integrations, database storage triggers, and virtual workspace agency client delivery systems."
        }
    ];

    const certCards = document.querySelectorAll('.cert-card');
    const certTitleEl = document.getElementById('certActiveTitle');
    const certDescEl = document.getElementById('certActiveDesc');
    let certActiveIndex = 0; 

    function updateCarouselLayout() {
        const total = certCards.length;
        if (total === 0) return;

        certCards.forEach((card, i) => {
            let diff = i - certActiveIndex;
            
            if (diff < -2) diff += total;
            if (diff > 3) diff -= total;

            card.className = 'cert-card';

            if (diff === 0) {
                card.classList.add('active');
            } else if (diff === -1) {
                card.classList.add('prev');
            } else if (diff === 1) {
                card.classList.add('next');
            } else if (diff === -2) {
                card.classList.add('prev2');
            } else if (diff === 2) {
                card.classList.add('next2');
            } else {
                card.classList.add('hidden');
            }
        });

        if (certTitleEl && certDescEl && certDescriptions[certActiveIndex]) {
            certTitleEl.textContent = certDescriptions[certActiveIndex].title;
            certDescEl.textContent = certDescriptions[certActiveIndex].desc;
        }
    }

    certCards.forEach((card) => {
        card.addEventListener('click', () => {
            certActiveIndex = parseInt(card.getAttribute('data-index'));
            updateCarouselLayout();
        });
    });

    if (certCards.length > 0) {
        updateCarouselLayout();
    }

    // ==========================================
    // 5. STACKED CARDS CAROUSEL ANIMATION
    // ==========================================
    const stackCards = document.querySelectorAll('.stack-card');
    if (stackCards.length > 0) {
        let positions = ['bg-card-2', 'bg-card-1', 'front-card'];
        setInterval(() => {
            positions.unshift(positions.pop()); 
            stackCards.forEach((card, index) => {
                card.className = `stack-card ${positions[index]}`;
            });
        }, 2000); 
    }
});

// ==========================================
// 6. GLOBAL MOUSE PHYSICS (PARALLAX EFFECT)
// ==========================================
document.addEventListener('mousemove', (e) => {
    const depthElements = document.querySelectorAll('.sticker-badge, .polaroid-frame-container');
    const moveX = (window.innerWidth / 2 - e.pageX) * 0.012;
    const moveY = (window.innerHeight / 2 - e.pageY) * 0.012;

    depthElements.forEach((el, index) => {
        const structuralWeight = (index + 1) * 0.35;
        el.style.transform = `translate(${moveX * structuralWeight}px, ${moveY * structuralWeight}px)`;
    });
});

const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
});

// Closes the menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
    });
});


