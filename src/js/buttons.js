document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.grid section');
    console.log(sections)
    let currentSection = 0;

    function updateSections() {
        sections.forEach((section, index) => {
            section.style.display = index === currentSection ? 'block' : 'none';
        });
    }

    function goLeft() {
        currentSection = (currentSection === 0) ? sections.length - 1 : currentSection - 1;
        updateSections();
    }

    function goRight() {
        currentSection = (currentSection === sections.length - 1) ? 0 : currentSection + 1;
        updateSections();
    }

    document.querySelector('#button-left').addEventListener('click', goLeft);
    document.querySelector('#button-right').addEventListener('click', goRight);

    // Initialize the first section as visible
    updateSections();
});