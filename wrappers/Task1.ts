import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, serializeTuple, TupleBuilder } from 'ton-core';

export type Task1Config = {};

export function task1ConfigToCell(config: Task1Config): Cell {
    return beginCell().endCell();
}

export class Task1 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task1(address);
    }

    static createFromConfig(config: Task1Config, code: Cell, workchain = 0) {
        const data = task1ConfigToCell(config);
        const init = { code, data };
        return new Task1(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
   
    async getNode(provider: ContractProvider, c: Cell, hash: bigint) : Promise<Cell>{
        const tb = new TupleBuilder();
        tb.writeNumber(hash);
        tb.writeCell(c);
        const result = await provider.get('find_branch_by_hash', tb.build());
        return result.stack.readCell();
    }
}
