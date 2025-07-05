const DB_NAME = 'MoneyTrackerDB';
let db = null;

async function initializeDatabase() {
    if (db) {
        db.close();
    }
    db = new Dexie(DB_NAME);

    db.version(1).stores({
        accounts: '++id, name, initialBalance, color',
        transactions: '++id, type, date, amount, accountId, toAccountId',
        settings: 'key,value'
    });

    try {
        await db.open();

        await seedDefaultAccounts();
        await seedDefaultSettings();

        console.log("Database initialized and seeded.");
    } catch (error) {
        console.error("Failed to open or initialize database:", error);

    }
}

const defaultAccounts = [
    { name: 'Bank A', initialBalance: 0, color: 'blue' },
    { name: 'Digital Wallet 1', initialBalance: 0, color: 'yellow' },
    { name: 'Cash', initialBalance: 0, color: 'green' }
];

async function seedDefaultAccounts() {
    const count = await db.accounts.count();
    if (count === 0) {
        await db.accounts.bulkAdd(defaultAccounts);
        console.log("Default accounts seeded.");
    }
}

async function seedDefaultSettings() {
    const currencySetting = await db.settings.get('main-currency');
    const languageSetting = await db.settings.get('app-language');

    if (currencySetting === undefined) {
        await db.settings.put({ key: 'main-currency', value: 0 });
        console.log("Default currency setting seeded.");
    }

    if (languageSetting === undefined) {
        await db.settings.put({ key: 'app-language', value: 'id' });
        console.log("Default language setting seeded.");
    }
}

async function performFullReset() {
    try {
        if (db) {
            db.close();
        }
        await Dexie.delete(DB_NAME);
        console.log("Database deleted successfully.");
        await initializeDatabase();
        return true;
    } catch (error) {
        console.error("Failed to perform full database reset:", error);
        return false;
    }
}

initializeDatabase();

window.db = db;
window.initializeDatabase = initializeDatabase;
window.performFullReset = performFullReset;