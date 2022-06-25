import fetch from 'node-fetch';
import crypto from 'crypto';

class Client {
    constructor(API_KEY, API_SECRET, PASSPHRASE) {
        this.API_KEY = API_KEY;
        this.PASSPHRASE = PASSPHRASE;
        this.API_SECRET = API_SECRET;
    }


    generateSignature(method, path, body='') {
        const TIMESTAMP = Date.now() / 1000;
        const MESSAGE = TIMESTAMP + method + path + body;

        const SIGN = crypto.createHmac('sha256', Buffer.from(this.API_SECRET, 'base64')).update(MESSAGE).digest('base64');
    
        return {
            timestamp: TIMESTAMP,
            sign: SIGN,
        };
    }


    request(url, method, path, body='') {
        const signature = this.generateSignature(method, path, body);
        const params = {
            'method': method,
            'headers': {
                'CB-ACCESS-KEY': this.API_KEY,
                'CB-ACCESS-SIGN': signature.sign,
                'CB-ACCESS-TIMESTAMP': signature.timestamp,
                'CB-ACCESS-PASSPHRASE': this.PASSPHRASE,
            }
        };

        return fetch(url, params);
    }


    getAccounts(filter) {
        return this.request('https://api.exchange.coinbase.com/accounts', 'GET', '/accounts', '')
                .then(res => res.json())
                .then(accounts => filter ? accounts.filter(acc => acc.balance > 0) : accounts)
                .catch(err => console.error(err));
    }
}

export default Client;