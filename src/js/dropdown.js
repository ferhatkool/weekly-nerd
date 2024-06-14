function openMenuItem(item) {
    const currentlyOpened = document.querySelector(".show")
    const newToOpen = document.querySelector("#menuItem" + item)
    if (currentlyOpened) {
        if (newToOpen.classList.contains("show")) {
            currentlyOpened.classList.remove("show")
        } else {
            currentlyOpened.classList.remove("show")
            newToOpen.classList.toggle("show")
        }
    } else if (!currentlyOpened) {
        newToOpen.classList.toggle("show");
    }
}

function closeMenu() {
    //const test = document.getElementById('closeMenuButton')
    const openedMenu = document.querySelector('.show')
    if (openedMenu) {
        openedMenu.classList.remove("show")
    }
}

// Listen for focus event on li items
const dropdownItems = document.querySelectorAll('.menuItemButton');
dropdownItems.forEach(item => {
    item.addEventListener('focus', (event) => {
        const attribute = event.target.attributes[1].value.toString();
        const character = attribute.charAt(14);
        openMenuItem(character);
    });
});

// Listen for keydown event on the last item of the dropdown menu
const dropdownMenus = document.querySelectorAll('.dropdown');
dropdownMenus.forEach(menu => {
    const menuItems = menu.querySelectorAll('li');
    const lastMenuItem = menuItems[menuItems.length - 1];
    lastMenuItem.addEventListener('keydown', (event) => {
        if (event.key === 'Tab' && !event.shiftKey) {
            closeMenu();
        }
    });
});

// function openMenuItem(item) {
//     const currentlyOpened = document.querySelector(".show")
//     const newToOpen = document.querySelector("#menuItem" + item)
//     if (currentlyOpened) {
//         if (newToOpen.classList.contains("show")) {
//             currentlyOpened.classList.remove("show")
//         } else {
//             currentlyOpened.classList.remove("show")
//             newToOpen.classList.toggle("show")
//         }
//     } else if (!currentlyOpened) {
//         newToOpen.classList.toggle("show");
//     }
// }

// function closeMenu() {
//     const openedMenu = document.querySelector('.show')
//     if (openedMenu) {
//         openedMenu.classList.remove("show")
//     }
// }

// // Listen for click event on li items
// const dropdownItems = document.querySelectorAll('.menuItemButton');
// dropdownItems.forEach(item => {
//     item.addEventListener('click', (event) => {
//         if (event.target.closest('ul.dropdown')) {
//             event.preventDefault(); // Prevent default behavior
//             return;
//         }
//         const attribute = event.target.attributes[1].value.toString();
//         const character = attribute.charAt(14);
//         openMenuItem(character);
//     });
// });

// // Listen for keydown event on the last item of the dropdown menu
// const dropdownMenus = document.querySelectorAll('.dropdown');
// dropdownMenus.forEach(menu => {
//     const menuItems = menu.querySelectorAll('li');
//     const lastMenuItem = menuItems[menuItems.length - 1];
//     lastMenuItem.addEventListener('keydown', (event) => {
//         if (event.key === 'Tab' && !event.shiftKey) {
//             closeMenu();
//         }
//     });
// });