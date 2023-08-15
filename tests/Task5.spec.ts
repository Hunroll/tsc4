import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, TupleBuilder, TupleReader, toNano } from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task5 are ready to use
    });

    it('should decode', async () => {
        let res = await task5.get_fibonacci_sequence(BigInt(1), BigInt(2));
        let expected = new TupleBuilder();
        expected.writeNumber(1);
        expected.writeNumber(1);
        
        expect(res).toEqual(new TupleReader(expected.build()));
    });

    it('should decode', async () => {
        let res = await task5.get_fibonacci_sequence(BigInt(1), BigInt(4));
        let expected = new TupleBuilder();
        expected.writeNumber(1);
        expected.writeNumber(1);
        expected.writeNumber(2);
        expected.writeNumber(3);
        
        expect(res).toEqual(new TupleReader(expected.build()));
    });

    it('should decode', async () => {
        let res = await task5.get_fibonacci_sequence(BigInt(0), BigInt(0));
        let expected = new TupleBuilder();
        
        expect(res).toEqual(new TupleReader(expected.build()));
    });
    it('should decode', async () => {
        let res = await task5.get_fibonacci_sequence(BigInt(204), BigInt(1));
        let expected = new TupleBuilder();
        //expected.writeNumber(453973694165307953197296969697410619233826);
        //expected.writeNumber(734544867157818093234908902110449296423351);
        //expected.writeNumber(1188518561323126046432205871807859915657177);
        expected.writeNumber(1923063428480944139667114773918309212080528);
        
        expect(res).toEqual(new TupleReader(expected.build()));
    });

    it('should decode', async () => {
        let res = await task5.get_fibonacci_sequence(BigInt(369), BigInt(2));
        let expected = new TupleBuilder();
        expected.writeNumber(58472848379039952684853851736901133239741266891456844557261755914039063645794);
        expected.writeNumber(94611056096305838013295371573764256526437182762229865607320618320601813254535);
        //expected.writeNumber(1188518561323126046432205871807859915657177);
        //expected.writeNumber(1923063428480944139667114773918309212080528);
        
        expect(res).toEqual(new TupleReader(expected.build()));
    });
});
