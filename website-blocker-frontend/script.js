const form = document.getElementById('block-form');
const blockedWebsitesList = document.getElementById('blocked-websites');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('url').value;
    const duration = document.getElementById('duration').value;

    fetch('http://localhost:3000/block', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, duration })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadBlockedWebsites();
    })
    .catch(error => console.error('Error:', error));
});

function loadBlockedWebsites() {
    fetch('http://localhost:3000/blocked-websites')
        .then(response => response.json())
        .then(data => {
            blockedWebsitesList.innerHTML = '';
            for (const url in data) {
                const listItem = document.createElement('li');
                listItem.textContent = `${url} - Unblocks at: ${new Date(data[url])}`;
                blockedWebsitesList.appendChild(listItem);
            }
        })
        .catch(error => console.error('Error:', error));
}

loadBlockedWebsites();
