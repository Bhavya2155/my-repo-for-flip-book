document.addEventListener("DOMContentLoaded", function() {
    let pageFlip = null;
    let zoomLevel = 1;
    const flipSound = document.getElementById('flip-sound');

    // 1. DATA: List your books here
    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then', pages: 16 }
    ];

    // 2. RENDER GRID
    const grid = document.getElementById('magazine-list');
    books.forEach((book, i) => {
        grid.innerHTML += `
            <div class="book-card cursor-pointer group" onclick="openBook(${i})">
                <div class="overflow-hidden rounded-lg">
                    <img src="books/${book.folder}/1.jpg" class="w-full group-hover:scale-110 transition duration-500">
                </div>
                <p class="mt-4 text-[10px] uppercase tracking-widest text-gray-500 font-black">${book.title}</p>
            </div>`;
    });

    // 3. OPEN BOOK LOGIC
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

        // 1358 x 1004 Dimensions
        pageFlip = new St.PageFlip(container, {
            width: 1358, 
            height: 1004,
            size: "stretch",
            display: isMobile ? "single" : "double", // MAGAZINE 2-PAGE SPREAD
            showCover: true, // Page 1 is alone on the right
            flippingTime: 1000, // 1-SECOND FLIP SYNC
            maxShadowOpacity: 0.3,
            mobileScrollSupport: true
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        pageFlip.on('flip', (e) => {
            if(flipSound) { flipSound.currentTime = 0; flipSound.play(); }
            
            // Logic for 2-page numbering (e.g., 2-3 / 16)
            let pageNum = e.data + 1;
            let displayVal = (pageNum === 1 || isMobile) ? pageNum : `${pageNum}-${pageNum + 1}`;
            document.getElementById('page-counter').innerText = `${displayVal} / ${book.pages}`;
        });
    };

    // 4. ZOOM & PINCH LOGIC
    const wrapper = document.getElementById('flipbook-wrapper');
    const canvas = document.getElementById('canvas');

    document.getElementById('zoom-in').onclick = () => { zoomLevel = Math.min(3, zoomLevel + 0.3); updateZoom(); };
    document.getElementById('zoom-out').onclick = () => { zoomLevel = Math.max(1, zoomLevel - 0.3); updateZoom(); };
    function updateZoom() { wrapper.style.transform = `scale(${zoomLevel})`; }

    // Swipe/Pinch handling
    let initialDist = -1;
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            let dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            if (initialDist > 0) {
                if (dist > initialDist) zoomLevel = Math.min(3, zoomLevel + 0.05);
                else zoomLevel = Math.max(1, zoomLevel - 0.05);
                updateZoom();
            }
            initialDist = dist;
        }
    });
    canvas.addEventListener('touchend', () => { initialDist = -1; });

    // 5. NAVIGATION & UI
    document.getElementById('prev-btn').onclick = () => pageFlip.flipPrev();
    document.getElementById('next-btn').onclick = () => pageFlip.flipNext();
    document.getElementById('close-flipbook').onclick = () => location.reload();
});
