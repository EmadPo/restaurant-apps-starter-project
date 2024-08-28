
async function renderNotifikasi() {
    Notification.requestPermission()
    .then(function(permission) {
    if (permission === 'granted') {
        console.log('Notifikasi diizinkan');
    } else if (permission === 'denied') {
        console.log('Notifikasi ditolak');
    } else if (permission === 'default') {
        console.log('Notifikasi belum dipilih');
    }
    });
}

renderNotifikasi();