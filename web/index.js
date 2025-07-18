// Адрес вашего EchoContract
const CONTRACT_ADDRESS = 'EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5';

// URL манифеста, автоматически подставит правильный хост
const manifestUrl = `${location.origin}/tonconnect-manifest.json`;

// Инициализируем TonConnect UI
const tonconnect = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl,
  buttonRootId: 'connect',
  network: 'testnet',
  openBridgeAsPopup: true,
});

// Показываем форму после подключения
tonconnect.onStatusChange(wallet => {
  document.getElementById('app').style.display = wallet ? 'block' : 'none';
});

// Обработчик кнопки «Отправить»
document.getElementById('send').onclick = async () => {
  const status = document.getElementById('status');
  status.textContent = '';
  try {
    // Если ещё не подключены, откроем QR/браузер-мост
    if (!tonconnect.wallet) {
      await tonconnect.connect();
    }
    const wallet = tonconnect.wallet;
    if (!wallet) throw new Error('Не удалось подключить кошелёк');

    // Забираем текст
    const text = document.getElementById('message').value.trim();
    if (!text) {
      status.textContent = '❌ Введите сообщение';
      return;
    }

    // Кодируем в Base64
    const bytes = new TextEncoder().encode(text);
    const payloadBase64 = btoa(String.fromCharCode(...bytes));

    // Собираем транзакцию
    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: CONTRACT_ADDRESS,
          amount: '100000', // 0.001 TON = 100 000 nanotons
          payloadBase64,
        },
      ],
    };

    // Отправляем
    await tonconnect.sendTransaction(tx);
    status.textContent = '✅ Отправлено! Подтвердите в кошельке.';
  } catch (e) {
    console.error(e);
    status.textContent = '❌ ' + (e.message || e);
  }
};
