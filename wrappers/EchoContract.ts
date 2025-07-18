import { Address, Cell, beginCell, Contract, ContractProvider, Sender, SendMode } from "@ton/core";

export class EchoContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static async fromInit(): Promise<EchoContract> {
        const code = beginCell().endCell(); // Подставить скомпилированный контракт
        const data = beginCell().endCell();
        const address = await Address.fromInitialData({ code, data }, 0);
        return new EchoContract(address, { code, data });
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0, 32).endCell()
        });
    }

    async sendMessage(provider: ContractProvider, via: Sender, value: bigint, message: string) {
        const body = beginCell().storeStringTail(message).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body
        });
    }
}
