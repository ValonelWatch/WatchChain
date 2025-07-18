import { Address, beginCell, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import { EchoContract } from "../wrappers/EchoContract";

export async function run(provider: NetworkProvider) {
    const sender = provider.sender();
    const contract = provider.open(await EchoContract.fromInit());
    console.log("👤 Sender address:", sender.address?.toString());
    console.log("📬 Future contract address:", contract.address.toString());
    await contract.sendDeploy(sender, toNano("0.05"));
    console.log("✅ Deployment sent.");
}
