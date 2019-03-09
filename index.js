require('dotenv').config()
const puppeteer = require('puppeteer');

var browser = ''
var page = ''
var money = '1'
var direction = true
var balance = 0
var time
var lose = 0

let run = async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.setViewport({
        width: 950,
        height: 800
    });
    await page.goto('https://pocketoption.com/login/');
    setTimeout(() => login(), 3000)
};

run();

let login = async () => {

    const input = await page.$('.form-control');
    await input.click({ clickCount: 3 })
    await input.type(process.env.EMAIL);
    await page.keyboard.press('Enter');
    setTimeout(async () => {
        await page.keyboard.type(process.env.PASSWORD);
        await page.keyboard.press('Enter');
    }, 1000)

    setTimeout(() => setting(), 10000)
};

let setting = async () => {
    const element = await page.$(".balance_current");
    const text = await page.evaluate(element => element.textContent, element);
    balance = parseFloat(text.split('$')[1].split(' ')[0].replace(/\s/g, ''))

    await page.click('.current-symbol')
    if (lose >= 4) {
        setTimeout(async () => {
            start()
        }, (Math.floor(Math.random() * (10 + 1)) + 20) * 10000)
    } else {
        setTimeout(async () => {
            start()
        }, 30000)
    }
}

let start = async () => {
    const input = await page.$('.js-deposit-amount');
    await input.click({ clickCount: 3 })
    await input.type(money);
    time = Math.floor(Math.random() * (10 + 1)) + 10;

    setTimeout(() => play(), 7000)
};

let play = async () => {

    if (direction == true) {
        await page.click('.btn-success');
        direction = false
    } else {
        await page.click('.btn-danger');
        direction = true
    }

    setTimeout(async () => {
        const element = await page.$(".balance_current");
        const text = await page.evaluate(element => element.textContent, element);
        let result = parseFloat(text.split('$')[1].split(' ')[0].replace(/\s/g, ''))

        if (result > balance) {
            money = '1';
            console.log(`WON   ---   Proxima apuesta: ${money}  ---   Balance: ${balance} ----  Result: ${result}`)
            balance = result
            lose = 0;
            start()
        } else {
            let new_money = parseFloat(money) * 2.5;
            money = parseInt(new_money).toString();
            console.log(`LOSE  ---   Proxima apuesta: ${money}  ---   Balance: ${balance} ----  Result: ${result}`)
            balance = result
            start()
        }
    }, time * 10000)
}