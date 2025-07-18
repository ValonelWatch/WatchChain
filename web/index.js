const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://watchchainmvp.netlify.app/tonconnect-manifest.json',
    buttonRootId: 'connect'
});

document.getElementById('send').onclick = async () => {
    const message = document.getElementById('message').value;
    const status = document.getElementById('status');

    if (!message) {
        status.textContent = "Введите сообщение перед отправкой.";
        return;
    }

    try {
        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [{
                address: "EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5", // EchoContract
                amount: "1000000", // 0.001 TON
                payload: btoa(message)
            }]
        });
        status.textContent = "Сообщение отправлено!";
    } catch (err) {
        console.error(err);
        status.textContent = "Ошибка отправки: " + err.message;
    }
};
