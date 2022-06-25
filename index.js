import CBPClient from './classes/CBPClient.js';
import keys from './keys.js';

const url = 'https://api.exchange.coinbase.com/accounts';

let client = new Client(keys.API_KEY, keys.API_SECRET, keys.PASSPHRASE);

let accounts = await client.getAccounts(true);
console.log(accounts);