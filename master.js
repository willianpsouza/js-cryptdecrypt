/*
    AUTHOR: willian pires de souza
    EMAIL: willian_pire@hotmail.com
    DESCRIPTION: simple javascript RSA generator.

*/

const crypto = require('crypto');
const fs = require('fs');
const process = require('process');

function createKeys(){
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2687,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },  
    });
    return ({privatekey: privateKey.toString(), publickey: publicKey.toString()})
};

function generateKeyFiles(){
    const _v = createKeys();
    if (fs.existsSync('private.key')){
        console.log('private keys already exists')
        return false
    }
    if (fs.existsSync('public.key')){
        console.log('public keys already exists')
        return false
    }    
    fs.writeFileSync('private.key', _v.privatekey, err => {
        if (err){
            console.log('fail to write private key');
        }
    });

    fs.writeFileSync('public.key', _v.publickey, err => {
        if (err){
            console.log('fail to write public key');
        }
    });
};

function encryptData(data, publicKey){
    return crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha512",
    },
    Buffer.from(data)
    );
};

function decryptData(data, privateKey){
    return crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha512",
    },data
    );
};

function main(){
    const TOTAL = 10000;
    let total = 0;

    generateKeyFiles();

    const publicKey = fs.readFileSync('public.key', 'utf8');
    const privateKey = fs.readFileSync('private.key', 'utf8');

    while(true){
        var data = crypto.randomBytes(72).toString('hex');
        //var data = ["Adipisicing consectetur in sed, tempor duis pariatur excepteur reprehenderit deserunt.  Excepteur labore alcatra pariatur, dolore tail non salami shoulder shank ad brisket ham.  Filet mignon eu turducken voluptate ham, minim dolor aliqua ex bresaola in jerky leberkas.  Capicola voluptate pariatur, officia duis tail nisi id in quis.","Biltong ea incididunt pariatur prosciutto aliquip adipisicing.  Jerky pig anim short ribs, dolor leberkas capicola nisi fatback kevin incididunt ut.  Voluptate shankle spare ribs tempor hamburger consequat velit.  Lorem buffalo ham hock, shankle beef ribs ullamco magna chuck turducken sunt laboris ut duis.  Ground round meatball ex non corned beef fatback pork chop brisket.  In tri-tip fatback ut aliquip tempor velit do sausage drumstick esse ad enim est.  Fugiat incididunt brisket strip steak tempor capicola non salami.","Picanha turducken pork belly, corned beef minim reprehenderit alcatra in ea officia dolore est jowl bresaola.  Aliqua ut ipsum turducken tail brisket irure voluptate spare ribs fatback est.  Corned beef excepteur exercitation, ground round pastrami irure quis.  Duis proident non minim porchetta chuck consequat anim pastrami ground round burgdoggen ball tip ad flank pork loin.  Jowl in aliqua, fugiat adipisicing ex non ut esse magna ad pastrami voluptate venison dolore.  Dolore cow filet mignon meatloaf ut.  Sausage eu beef ribs, boudin chislic sed nulla pork do burgdoggen ea enim id.","Brisket landjaeger cupim, shoulder rump ad tongue andouille dolor cow ea kielbasa chislic ham pancetta.  Brisket short loin pork belly sausage duis tempor kevin commodo non pork filet mignon et sunt.  Et incididunt excepteur, kielbasa picanha adipisicing short ribs strip steak sunt officia salami cillum biltong.  Occaecat sausage pig incididunt salami chuck fugiat sed bacon.  Beef ribs ex bacon esse veniam alcatra deserunt culpa chuck pancetta in tri-tip.","Ullamco jerky venison cupidatat est id commodo labore dolore.  Pork buffalo dolore tempor frankfurter velit.  Sed sint eu, boudin pork loin hamburger shankle kielbasa dolore pancetta venison beef incididunt rump fatback.  Shankle filet mignon culpa, dolore nisi in sunt minim chislic."]
        const encryptedData = encryptData(data, publicKey)
        const decriptedData = decryptData(encryptedData, privateKey)
        //console.log("encypted data:", encryptedData.toString('base64'));
        //console.log("decripted data:", decriptedData.toString())
        if (decriptedData.toString() !== data){
            console.log('fail !!!')
            break;
        }
        total++;
        if (TOTAL === total){
            break;
        }
        process.stdout.write(`ok: ${total}\r`)
    };
};

main();


