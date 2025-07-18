import { TonConnectUI } from "https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js";

const tonConnectUI = new TonConnectUI({
    manifestUrl: window.location.origin + '/tonconnect-manifest.json',
    buttonRootId: 'connect'
});

document.getElementById('send').onclick = async () => {
    const status = document.getElementById('status');
    const text = document.getElementById('message').value.trim();

    if (!text) {
        status.textContent = '❗ Введите сообщение';
        return;
    }

    const connectedWallet = await tonConnectUI.connectedWallet;
    if (!connectedWallet) {
        status.textContent = '❗ Сначала подключите кошелёк';
        return;
    }

    const recipient = "EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5"; // адрес EchoContract
    const payload = textToBase64Payload(text);

    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
            {
                address: recipient,
                amount: "50000000", // 0.05 TON
                payload: payload
            }
        ]
    };

    try {
        await tonConnectUI.sendTransaction(transaction);
        status.textContent = '✅ Сообщение отправлено';
        document.getElementById('message').value = '';
    } catch (e) {
        console.error(e);
        status.textContent = '❌ Ошибка при отправке';
    }
};

function textToBase64Payload(text) {
    const textBytes = new TextEncoder().encode(text);
    const base64 = btoa(String.fromCharCode(...textBytes));
    return `base64:${base64}`;
}

