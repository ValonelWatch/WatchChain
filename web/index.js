import { TonConnectUI } from 'https://unpkg.com/@tonconnect/ui/dist/tonconnect-ui.esm.js';

const CONTRACT_ADDRESS = 'EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5';
const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

const tonConnectUI = new TonConnectUI({
  manifestUrl,
  network: 'testnet',
});

const btnRoot = document.getElementById('ton-connect-button');
tonConnectUI.renderButton({ element: btnRoot });

tonConnectUI.onStatusChange((wallet) => {
  document.getElementById('app').style.display = wallet ? 'block' : 'none';
});

document.getElementById('send').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = '';
  try {
    if (!tonConnectUI.wallet) {
      await tonConnectUI.connect(); // откроет bridge / deep link
    }
    const text = document.getElementById('message').value.trim();
    if (!text) throw new Error('Пустое сообщение');
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const payloadBase64 = btoa(String.fromCharCode(...bytes));

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [{
        address: CONTRACT_ADDRESS,
        amount: '1000000',            // 0.001 TON
        payloadBase64,
      }],
    };

    await tonConnectUI.sendTransaction(tx);
    status.textContent = '✅ Запрос отправлен! Подтвердите в кошельке.';
  } catch (e) {
    console.error(e);
    status.textContent = '❌ ' + (e.message || e);
  }
});
