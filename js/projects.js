// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', () => {
    // Initialize project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        // Reset card position on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
        
        // Add click handler for project details
        card.addEventListener('click', () => {
            const projectTitle = card.querySelector('h3').textContent;
            const projectCategory = card.querySelector('.category').textContent;
            
            // Here you can add code to show a modal or navigate to a detailed project page
            console.log(`Clicked project: ${projectTitle} (${projectCategory})`);
        });
    });
    
    // Add scroll animation for projects
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
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        projectObserver.observe(card);
    });
});
