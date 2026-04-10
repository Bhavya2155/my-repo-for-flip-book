document.addEventListener("DOMContentLoaded", function() {
    let pageFlip = null;
    let zoomLevel = 1;
    const flipSound = document.getElementById('flip-sound');

    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev - April 2026', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then - March 2026', pages: 16 }
    ];

    // Build the Grid
    const grid = document.getElementById('magazine-list');
    books.forEach((book, i) => {
        grid.innerHTML += `
            <div class="book-card cursor-pointer group" onclick="openBook(${i})">
                <div class="overflow-hidden rounded-lg">
                    <img src="books/${book.folder}/1.jpg" class="w-full">
                </div>
                <p class="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">${book.title}</p>
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
            container.innerHTML += `<div class="page"><img src="books/${book.folder}/${i}.jpg"></div>`;
        }

        const isMobile = window.innerWidth < 768;

        pageFlip = new St.PageFlip(container, {
            width: 1358, 
            height: 1004,
            size: "contain", // Prevents cutting
            minWidth: 300,
            maxWidth: 1358,
            minHeight: 220,
            maxHeight: 1004,
            display: isMobile ? "single" : "double",
            showCover: true,
            flippingTime: 1000,
            maxShadowOpacity: 0.3,
            mobileScrollSupport: true
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        pageFlip.on('flip', (e) => {
            if(flipSound) { flipSound.currentTime = 0; flipSound.play(); }
            let p = e.data + 1;
            let d = (p === 1 || isMobile) ? p : `${p}-${p + 1}`;
            document.getElementById('page-counter').innerText = `${d} / ${book.pages}`;
        });
    };

    const wrapper = document.getElementById('flipbook-wrapper');
    document.getElementById('zoom-in').onclick = () => { zoomLevel = Math.min(3, zoomLevel + 0.3); wrapper.style.transform = `scale(${zoomLevel})`; };
    document.getElementById('zoom-out').onclick = () => { zoomLevel = Math.max(1, zoomLevel - 0.3); wrapper.style.transform = `scale(${zoomLevel})`; };

    document.getElementById('prev-btn').onclick = () => pageFlip.flipPrev();
    document.getElementById('next-btn').onclick = () => pageFlip.flipNext();
    document.getElementById('close-flipbook').onclick = () => location.reload();
});
