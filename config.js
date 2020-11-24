require('dotenv').config();

/**
 * Combine all environment variable in one place
 * for ease of access e.g env.PASS_KEY anywhere in the app
 */
module.exports = {
    env: {
        PASS_KEY: process.env.PASS_KEY,
        SALT: process.env.SALT,
        IV: process.env.IV,
    }
}