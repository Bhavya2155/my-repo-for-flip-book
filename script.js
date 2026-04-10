function initFlipbook(index) {
    const book = books[index];
    const $fb = $('#flipbook');
    $fb.empty();
    $('#current-title').text(book.title);

    for (let i = 1; i <= book.pages; i++) {
        $fb.append(`<div class="page"><img src="books/${book.folder}/${i}.jpg"></div>`);
    }

    const isMobile = window.innerWidth < 768;
    
    // Calculate the perfect size to prevent cutting
    // If your images are roughly 1:1.4 ratio (like A4 paper):
    let bookHeight = window.innerHeight * 0.8;
    let bookWidth = isMobile ? window.innerWidth * 0.9 : (bookHeight * 0.7) * 2;

    $fb.turn({
        width: bookWidth,
        height: bookHeight,
        display: isMobile ? 'single' : 'double',
        duration: 1000,
        acceleration: true,
        gradients: false, // Turn off gradients to remove the gray 'spine' overlay if it bothers you
        elevation: 100,
        when: {
            turning: function() { 
                if(flipSound) { flipSound.currentTime = 0; flipSound.play(); }
            },
            turned: function(e, page) { 
                $('#page-counter').text(`${page} / ${book.pages}`); 
            }
        }
    });
    isInitialized = true;
}
