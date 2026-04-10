document.addEventListener("DOMContentLoaded", function() {
    let pageFlip = null;
    const flipSound = document.getElementById('flip-sound');

    // ENSURE THESE FOLDER NAMES MATCH YOUR GITHUB REPO EXACTLY
    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then', pages: 16 }
    ];

    const grid = document.getElementById('magazine-list');
    books.forEach((book, i) => {
        grid.innerHTML += `
            <div class="book-card cursor-pointer" onclick="openBook(${i})">
                <img src="books/${book.folder}/1.jpg" class="w-full">
                <p class="mt-4 text-[9px] uppercase tracking-widest text-gray-600 font-bold text-center">${book.title}</p>
            </div>`;
    });

    window.openBook = function(index) {
        const book = books[index];
        document.getElementById('grid-view').classList.add('hidden');
        document.getElementById('flipbook-view').classList.remove('hidden');

        const container = document.getElementById('magazine');
        container.innerHTML = '';
        
        // Use a loop to build the pages
        for (let i = 1; i <= book.pages; i++) {
            const page = document.createElement('div');
            page.className = 'page';
            page.innerHTML = `<img src="books/${book.folder}/${i}.jpg">`;
            container.appendChild(page);
        }

        const isMobile = window.innerWidth < 768;

        pageFlip = new St.PageFlip(container, {
            width: 1358, 
            height: 1004,
            size: "contain",
            minWidth: 300,
            maxWidth: 1358,
            minHeight: 220,
            maxHeight: 1004,
            display: isMobile ? "single" : "double",
            showCover: true,
            flippingTime: 1000,
            maxShadowOpacity: 0.4,
            mobileScrollSupport: true,
            clickEventForward: true // Allows clicking pages to turn
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        pageFlip.on('flip', (e) => {
            if(flipSound) { flipSound.currentTime = 0; flipSound.play(); }
            let p = e.data + 1;
            let d = (p === 1 || isMobile) ? p : (p >= book.pages ? book.pages : `${p}-${p + 1}`);
            document.getElementById('page-counter').innerText = `${d} / ${book.pages}`;
        });
    };

    document.getElementById('close-flipbook').onclick = () => location.reload();
});
