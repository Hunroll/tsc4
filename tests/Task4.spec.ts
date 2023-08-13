import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Builder } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });

    it('should encode', async () => {
        const shift = BigInt(25);
        let builder = new Builder();
        builder.storeUint(90, 8);
        builder.storeUint(97, 8);
        builder.storeUint(122, 8);
        const innerCell = builder.endCell();

        builder = new Builder();
        builder.storeUint(0, 32);
        builder.storeUint(65, 8);
        builder.storeUint(66, 8);
        builder.storeUint(67, 8);
        builder.storeUint(68, 8);
        builder.storeRef(innerCell);
        const initCell = builder.endCell();

        let c1 = (await task4.getDecode(shift, initCell)).beginParse();
        c1.loadUint(32);
        expect(c1.loadUint(8)).toBe(66);
        expect(c1.loadUint(8)).toBe(67);
        expect(c1.loadUint(8)).toBe(68);
        expect(c1.loadUint(8)).toBe(69);
        c1 = c1.loadRef().beginParse();
        expect(c1.loadUint(8)).toBe(65);
        expect(c1.loadUint(8)).toBe(98);
        expect(c1.loadUint(8)).toBe(97);

        //const BA = (await task3.getMultTuple(tbb.build(), tba.build())).readTuple();
        //expect(BA.readBigNumber().toString()).toBe('39');
    });
});
