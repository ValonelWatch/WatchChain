import { TonConnectUI } from "@tonconnect/ui";

// Инициализация TON Connect
const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://mvpp.netlify.app/tonconnect-manifest.json', // замени на свой при необходимости
    buttonRootId: 'connect'
});

document.getElementById('send').onclick = async () => {
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('status');

    if (!message) {
        status.innerText = '⚠️ Введите сообщение!';
        return;
    }

    const wallet = tonConnectUI.connectedWallet;

    if (!wallet) {
        status.innerText = '⚠️ Сначала подключите кошелёк.';
        return;
    }

    const payloadBase64 = btoa(message); // преобразуем текст в base64

    const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        network: -3, // testnet
        messages: [
            {
                address: 'EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5', // адрес EchoContract
                amount: '50000000', // 0.05 TON в нанотонах
                payload: payloadBase64
            }
        ]
    };

    try {
        await tonConnectUI.sendTransaction(tx);
        status.innerText = '✅ Сообщение отправлено в блокчейн!';
    } catch (error) {
        console.error("Ошибка:", error);
        status.innerText = '❌ Ошибка при отправке.';
    }
};
