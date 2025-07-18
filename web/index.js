import { TonConnect } from '@tonconnect/sdk';

const tonConnect = new TonConnect({ /* meta, manifest... */ });
let sender;

document.getElementById('connect').onclick = async () => {
  await tonConnect.connect();
  sender = tonConnect.account;
  // показать в UI
};

document.getElementById('send').onclick = async () => {
  if (!sender) return alert('Не подключён кошелёк');
  const text = document.getElementById('message').value.trim();
  if (!text) return alert('Введите сообщение');

  const payload = Buffer.from(text, 'utf8').toString('base64');
  const msg = {
    address: CONTRACT_ADDRESS,
    amount: '1000000', // 0.001 TON
    payload: payload,
  };
  try {
    const result = await tonConnect.sendTransaction({
      messages: [msg],
      valid_until: Date.now() + 60000,
      from: sender.account,
      // network: -239 (mainnet) or -3 (testnet)
      network: -3,
    });
    console.log('tx:', result);
  } catch (e) {
    console.error(e);
    alert('Ошибка при отправке: ' + e.message);
  }
};
