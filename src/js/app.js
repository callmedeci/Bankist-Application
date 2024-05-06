'use strict';



// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 20, 45, 10],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
        "2024-03-31T09:58:46.777Z",
        "2024-03-30T09:58:46.777Z",
        "2024-03-26T09:58:46.777Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];


// -------> Variable declaration <-------

const container = document.getElementById('Container');
const balanceContainer = document.getElementById('balance-Container');

const inputUser = document.getElementById('input-user');
const inputPin = document.getElementById('input-pin');
const inputTaransferTo = document.getElementById('input-transfer-value');
const inputTransferAmount = document.getElementById('input-transfer-amount-value');
const inputLoanAmount = document.getElementById('input-loan-amount-value');
const inputUserClose = document.getElementById('input-user-close');
const inputPinClose = document.getElementById('input-pin-close');

const btnSubmit = document.getElementById('btn-submit');
const btnTransferTo = document.getElementById('btn-transfer-to');
const btnLoanAmount = document.getElementById('btn-loan-amount');
const btnClose = document.getElementById('btn-close');
const btnSort = document.getElementById('btn-sort');

const labeldate = document.getElementById('date');
const labelIn = document.getElementById('label-in');
const labelOut = document.getElementById('label-out');
const labelInterset = document.getElementById('label-interset');
const labelWelcome = document.getElementById('label-welcome');
const labelBalance = document.getElementById('label-balance');
let labelTimer = document.getElementById('label-timer');

// -------> Function Section <-------

const createUserName = function (accs) {
    accs.forEach((acc) => {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
};
createUserName(accounts);

const show = function (element) {
    element.classList.remove('invisible');
    element.classList.remove('opacity-0');
    element.classList.remove('select-none');
    element.classList.add('visible');
    element.classList.add('opacity-100');
};

const hide = function (element) {
    element.classList.add('invisible');
    element.classList.add('opacity-0');
    element.classList.add('select-none');
    element.classList.remove('visible');
    element.classList.remove('opacity-100');
};

const formatDate = function (date, locale) {
    const calcPassedDay = (d1, d2) => Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcPassedDay(new Date(), date);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    return Intl.DateTimeFormat(locale).format(date);
};

const formatNumber = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value).replace(/\u00A0/g, '');
}

const movements = function (acc, sort = false) {

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    balanceContainer.innerHTML = '';
    movs.forEach(
        (mov, i) => {
            const type = mov > 0 ? 'deposit' : 'withdrawal';
            const date = new Date(acc.movementsDates[i]);
            const displayDate = formatDate(date, acc.locale);
            const formatMov = formatNumber(mov, acc.locale, acc.currency);

            const html = `
            <div class="flex w-full p-8 items-center justify-between">
                <div class="flex items-center gap-4 w-max">
                    <div class="${type}">
                        ${i + 1} ${type}
                    </div>
                        <div class="text-black text-sm font-thin">
                            ${displayDate}
                        </div>
                    </div>
                <div class="text-xl text-stone-700">${formatMov}</div>
            </div > `;
            balanceContainer.insertAdjacentHTML('afterbegin', html);
        });
};

const calculateDisplayCurrecntBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    const option = {
        style: 'currency',
        currency: acc.currency,
    }
    const formateBalance = Intl.NumberFormat('en-US', option).format(acc.balance)
    labelBalance.innerHTML = formateBalance;
};

const displaySummary = function (acc) {
    const income = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelIn.innerHTML = formatNumber(income, acc.locale, acc.currency);

    const outcome = Math.abs(acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0));
    labelOut.innerHTML = formatNumber(outcome, acc.locale, acc.currency);

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => deposit * acc.interestRate / 100)
        .filter(deposit => deposit >= 1)
        .reduce((acc, int) => acc + int, 0);
    labelInterset.innerHTML = formatNumber(interest, acc.locale, acc.currency);
};

