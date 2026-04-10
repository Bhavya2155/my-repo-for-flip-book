$(document).ready(function() {
    let zoomLevel = 1;
    let isInitialized = false;
    const flipSound = document.getElementById('flip-sound');

    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev - April 2026', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then - March 2026', pages: 16 }
    ];

    // Build Grid
    books.forEach((book, i) => {
        $('#magazine-list').append(`
            <div class="book-card cursor-pointer bg-gray-900 rounded-lg overflow-hidden border border-gray-800" data-index="${i}">
                <img src="books/${book.folder}/1.jpg" class="w-full aspect-[3/4] object-cover">
                <p class="p-3 text-[10px] uppercase font-bold text-gray-400">${book.title}</p>
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
            elevation: 100,
            when: {
                turning: function() { flipSound.currentTime = 0; flipSound.play(); },
                turned: function(e, page) { $('#page-counter').text(`${page} / ${book.pages}`); }
            }
        });
        isInitialized = true;
    }

    // Zoom Functions
    $('#zoom-in').click(() => { if(zoomLevel < 3) zoomLevel += 0.3; updateZoom(); });
    $('#zoom-out').click(() => { if(zoomLevel > 1) zoomLevel -= 0.3; else zoomLevel = 1; updateZoom(); });
    function updateZoom() { 
        $('#flipbook-wrapper').css('transform', `scale(${zoomLevel})`); 
        if(zoomLevel === 1) $('#canvas').scrollLeft(0).scrollTop(0);
    }

    // Drag to Pan
    let isDrag = false, sx, sy, sl, st;
    $('#canvas').on('mousedown', (e) => {
        if (zoomLevel <= 1) return;
        isDrag = true;
        sx = e.pageX - $('#canvas').offset().left;
        sy = e.pageY - $('#canvas').offset().top;
        sl = $('#canvas').scrollLeft();
        st = $('#canvas').scrollTop();
    });
    $(window).on('mouseup', () => isDrag = false);
    $(window).on('mousemove', (e) => {
        if (!isDrag) return;
        const x = e.pageX - $('#canvas').offset().left;
        const y = e.pageY - $('#canvas').offset().top;
        $('#canvas').scrollLeft(sl - (x - sx));
        $('#canvas').scrollTop(st - (y - sy));
    });

    // Navigation
    $(document).on('click', '.book-card', function() {
        const idx = $(this).data('index');
        $('#flipbook-view').removeClass('hidden').addClass('flex').hide().fadeIn(400);
        initFlipbook(idx);
    });

    $('#close-flipbook').click(() => location.reload()); // Refresh is cleanest for Turn.js reset
    $('#prev-btn').click(() => $('#flipbook').turn('previous'));
    $('#next-btn').click(() => $('#flipbook').turn('next'));

    // Swipe
    let tx;
    $('#canvas').on('touchstart', e => { tx = e.originalEvent.touches[0].clientX; });
    $('#canvas').on('touchend', e => {
        if(zoomLevel > 1) return;
        let ex = e.originalEvent.changedTouches[0].clientX;
        if (tx > ex + 60) $('#flipbook').turn('next');
        else if (tx < ex - 60) $('#flipbook').turn('previous');
    });

    $('#full-screen').click(() => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    });
});
