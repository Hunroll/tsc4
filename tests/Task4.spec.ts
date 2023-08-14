import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Builder, beginCell } from 'ton-core';
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
        expect(await task4.getEncode(BigInt(1), `aa bbb cA
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
    `)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(`bb ccc dB
        wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yzawfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza
        rxfsuzvjpjq[]bteghgihkilkm;m';aydywcono,./
        !"#$%&\'()*+,-./0123456789:;<=>?@BCDEFGHIJKLMNOPQRSTUVWXYZA[\\]^_\`bcdefghijklmnopqrstuvwxyza{|}~
    `).endCell());});
        
    it('should encode', async () => {
        expect(await task4.getEncode(BigInt(1), ` `)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(` `).endCell());
    });

    it('should decode', async () => {
        expect(await task4.getDecode(BigInt(1), ` `)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(` `).endCell());
    });

    it('should decode', async () => {
        expect(await task4.getDecode(BigInt(25), `aa bbb cA
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
    `)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(`bb ccc dB
        wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yzawfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza
        rxfsuzvjpjq[]bteghgihkilkm;m';aydywcono,./
        !"#$%&\'()*+,-./0123456789:;<=>?@BCDEFGHIJKLMNOPQRSTUVWXYZA[\\]^_\`bcdefghijklmnopqrstuvwxyza{|}~
    `).endCell());});

    it('should decode', async () => {
        expect(await task4.getDecode(BigInt(1), `bb ccc dB
        wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yzawfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza
        rxfsuzvjpjq[]bteghgihkilkm;m';aydywcono,./
        !"#$%&\'()*+,-./0123456789:;<=>?@BCDEFGHIJKLMNOPQRSTUVWXYZA[\\]^_\`bcdefghijklmnopqrstuvwxyza{|}~
    `)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(`aa bbb cA
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
    `).endCell());});

    it('should decode', async () => {
        expect(await task4.getDecode(BigInt(2601), `bb ccc dB
        wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yzawfsz mpoh tusjoh bcd yza wfsz mpoh tusjoh bcd yza
        rxfsuzvjpjq[]bteghgihkilkm;m';aydywcono,./
        !"#$%&\'()*+,-./0123456789:;<=>?@BCDEFGHIJKLMNOPQRSTUVWXYZA[\\]^_\`bcdefghijklmnopqrstuvwxyza{|}~
    `)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(`aa bbb cA
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
    `).endCell());});
    
    it('should encode', async () => {
        expect(await task4.getEncode(BigInt(1), `🎅`)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(`🎅`).endCell());});
        
    it('should encode', async () => {
        expect(await task4.getEncode(BigInt(1), ``)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(``).endCell());});

    it('should encode', async () => {
        expect(await task4.getEncode(BigInt(0), `aa bbb cA
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
    `)).toEqualCell(beginCell().storeUint(0, 32).storeStringTail(`aa bbb cA
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
        very long string abc xyz very long string abc xyz very long string abc xyz very long string abc xyzvery long string abc xyz very long string abc xyz
        qwertyuioip[]asdfgfhgjhkjl;l';zxcxvbnmn,./
        !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~
    `).endCell());});
});
