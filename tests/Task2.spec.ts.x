import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, Tuple, TupleBuilder, TupleReader, parseTuple, toNano } from 'ton-core';
import { Task2 } from '../wrappers/Task2';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task2 are ready to use
    });

    it('should find root', async () => {
        const tba = new TupleBuilder();
        let tbtmp = new TupleBuilder();
        tbtmp.writeNumber(1);
        tbtmp.writeNumber(2);
        tbtmp.writeNumber(3);
        tba.writeTuple(tbtmp.build());

        tbtmp = new TupleBuilder();
        tbtmp.writeNumber(4);
        tbtmp.writeNumber(5);
        tbtmp.writeNumber(6);
        tba.writeTuple(tbtmp.build());


        const tbb = new TupleBuilder();
        tbtmp = new TupleBuilder();
        tbtmp.writeNumber(7);
        tbtmp.writeNumber(8);
        tbb.writeTuple(tbtmp.build());

        tbtmp = new TupleBuilder();
        tbtmp.writeNumber(9);
        tbtmp.writeNumber(10);
        tbb.writeTuple(tbtmp.build());

        tbtmp = new TupleBuilder();
        tbtmp.writeNumber(11);
        tbtmp.writeNumber(12);
        tbb.writeTuple(tbtmp.build());

        const AB = (await task2.getMultTuple(tba.build(), tbb.build())).readTuple();
        expect(AB.readBigNumber().toString()).toBe('58');

        const BA = (await task2.getMultTuple(tbb.build(), tba.build())).readTuple();
        expect(BA.readBigNumber().toString()).toBe('39');
    });
});
