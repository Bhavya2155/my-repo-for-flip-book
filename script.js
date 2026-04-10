document.addEventListener("DOMContentLoaded", function() {
    let pageFlip = null;
    let zoomLevel = 1;
    const flipSound = document.getElementById('flip-sound');

    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then', pages: 16 }
    ];

    // Load Grid
    const grid = document.getElementById('magazine-list');
    books.forEach((book, i) => {
        grid.innerHTML += `
            <div class="book-card cursor-pointer group" onclick="openBook(${i})">
                <img src="books/${book.folder}/1.jpg" class="w-full group-hover:scale-105 transition-transform duration-500">
                <p class="mt-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">${book.title}</p>
            </div>`;
    });

    window.openBook = function(index) {
        const book = books[index];
        document.getElementById('grid-view').classList.add('hidden');
        document.getElementById('flipbook-view').classList.remove('hidden');
        document.getElementById('current-title').innerText = book.title;

        const container = document.getElementById('magazine');
        container.innerHTML = '';
        
        for (let i = 1; i <= book.pages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            pageDiv.innerHTML = `<img src="books/${book.folder}/${i}.jpg" loading="lazy">`;
            container.appendChild(pageDiv);
        }

        const isMobile = window.innerWidth < 768;

        pageFlip = new St.PageFlip(container, {
            width: 450, // Single page width
            height: 600, // Single page height
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false // We use our own gesture logic
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        pageFlip.on('flip', (e) => {
            flipSound.currentTime = 0;
            flipSound.play();
            document.getElementById('page-counter').innerText = `${String(e.data + 1).padStart(2, '0')} / ${book.pages}`;
        });
    };

    // --- PINCH TO ZOOM & SWIPE LOGIC ---
    let initialDist = -1;
    const canvas = document.getElementById('canvas');
    const wrapper = document.getElementById('flipbook-wrapper');

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            let dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            if (initialDist > 0) {
                if (dist > initialDist) zoomLevel = Math.min(3, zoomLevel + 0.05);
                else zoomLevel = Math.max(1, zoomLevel - 0.05);
                wrapper.style.transform = `scale(${zoomLevel})`;
            }
            initialDist = dist;
        }
    });

    canvas.addEventListener('touchend', () => { initialDist = -1; });

    // Zoom Buttons
    document.getElementById('zoom-in').onclick = () => { zoomLevel = Math.min(3, zoomLevel + 0.3); wrapper.style.transform = `scale(${zoomLevel})`; };
    document.getElementById('zoom-out').onclick = () => { zoomLevel = Math.max(1, zoomLevel - 0.3); wrapper.style.transform = `scale(${zoomLevel})`; };

    // Navigation
    document.getElementById('prev-btn').onclick = () => pageFlip.flipPrev();
    document.getElementById('next-btn').onclick = () => pageFlip.flipNext();
    document.getElementById('close-flipbook').onclick = () => location.reload();
});
