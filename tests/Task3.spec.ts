import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Builder, Cell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    it('should replace flags', async () => {
        const from = BigInt(0b110011);
        const to = BigInt(0b001100);
        let builder = new Builder();
        builder.storeUint(0b0011,4);
        const inner = builder.endCell();
        builder = new Builder();
        builder.storeRef(inner);
        builder.storeUint(0b101010101010101011001111001100110011, 36)
        const initCell = builder.endCell();

        const c1 = (await task3.getReplacedFlags(from, to, initCell)).beginParse();
        const c2 = c1.loadRef().beginParse();
        expect(c1.loadUint(36)).toBe(0b101010101010101000001100000011000000);
        expect(c2.loadUint(4)).toBe(0b1100);

        //const BA = (await task3.getMultTuple(tbb.build(), tba.build())).readTuple();
        //expect(BA.readBigNumber().toString()).toBe('39');
    });
});
