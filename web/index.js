import { TonConnectUI } from '@tonconnect/ui';

const connector = new TonConnectUI({
    manifestUrl: 'https://watchchainmvp.netlify.app/tonconnect-manifest.json',
    buttonRootId: 'connect',
});

document.getElementById('send').onclick = async () => {
    const message = document.getElementById('message').value;
    const status = document.getElementById('status');

    if (!message) {
        status.textContent = 'Введите сообщение перед отправкой!';
        return;
    }

    const wallet = connector.wallet;
    if (!wallet) {
        status.textContent = 'Сначала подключите кошелёк.';
        return;
    }

    const payloadBase64 = btoa(
        String.fromCharCode(...new TextEncoder().encode(message))
    );

    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
            {
                address: 'EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5', // Адрес контракта EchoContract
                amount: '50000000',
                payload: payloadBase64,
            },
        ],
    };

    try {
        await connector.sendTransaction(transaction);
        status.textContent = '✅ Сообщение отправлено в блокчейн!';
    } catch (err) {
        console.error(err);
        status.textContent = '❌ Ошибка при отправке: ' + err.message;
    }
};
