$(document).ready(function() {
    let isInitialized = false;

    // CONFIGURATION: Add your books here
    const books = [
        { folder: 'book1', title: 'Lord Rushabhdev - April 2026', pages: 16 },
        { folder: 'book2', title: 'The Era Back Then - March 2026', pages: 16 }
    ];

    // 1. Generate the Grid on Page Load
    const $grid = $('#magazine-list');
    books.forEach((book, index) => {
        const card = `
            <div class="book-card cursor-pointer group" data-index="${index}">
                <div class="relative overflow-hidden rounded-xl bg-gray-900 border border-gray-700 shadow-lg">
                    <img src="books/${book.folder}/1.jpg" class="w-full aspect-[3/4] object-cover">
                    <div class="p-4 bg-gray-900">
                        <h3 class="font-bold text-sm truncate">${book.title}</h3>
                        <p class="text-xs text-gray-500 mt-1 uppercase">${book.pages} Pages</p>
                    </div>
                </div>
            </div>`;
        $grid.append(card);
    });

    // 2. Load Flipbook Logic
    function startReading(index) {
        const book = books[index];
        const $fb = $('#flipbook');
        
        $fb.empty(); // Clear old pages
        $('#current-title').text(book.title);

        // Add page divs
        for (let i = 1; i <= book.pages; i++) {
            $fb.append(`<div class="page"><img src="books/${book.folder}/${i}.jpg"></div>`);
        }

        // Initialize Turn.js
        $fb.turn({
            width: 900,
            height: 600,
            autoCenter: true,
            display: 'double',
            acceleration: true,
            elevation: 50,
            gradients: true,
            when: {
                turned: function(e, page) {
                    $('#page-counter').text(`PAGE ${page} / ${book.pages}`);
                }
            }
        });
        isInitialized = true;
    }

    // 3. Event Listeners
    $(document).on('click', '.book-card', function() {
        const idx = $(this).data('index');
        $('#grid-view').fadeOut(300, function() {
            $('#flipbook-view').css('display', 'flex').hide().fadeIn(300);
            startReading(idx);
        });
    });

    $('#close-flipbook').on('click', function() {
        $('#flipbook-view').fadeOut(300, function() {
            $('#grid-view').fadeIn(300);
            if (isInitialized) {
                $('#flipbook').turn('destroy');
                isInitialized = false;
            }
        });
    });

    // Navigation buttons
    $('#prev-btn').on('click', () => $('#flipbook').turn('previous'));
    $('#next-btn').on('click', () => $('#flipbook').turn('next'));

    // Keyboard support
    $(window).keydown(function(e) {
        if (!isInitialized) return;
        if (e.keyCode === 37) $('#flipbook').turn('previous');
        if (e.keyCode === 39) $('#flipbook').turn('next');
    });
});
