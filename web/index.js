import { TonConnectUI } from "@tonconnect/ui";

const tonConnect = new TonConnectUI({
    manifestUrl: "https://mvpp.netlify.app/tonconnect-manifest.json",
    buttonRootId: "connect"
});

document.getElementById("send").onclick = async () => {
    const input = document.getElementById("message");
    const status = document.getElementById("status");
    if (!input.value) {
        status.textContent = "❗Введите сообщение";
        return;
    }

    try {
        const tx = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
                {
                    address: "EQBvL1b1vvi-yXP_leOiX3tsOBawWItXOf9FmB0xCl6chsx5", // EchoContract
                    amount: "50000000",
                    payload: btoa(input.value)
                }
            ]
        };
        await tonConnect.sendTransaction(tx);
        status.textContent = "✅ Сообщение отправлено в блокчейн";
    } catch (e) {
        status.textContent = "❌ Ошибка: " + e.message;
    }
};
