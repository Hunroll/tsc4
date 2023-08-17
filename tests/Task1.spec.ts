import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Builder, Cell, beginCell, toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
    });

    it('should find root', async () => {
        let  c2 = beginCell().storeUint(42,8).endCell();
        let c2hc = BigInt('17726217803758832182344460315836809048952421024668242764346379232819884596353');
        //c1.refs.concat(c2);
        let res = task1.getNode(c2, c2hc);
        expect(await res).toEqualCell(c2);
    });

    it('should find root', async () => {
        let  c2 = beginCell().storeUint(42,8).endCell();
        let c2hc = BigInt('17726217803758832182344460315836809048952421024668242764346379232819884596353');
        let b = new Builder();
        b.storeRef(c2);
        //c1.refs.concat(c2);
        let res = task1.getNode(b.endCell(), c2hc);
        expect(await res).toEqualCell(c2);
    });

    it('should find root', async () => {
        let  c2 = beginCell().storeUint(42,8).endCell();
        let c2hc = BigInt('17726217803758832182344460315836809048952421024668242764346379232819884596353');
        let b = new Builder();
        b.storeRef(c2);
        b = new Builder().storeRef(b);
        //c1.refs.concat(c2);
        let res = task1.getNode(b.endCell(), c2hc);
        expect(await res).toEqualCell(c2);
    });
    it('should find root', async () => {
        let  c2 = beginCell().storeUint(42,8).endCell();
        let c2hc = BigInt('17726217803758832182344460315836809048952421024668242764346379232819884596353');
        let b = new Builder();
        b.storeRef(c2);
        b = new Builder().storeRef(new Cell()).storeRef(new Cell()).storeRef(b);
        //c1.refs.concat(c2);
        let res = task1.getNode(b.endCell(), c2hc);
        expect(await res).toEqualCell(c2);
    });

    it('should not find root', async () => {
        let  c2 = beginCell().storeUint(42,8).endCell();
        let c2hc = BigInt(0);
        let b = new Builder();
        b.storeRef(c2);
        b = new Builder().storeRef(b);
        //c1.refs.concat(c2);
        let res = task1.getNode(b.endCell(), c2hc);
        expect(await res).toEqualCell(beginCell().endCell());
    });
});
