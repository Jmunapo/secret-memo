const {
    AES: { encrypt, decrypt },
    pad: { AnsiX923 },
    mode: { CTR },
    format,
    enc: { Utf8, Hex },
    PBKDF2
} = require("crypto-js");

const crypto = require('crypto');

const { Memo, MemoHash } = require("stellar-sdk");


const MAX_MEMO_LENGTH = 31;

exports.SecretMemo = class SecretMemo {

    constructor(secret, salt, iv) {
        this.secret = secret;
        this.salt = salt;
        this.iv = iv;
    }

    /**
     * Encrypts user's memo
     * @param {string} data User Data
     * @returns {MemoHash}
     */
    toMemo(data) {

        if (data.length > MAX_MEMO_LENGTH) {
            throw new Error(`The data string cannot be longer than ${MAX_MEMO_LENGTH} characters`);
        }

        const required_padding = 16 - data.length;

        if (data.length < 16) {
            const padding = crypto.randomBytes(required_padding)
                .toString('hex')
                .slice(0, required_padding);
            const padding_size = String.fromCharCode(required_padding);
            data = `${data}${padding}${padding_size}`;
        }

        const key = PBKDF2(this.secret, Hex.parse(this.salt), {
            keySize: 8,
            iterations: 100
        });
        const encrypted = encrypt(data, key, {
            iv: Hex.parse(this.iv),
            padding: AnsiX923,
            mode: CTR

        });

        const hash = encrypted.toString(format.Hex);

        if (hash.length !== 64) {
            throw new Error(`Error, computed hash must be 64 characters long. Got ${hash.length}`);
        }

        return Memo.hash(hash);

    }

    /**
     * Decrypts memo from hash or MemoHash
     * @param {MemoHash|String} memo Memo or 64 bit String
     * @returns {string}
     */
    fromMemo(memo) {
        if (typeof memo !== 'string') {
            memo = memo.value instanceof Buffer ? memo.value.toString('hex') : memo.value;
        }
        const key = PBKDF2(this.secret, Hex.parse(this.salt), {
            keySize: 8,
            iterations: 100
        });

        let decrypted = decrypt(memo, key, {
            iv: Hex.parse(this.iv),
            padding: AnsiX923,
            mode: CTR,
            format: format.Hex
        }).toString(Utf8);

        const last_char = decrypted.slice(-1);

        const code_point = Number(last_char.codePointAt(0));

        if (!isNaN(code_point) && 1 <= code_point && code_point <= 16) {
            decrypted = decrypted.slice(0, -(1 + last_char.charCodeAt(0)));
        }

        return decrypted;
    }
}