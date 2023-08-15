import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleReader, TupleBuilder } from 'ton-core';

export type Task5Config = {};

export function task5ConfigToCell(config: Task5Config): Cell {
    return beginCell().endCell();
}

export class Task5 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task5(address);
    }

    static createFromConfig(config: Task5Config, code: Cell, workchain = 0) {
        const data = task5ConfigToCell(config);
        const init = { code, data };
        return new Task5(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get_fibonacci_sequence(provider: ContractProvider, n: bigint, k: bigint) : Promise<TupleReader>{
        const tb = new TupleBuilder();
        tb.writeNumber(n);
        tb.writeNumber(k);
        const result = await provider.get('fibonacci_sequence', tb.build());
        return result.stack.readTuple();
    }

}
