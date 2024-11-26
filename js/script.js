// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const aboutSection = document.getElementById('about');
    const aboutLink = document.querySelector('a[href="#about"]');
    const projectsLink = document.querySelector('a[href="projects.html"]');
    
    if (aboutSection && aboutLink) {
        // Close about section when clicking outside
        document.addEventListener('click', (e) => {
            if (aboutSection && !aboutSection.contains(e.target) && e.target !== aboutLink) {
                aboutSection.classList.remove('visible');
            }
        });

        // Toggle about section only for the about link
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            aboutSection.classList.toggle('visible');
        });
    }

    // Handle projects link navigation
    if (projectsLink) {
        projectsLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/dominic-kudom-portfolio/projects.html';
        });
    }

    // Initialize theme handling
    initializeTheme();
});

// Theme handling
function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    // Listen for theme changes
    prefersDark.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}
