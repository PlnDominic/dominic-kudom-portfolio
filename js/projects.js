// DOM Elements
const projectCards = document.querySelectorAll('.project-card');
const categoryButtons = document.querySelectorAll('.category-btn');
const modal = document.getElementById('projectModal');
const modalContent = modal.querySelector('.modal-body');
const closeModal = modal.querySelector('.close-modal');

// Project filtering
function filterProjects(category) {
    projectCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

// Category button click handlers
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        filterProjects(button.dataset.category);
    });
});

// Project card hover effect
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(1.02, 1.02, 1.02)
            translateY(-5px)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Modal functionality
function openModal(card) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const techStack = Array.from(card.querySelectorAll('.project-tech span'))
        .map(span => span.textContent)
        .join(', ');
    
    modalContent.innerHTML = `
        <h2>${title}</h2>
        <p class="modal-description">${description}</p>
        <div class="modal-tech">
            <h3>Technologies Used</h3>
            <p>${techStack}</p>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeModalHandler() {
    modal.style.opacity = '0';
    document.body.style.overflow = '';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Modal event listeners
projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

closeModal.addEventListener('click', closeModalHandler);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalHandler();
});

// Scroll animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    projectObserver.observe(card);
});
