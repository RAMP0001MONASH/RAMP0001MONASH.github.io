
function showPage(pageName) {
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));

    const targetPage = document.querySelector('.page[data-page="' + pageName + '"]');
    if (targetPage) targetPage.classList.add('active');
}

// button clicks
document.addEventListener('click', function(event) {
    const navButton = event.target.closest('[data-nav]');
    if (navButton) {
        event.preventDefault();
        showPage(navButton.dataset.nav);
    }
});
// the following section is from a youtube tutorial and chat gpt trouble shooting
// Draggable window setup
let currentTopZIndex = 100; // keeps track of which window is on top

function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector('.winbox_header');
    if (!header) return;

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    header.addEventListener('mousedown', function(event) {
        isDragging = true;
        const rect = windowElement.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        windowElement.style.position = 'fixed';
        windowElement.style.zIndex = ++currentTopZIndex;
    });

    document.addEventListener('mousemove', function(event) {
        if (!isDragging) return;
        windowElement.style.left = (event.clientX - offsetX) + 'px';
        windowElement.style.top  = (event.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
}

// Tabs inside posts
function initTabs(rootElement) {
    const tabBars = rootElement.querySelectorAll('.tabs');

    tabBars.forEach(tabBar => {
        tabBar.addEventListener('click', function(event) {
            const clickedTab = event.target.closest('.tab');
            if (!clickedTab) return;

            // Remove active from all tabs
            const allTabs = tabBar.querySelectorAll('.tab');
            allTabs.forEach(tab => tab.classList.remove('active'));

            // Activate clicked tab
            clickedTab.classList.add('active');

            // Hide all post contents
            const postContainer = tabBar.parentNode;
            const allContents = postContainer.querySelectorAll('.post_content');
            allContents.forEach(content => content.classList.add('hidden'));

            // Show content corresponding to the clicked tab
            const targetContentId = clickedTab.dataset.target;
            const targetContent = postContainer.querySelector('#' + targetContentId);
            if (targetContent) targetContent.classList.remove('hidden');
        });
    });
}

// startup page load
document.addEventListener('DOMContentLoaded', function() {
    showPage('home'); // default page

    const draggableWindows = document.querySelectorAll('.draggable');
    draggableWindows.forEach(makeWindowDraggable);

    initTabs(document);
});