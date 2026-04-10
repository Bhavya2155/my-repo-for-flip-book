$(document).ready(function() {
    let zoomLevel = 1;
    let isInitialized = false;
    const flipSound = document.getElementById('flip-sound');

    // 1. DATA: List your books here
    const availableBooks = [
        { folder: 'book1', title: 'Lord Rushabhdev - April 2026', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then - March 2026', pages: 16 }
    ];

    // 2. RENDER GRID
    availableBooks.forEach((book, i) => {
        $('#magazine-list').append(`
            <div class="book-card cursor-pointer group" data-index="${i}">
                <div class="relative overflow-hidden rounded-lg bg-gray-800 shadow-2xl">
                    <img src="books/${book.folder}/1.jpg" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    <div class="absolute bottom-0 p-3 w-full">
                        <p class="text-[10px] uppercase tracking-widest text-red-500 font-bold">Volume ${i+1}</p>
                        <p class="text-xs font-bold truncate">${book.title}</p>
                    </div>
                </div>
            </div>
        `);
    });

    // 3. FLIPBOOK CORE
    function launchBook(index) {
        const book = availableBooks[index];
        const $fb = $('#flipbook');
        
        $fb.empty();
        $('#current-title').text(book.title);

        // Inject pages
        for (let i = 1; i <= book.pages; i++) {
            $fb.append(`<div class="page"><img src="books/${book.folder}/${i}.jpg" loading="lazy"></div>`);
        }

        const isMobile = window.innerWidth < 768;

        $fb.turn({
            width: isMobile ? window.innerWidth * 0.95 : 1000,
            height: isMobile ? window.innerHeight * 0.6 : 600,
            display: isMobile ? 'single' : 'double',
            duration: 1000, // 1 SECOND FLIP SYNC
            acceleration: true,
            gradients: true,
            elevation: 100,
            when: {
                turning: function() {
                    if(flipSound) {
                        flipSound.currentTime = 0;
                        flipSound.play();
                    }
                },
                turned: function(e, page) {
                    $('#page-counter').text(`${page} / ${book.pages}`);
                }
            }
        });
        isInitialized = true;
    }

    // 4. INTERACTION LISTENERS
    $(document).on('click', '.book-card', function() {
        const idx = $(this).data('index');
        $('#grid-view').fadeOut(300, () => {
            $('#flipbook-view').removeClass('hidden').addClass('flex').hide().fadeIn(300);
            launchBook(idx);
        });
    });

    $('#close-flipbook').click(() => {
        $('#flipbook-view').fadeOut(300, () => {
            $('#grid-view').fadeIn(300);
            if (isInitialized) {
                $('#flipbook').turn('destroy');
                isInitialized = false;
                zoomLevel = 1;
                updateZoom();
            }
        });
    });

    // Zoom Logic
    $('#zoom-in').click(() => { zoomLevel += 0.2; updateZoom(); });
    $('#zoom-out').click(() => { zoomLevel = Math.max(1, zoomLevel - 0.2); updateZoom(); });
    function updateZoom() { $('#flipbook').css('transform', `scale(${zoomLevel})`); }

    // Navigation
    $('#prev-btn').click(() => $('#flipbook').turn('previous'));
    $('#next-btn').click(() => $('#flipbook').turn('next'));

    // Mobile Swipe
    let startX;
    $('#canvas').on('touchstart', e => { startX = e.originalEvent.touches[0].clientX; });
    $('#canvas').on('touchend', e => {
        let endX = e.originalEvent.changedTouches[0].clientX;
        if (startX > endX + 50) $('#flipbook').turn('next');
        else if (startX < endX - 50) $('#flipbook').turn('previous');
    });

    // Keyboard support
    $(window).keydown(e => {
        if (!isInitialized) return;
        if (e.keyCode === 37) $('#flipbook').turn('previous');
        if (e.keyCode === 39) $('#flipbook').turn('next');
    });
});
