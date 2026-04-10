document.addEventListener("DOMContentLoaded", function() {
    let pageFlip = null;
    let zoomLevel = 1;
    const flipSound = document.getElementById('flip-sound');

    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then', pages: 16 }
    ];

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

    window.openBook = function(index) {
        const book = books[index];
        document.getElementById('grid-view').classList.add('hidden');
        document.getElementById('flipbook-view').classList.remove('hidden');
        document.getElementById('current-title').innerText = book.title;

        const container = document.getElementById('magazine');
        container.innerHTML = '';
        
        // Inject pages
        for (let i = 1; i <= book.pages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            pageDiv.innerHTML = `<img src="books/${book.folder}/${i}.jpg">`;
            container.appendChild(pageDiv);
        }

        const isMobile = window.innerWidth < 768;

        // MATH: Calculate height based on your 1358x1004 image
        // Width of one page is 1358, Height is 1004.
        pageFlip = new St.PageFlip(container, {
            width: 1358, 
            height: 1004,
            size: "stretch",
            minWidth: 315,
            maxWidth: 1358,
            minHeight: 233,
            maxHeight: 1004,
            showCover: false, // Set to true if 1.jpg is a lone cover
            maxShadowOpacity: 0.3,
            mobileScrollSupport: true
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        pageFlip.on('flip', (e) => {
            if(flipSound) { flipSound.currentTime = 0; flipSound.play(); }
            document.getElementById('page-counter').innerText = `${String(e.data + 1).padStart(2, '0')} / ${book.pages}`;
        });
    };

    // Zoom Functions
    const wrapper = document.getElementById('flipbook-wrapper');
    document.getElementById('zoom-in').onclick = () => { zoomLevel = Math.min(3, zoomLevel + 0.3); updateZoom(); };
    document.getElementById('zoom-out').onclick = () => { zoomLevel = Math.max(1, zoomLevel - 0.3); updateZoom(); };
    function updateZoom() { wrapper.style.transform = `scale(${zoomLevel})`; }

    // Navigation
    document.getElementById('prev-btn').onclick = () => pageFlip.flipPrev();
    document.getElementById('next-btn').onclick = () => pageFlip.flipNext();
    document.getElementById('close-flipbook').onclick = () => location.reload();
});
