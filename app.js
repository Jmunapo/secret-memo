const { env } = require('./config');
const { SecretMemo } = require('./secret-memo');

/**
 * Script Usage
 * @param {string} SALT is a hash string get one from md5
 * @param {string} IV is a hash string get one from md5
 */
const secMemo = new SecretMemo(env.PASS_KEY, env.SALT, env.IV);

const memo = secMemo.toMemo("This is my cool encrypted memo!");

//Use this value as your memo hash
const memo_hash = memo.value.toString('hex');

//pass either memo or memo_hash to fromMemo
const encrypted = secMemo.fromMemo(memo_hash);

console.log({ encrypted, memo_hash });