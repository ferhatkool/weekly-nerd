// Smooth scrolling for elements inside .scrollable
document.querySelectorAll('.primary-navigation a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const parentLi = this.parentElement;
        // Check if the parent <li> contains a nested <ul>
        if (!parentLi.querySelector('ul')) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const scrollableContainer = document.querySelector('.scrollable');
            const scrollAmount = targetElement.offsetTop - scrollableContainer.offsetTop;
            scrollableContainer.scrollTo({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    });
});