const logoutTimerHandler = function () {
    let time = 5 * 60;

    const tick = function () {
        let min = String(Math.trunc(time / 60)).padStart(2, 0);
        let sec = String(Math.trunc(time % 60)).padStart(2, 0);

        labelTimer.innerText = `${min}:${sec}`;
        if (time === 0) {
            clearInterval(timer);
            hide(container);
        };
        time--;
    }

    tick();
    const timer = setInterval(tick, 1000);
    return timer;
};

const updateUI = function (acc) {
    //Display movements
    movements(acc, isSort);

    //Display summary 
    displaySummary(acc);

    //Display balance
    calculateDisplayCurrecntBalance(acc);
};


// -------> EventListeners <------- 
let currectAccount, timer;
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    currectAccount = accounts.find(acc => acc.username === inputUser.value.trim());

    if (currectAccount?.pin === +inputPin.value) {

        //Display UI to the USER 
        show(container);
        labelWelcome.innerText = `Welcome back ${currectAccount.owner.split(' ')[0]} `;

        //Update UI 
        updateUI(currectAccount);

        //Handle Log Out Timer
        if (timer) clearInterval(timer);
        timer = logoutTimerHandler();


        //Remove DATA from the form
        inputPin.value = inputUser.value = '';
        inputPin.blur();
        inputUser.blur();

        //Show Date 
        const now = new Date(2024, 3, 3, 15, 14);
        const options = {
            hour: 'numeric',
            minute: '2-digit',
            day: '2-digit',
            month: 'numeric',
            year: 'numeric',
            // weekday: 'long',
        }
        labeldate.innerText = Intl.DateTimeFormat(currectAccount.locale, options).format(now);
    };
});

btnTransferTo.addEventListener('click', (e) => {
    e.preventDefault();

    const amount = +inputTransferAmount.value;
    const transferAccount = accounts.find(acc => acc.username === inputTaransferTo.value);

    //Validating the account and the amount itself
    if (amount > 0 && currectAccount.balance >= amount && currectAccount.username !== transferAccount?.username && transferAccount) {

        //Transfering The amount
        transferAccount.movements.push(amount);
        currectAccount.movements.push(-amount);

        //Upate movementsDate 
        currectAccount.movementsDates.push(new Date().toISOString());
        transferAccount.movementsDates.push(new Date().toISOString());

        //updateUI 
        updateUI(currectAccount);
    } else {
        alert('Username is incorrect OR you don\'t have enough money')
    };

    //Remove DATA from the form
    inputTransferAmount.value = inputTaransferTo.value = '';
    inputTaransferTo.blur();
    inputTransferAmount.blur();
    btnTransferTo.blur();

    //Reseting the Timer
    clearInterval(timer);
    timer = logoutTimerHandler();
});

btnLoanAmount.addEventListener('click', (e) => {

    e.preventDefault();
    const loanAmount = Math.floor(+inputLoanAmount.value);

    //Remove DATA from the form
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    btnLoanAmount.blur();

    //Validating the loan Amount
    if (loanAmount > 0 && currectAccount.movements.some(mov => mov >= loanAmount / 10)) {
        setTimeout(() => {
            //Transfering The amount
            currectAccount.movements.push(loanAmount);

            //Upate movementsDate 
            currectAccount.movementsDates.push(new Date().toISOString());

            //Update UI
            updateUI(currectAccount);
        }, 2.5 * 1000)
    };

    //Reseting the Timer
    clearInterval(timer);
    timer = logoutTimerHandler();
});

btnClose.addEventListener('click', (e) => {
    e.preventDefault();

    if (currectAccount.username === inputUserClose.value && currectAccount.pin === +inputPinClose.value) {

        //Finding the index of account 
        const index = accounts.findIndex(acc => acc.username === currectAccount.username);

        //Remove Account from the DATA
        accounts.splice(index, index + 1);

        //Hide UI
        hide(container);
        console.log(accounts)
    };

    // Remove DATA from the form
    inputPinClose.value = inputUserClose.value = '';
    inputPinClose.blur();
    inputPinClose.blur();
});

let isSort = false;
btnSort.addEventListener('click', (e) => {
    e.preventDefault();

    //Checking for sorting
    movements(currectAccount, !isSort);
    isSort = !isSort;
});