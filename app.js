/**
 * App Initialization point
 * 
 */
const { env } = require('./config');
const { SecretMemo } = require('./secret-memo');

const secMemo = new SecretMemo(env.PASS_KEY, env.SALT, env.IV);

const memo = secMemo.toMemo("This is my cool encrypted memo");

const encrypted = secMemo.fromMemo(memo);

console.log({ encrypted: memo.value.toString('hex'), encrypted });

(() => {
    console.log("App Started...");
    //59ab79537ef7d845cd008d878ce2967b1827be06315ef93f7a0e51e998c97433
})();