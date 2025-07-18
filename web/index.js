import { TonConnectUI } from '@tonconnect/ui';

const CONTRACT_ADDRESS = 'EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5'; // замените при необходимости

const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://mvpp.netlify.app/tonconnect-manifest.json',
  buttonRootId: 'connect-button',
  uiPreferences: {
    theme: 'DARK'
  }
});

const sendBtn = document.getElementById('send-button');
const statusText = document.getElementById('status');
const textarea = document.getElementById('message');
const addressBox = document.getElementById('wallet-address');

tonConnectUI.onStatusChange(wallet => {
  if (wallet?.account?.address) {
    addressBox.innerText = `💼 Кошелёк: ${wallet.account.address}`;
  } else {
    addressBox.innerText = '';
  }
});

sendBtn.addEventListener('click', async () => {
  const wallet = tonConnectUI.connectedWallet;
  const text = textarea.value.trim();

  if (!wallet) {
    alert('Сначала привяжите кошелёк!');
    return;
  }

  if (!text) {
    alert('Введите сообщение!');
    return;
  }

  const payload = Buffer.from(text, 'utf8').toString('base64');
  statusText.innerText = '📡 Отправка...';

  try {
    await tonConnectUI.sendTransaction({
      messages: [
        {
          address: CONTRACT_ADDRESS,
          amount: '1000000', // 0.001 TON
          payload
        }
      ],
      validUntil: Math.floor(Date.now() / 1000) + 60
    });

    statusText.innerText = '✅ Сообщение отправлено в блокчейн!';
    textarea.value = '';
  } catch (e) {
    console.error(e);
    statusText.innerText = '❌ Ошибка при отправке. Проверьте лог.';
  }
});
