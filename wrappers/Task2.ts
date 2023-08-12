import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Tuple, TupleBuilder, TupleItem, TupleReader } from 'ton-core';

export type Task2Config = {};

export function task2ConfigToCell(config: Task2Config): Cell {
    return beginCell().endCell();
}

export class Task2 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task2(address);
    }

    static createFromConfig(config: Task2Config, code: Cell, workchain = 0) {
        const data = task2ConfigToCell(config);
        const init = { code, data };
        return new Task2(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getMultTuple(provider: ContractProvider, A: TupleItem[], B: TupleItem[]) : Promise<TupleReader>{
        const tb = new TupleBuilder();
        tb.writeTuple(A);
        tb.writeTuple(B);
        const result = await provider.get('matrix_multiplier', tb.build());
        return result.stack.readTuple();
    }
}
