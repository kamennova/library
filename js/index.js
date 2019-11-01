const reserveButtons = document.querySelectorAll('.reserve-btn');

for (const btn of reserveButtons) {
    btn.addEventListener('click', function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/bookAction', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            action: 'reserve'
        }));
    });
}

// ---

const queueButtons = document.querySelectorAll('.queue-btn');

for (const btn of queueButtons) {
    btn.addEventListener('click', function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/bookAction', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            action: 'enqueue'
        }));
    });
}