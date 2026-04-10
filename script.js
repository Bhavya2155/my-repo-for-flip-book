window.openBook = function(index) {
    const book = books[index];
    document.getElementById('grid-view').classList.add('hidden');
    document.getElementById('flipbook-view').classList.remove('hidden');
    document.getElementById('current-title').innerText = book.title;

    const container = document.getElementById('magazine');
    container.innerHTML = '';
    
    for (let i = 1; i <= book.pages; i++) {
        container.innerHTML += `<div class="page"><img src="books/${book.folder}/${i}.jpg" loading="lazy"></div>`;
    }

    const isMobile = window.innerWidth < 768;

    pageFlip = new St.PageFlip(container, {
        width: 1358, 
        height: 1004,
        size: "contain", // CRITICAL: This stops the page cutting issue
        minWidth: 300,
        minHeight: 220,
        maxWidth: 1358,
        maxHeight: 1004,
        display: isMobile ? "single" : "double",
        showCover: true,
        flippingTime: 1000,
        maxShadowOpacity: 0.2,
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
