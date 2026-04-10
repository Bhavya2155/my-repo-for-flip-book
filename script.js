$(document).ready(function() {
    let zoomLevel = 1;
    let isInitialized = false;
    const flipSound = document.getElementById('flip-sound');

    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev - April 2026', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then - March 2026', pages: 16 }
    ];

    // Library Grid
    books.forEach((book, i) => {
        $('#magazine-list').append(`
            <div class="book-card cursor-pointer group rounded-xl overflow-hidden" data-index="${i}">
                <img src="books/${book.folder}/1.jpg" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition duration-500">
                <p class="p-4 text-[11px] font-bold text-gray-600 uppercase tracking-wider">${book.title}</p>
            </div>
        `);
    });

    function initFlipbook(index) {
        const book = books[index];
        const $fb = $('#flipbook');
        $fb.empty();
        $('#current-title').text(book.title);

        for (let i = 1; i <= book.pages; i++) {
            $fb.append(`<div class="page"><img src="books/${book.folder}/${i}.jpg"></div>`);
        }

        const isMobile = window.innerWidth < 768;

        $fb.turn({
            width: isMobile ? window.innerWidth * 0.95 : 1000,
            height: isMobile ? window.innerHeight * 0.6 : 650,
            display: isMobile ? 'single' : 'double',
            duration: 1000,
            acceleration: true,
            gradients: true,
            when: {
                turning: function() { flipSound.currentTime = 0; flipSound.play(); },
                turned: function(e, page) { $('#page-counter').text(`Page ${page} / ${book.pages}`); }
            }
        });
        isInitialized = true;
    }

    // --- ZOOM LOGIC ---
    $('#zoom-in').click(() => { 
        if(zoomLevel < 3) zoomLevel += 0.3; 
        updateZoom(); 
    });
    
    $('#zoom-out').click(() => { 
        if(zoomLevel > 1) zoomLevel -= 0.3; 
        else zoomLevel = 1;
        updateZoom(); 
    });

    function updateZoom() {
        $('#flipbook-wrapper').css('transform', `scale(${zoomLevel})`);
        // If zoom is 1, reset position
        if(zoomLevel === 1) $('#flipbook-wrapper').css({top: 0, left: 0});
    }

    // --- PANNING (Drag while zoomed) ---
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    let scrollPos = { x: 0, y: 0 };

    $('#canvas').on('mousedown', (e) => {
        if (zoomLevel <= 1) return;
        isDragging = true;
        startPos = { x: e.clientX, y: e.clientY };
        scrollPos = { x: $('#canvas').scrollLeft(), y: $('#canvas').scrollTop() };
    });

    $(window).on('mousemove', (e) => {
        if (!isDragging) return;
        const dx = startPos.x - e.clientX;
        const dy = startPos.y - e.clientY;
        $('#canvas').scrollLeft(scrollPos.x + dx);
        $('#canvas').scrollTop(scrollPos.y + dy);
    });

    $(window).on('mouseup', () => { isDragging = false; });

    // --- UI CONTROLS ---
    $(document).on('click', '.book-card', function() {
        const idx = $(this).data('index');
        $('#flipbook-view').removeClass('hidden').addClass('flex').hide().fadeIn(400);
        initFlipbook(idx);
    });

    $('#close-flipbook').click(() => {
        $('#flipbook-view').fadeOut(300, () => {
            if (isInitialized) { $('#flipbook').turn('destroy'); isInitialized = false; }
            zoomLevel = 1; updateZoom();
        });
    });

    $('#prev-btn').click(() => $('#flipbook').turn('previous'));
    $('#next-btn').click(() => $('#flipbook').turn('next'));

    // Swipe
    let touchX;
    $('#canvas').on('touchstart', e => { touchX = e.originalEvent.touches[0].clientX; });
    $('#canvas').on('touchend', e => {
        if(zoomLevel > 1) return; // Disable swipe when zoomed in to allow panning
        let endX = e.originalEvent.changedTouches[0].clientX;
        if (touchX > endX + 60) $('#flipbook').turn('next');
        else if (touchX < endX - 60) $('#flipbook').turn('previous');
    });
});
