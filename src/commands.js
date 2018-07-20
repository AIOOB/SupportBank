const log4js = require('log4js');
const logger = log4js.getLogger('commands.js');

const { parseFile, writeFile } = require ('./fileio.js');

function processCommand(input, accounts) {
    const [_, command, args] = input.match(/([^ ]*)(?: (.*))?/);
    let fun = {
        'Quit': () => {
            logger.info('Quitting');
            return true;
        },
        'Import': parseFile,
        'Export': writeFile,
        'List': listAccount,
    }[command];
    return fun ? fun(args, accounts) : printHelp(input);
}

function listAccount(accountName, accounts) {
    if (accountName == 'All') {
        printAllAccounts(accounts);
    } else if (accounts.has(accountName)) {
        printAccountInfo(accounts.get(accountName));
    } else {
        logger.debug(`List command received for invalid account: ${accountName}`);
        console.log('The specified account doesn\'t exist');
    }
}

function printAllAccounts(accounts) {
    logger.debug('Listing all accounts.');
    console.log("All accounts:");
    accounts.forEach(account => {
        const balance = (account.balance / 100).toFixed(2);
        console.log(`${account.name} owes ${balance}`);
    });
}

function printAccountInfo(account) {
    logger.debug(`Listing Account info for: ${account.name}`);
    console.log(account.prettyPrint());
}

function printHelp(input) {
    logger.debug(`Unrecognised command: ${input}`);
    console.log(`
The available commands are:
Import [File]: Imports the transactions in the specified file
List All: Prints the name of every account and the balance
List [Account]: Prints a list of all transactions associated with the account
Quit: Exits the program.
    `.trim());
}

module.exports = processCommand;
