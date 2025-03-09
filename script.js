'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2021-12-16T23:36:17.929Z',
    '2021-12-19T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  const hour = `${date.getHours()}`.padStart(2, 0);
  const minute = `${date.getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
  return `${day}/${month}/${year}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDate = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDates: acc.movementsDates.at(i),
  }));
  if (sort) combinedMovsDate.sort((a, b) => a.movement - b.movement);

  combinedMovsDate.forEach(function (obj, i) {
    const { movement, movementDates } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movementDates);

    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${movement}₹</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acu, mov) => acu + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}₹`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}₹`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}₹`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}₹`;
};
// calcDisplaySummary(account1.movements);
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);
let currentAccount, timer;

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login in to get Started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner}`;
    containerApp.style.opacity = 1;

    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  // console.log(amount, recieverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance > amount &&
    recieverAcc.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = `Log in to get started`;
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
// Functions

// const formatMovementDate = function (date, locale) {
//   const calcDaysPassed = (date1, date2) =>
//     Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

//   const daysPassed = calcDaysPassed(new Date(), date);
//   console.log(daysPassed);

//   if (daysPassed === 0) return 'Today';
//   if (daysPassed === 1) return 'Yesterday';
//   if (daysPassed <= 7) return `${daysPassed} days ago`;

//   // const day = `${date.getDate()}`.padStart(2, 0);
//   // const month = `${date.getMonth() + 1}`.padStart(2, 0);
//   // const year = date.getFullYear();

//   // return `${day}/${month}/${year}`;
//   return new Intl.DateTimeFormat(locale).format(date)

// };

// const fomatcur = function(value, locale, currency) {

//   return  new Intl.NumberFormat(locale, {
//     style: 'currency',
//     currency: currency
//   }).format(value)
// }

// const displayMovements = function (acc, sort = false) {
//   containerMovements.innerHTML = '';

//   const movs = sort
//     ? acc.movements.slice().sort((a, b) => a - b)
//     : acc.movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const date = new Date(acc.movementsDates[i]);
//     const displayDate = formatMovementDate(date, acc.locale);

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__date">${displayDate}</div>
//         <div class="movements__value">${fomatcur(
//           mov,
//           acc.locale,
//           acc.currency
//         )}</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// const calcDisplayBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = fomatcur(acc.balance, acc.locale, acc.currency);
// };

// const calcDisplaySummary = function (acc) {
//   const incomes = acc.movements
//     .filter(mov => mov > 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumIn.textContent = fomatcur(incomes, acc.locale, acc.currency);

//   const out = acc.movements
//     .filter(mov => mov < 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumOut.textContent = fomatcur(Math.abs(out), acc.locale, acc.currency);

//   const interest = acc.movements
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * acc.interestRate) / 100)
//     .filter((int, i, arr) => {
//       // console.log(arr);
//       return int >= 1;
//     })
//     .reduce((acc, int) => acc + int, 0);
//   labelSumInterest.textContent = fomatcur(interest, acc.locale, acc.currency);
// };

// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUsernames(accounts);

// const updateUI = function (acc) {
//   // Display movements
//   displayMovements(acc);

//   // Display balance
//   calcDisplayBalance(acc);

//   // Display summary
//   calcDisplaySummary(acc);
// };

// // const setLogoutTimer = function() {
// //   const tick = function(){
// //     const min = String(Math.trunc(time / 60)).padStart(2, '0');
// //     const sec = String(Math.trunc(time % 60)).padStart(2, '0');
// //     labelTimer.textContent = `${min}:${sec}`
// //     if(time === 0) {
// //       clearInterval(time)
// //       containerApp.style.opacity = 0;
// //       labelWelcome.textContent = `Login to get started`

// //     }
// //     time--

// //   }

// //   let time = 120;
// //   tick()
// //   const timer = setInterval(tick, 1000)
// //   return timer
// // }

// // ///////////////////////////////////////
// // // Event handlers
// // let currentAccount, timer

// // // currentAccount = account1
// // // updateUI(currentAccount)
// // // containerApp.style.opacity = 100;
// // // // labelDate.textContent = new Date()

// btnLogin.addEventListener('click', function (e) {
//   // Prevent form from submitting
//   e.preventDefault();

//   currentAccount = accounts.find(
//     acc => acc.username === inputLoginUsername.value
//   );
//   console.log(currentAccount);

//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     // Display UI and message
//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;
//     containerApp.style.opacity = 100;

//     const now = new Date();
//     const locale = currentAccount.locale;
//     console.log(locale);

//     const opitons = {
//       hour: 'numeric',
//       minute: 'numeric',
//       day: 'numeric',
//       month: 'numeric',
//       year: 'numeric',
//     };
//     labelDate.textContent = Intl.DateTimeFormat(locale, opitons).format(now);

//     // const date =`${now.getDate()}`.padStart(2, 0)
//     // const month =`${now.getMonth() + 1}`.padStart(2, 0)
//     // const year = now.getFullYear()
//     // const hour = now.getHours()
//     // const min = `${now.getMinutes()}`.padStart(2, 0)
//     // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`

//     // Clear input fields
//     inputLoginUsername.value = inputLoginPin.value = '';
//     inputLoginPin.blur();

//     if (timer) clearInterval(timer);
//     timer = setLogoutTimer();
//     // Update UI
//     updateUI(currentAccount);
//     clearInterval(timer);
//     timer = setLogoutTimer();
//   }
// });

// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(Math.floor(inputTransferAmount.value));
//   const receiverAcc = accounts.find(
//     acc => acc.username === inputTransferTo.value
//   );
//   inputTransferAmount.value = inputTransferTo.value = '';

//   if (
//     amount > 0 &&
//     receiverAcc &&
//     currentAccount.balance >= amount &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     // Doing the transfer
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);

//     currentAccount.movementsDates.push(new Date().toISOString());
//     receiverAcc.movementsDates.push(new Date().toISOString());

//     // Update UI
//     updateUI(currentAccount);
//     clearInterval(timer);
//     timer = setLogoutTimer();
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();

//   const amount = Number(inputLoanAmount.value);

//   if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
//     setTimeout(function () {
//       // Add movement
//       currentAccount.movements.push(amount);

//       currentAccount.movementsDates.push(new Date().toISOString());
//       // Update UI
//       updateUI(currentAccount);
//       clearInterval(timer);
//       timer = setLogoutTimer();
//     }, 2500);
//   }
//   inputLoanAmount.value = '';
// });

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();

//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username
//     );
//     console.log(index);
//     // .indexOf(23)

//     // Delete account
//     accounts.splice(index, 1);

//     // Hide UI
//     containerApp.style.opacity = 0;
//   }

//   inputCloseUsername.value = inputClosePin.value = '';
// });

// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displayMovements(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//convert string to number
// console.log(Number('23'));
// console.log(+('23'));

// //parseINt
// console.log(parseInt('34X'));
// console.log(parseInt('em34'));

// //parseFloat
// console.log(parseFloat('2.5em'));

// //isFinite
// console.log(isFinite(23));
// console.log(isFinite(23 / 0));
// console.log(isFinite(23.45));

// //isInteger
// console.log(Number.isInteger(23.4));
// console.log(Number.isInteger(23));

// console.log(Math.sqrt(25));
// console.log(25 **( 1/2));
// console.log(8 **( 1/3));

// console.log(Math.max(2, 34, 44, 69, 1));
// console.log(Math.min(2, 34, 44, 69, 1, .5));

// console.log(Math.trunc(Math.random() * 6) + 1);

// console.log(Math.round(23.4));
// console.log(Math.round(23.8));

// console.log(Math.ceil(24.3));

// console.log(Math.floor(23.4));

// console.log(+(1.23).toFixed(0));
// console.log(+(1.3).toFixed(4));

// const date = new Date()
// console.log(date);
// console.log(new Date('Dec 15 2021' ));

// console.log(new Date(2023, 9, 21, 12, 59));

// console.log(new Date(0));

// console.log(Date.now());

// const future = new Date(2033, 8, 1, 12, 59)
// console.log(future);

// console.log(future.getDate());
// console.log(future.getTime());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getSeconds());
// console.log(future.getFullYear());
// console.log(future.getMonth())

// future.setFullYear(2040)
// console.log(future);

// const calcDisplayDate = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))

// const dayPassed = calcDisplayDate(new Date(2033, 8, 1), new Date(2033, 8, 12))
// console.log(dayPassed);

// const num = 4757467.58
// const opitons = {
//   style: 'currency',
//   currency: 'USD',
// }

// console.log(new Intl.NumberFormat('en-UK', opitons).format(num));
// console.log(new Intl.NumberFormat('de-DE', opitons).format(num));
// console.log(new Intl.NumberFormat('ar-SY', opitons).format(num));
// console.log(new Intl.NumberFormat('en-US', opitons).format(num));

// const ing = ['olives', 'spinach']
// const orderPizza = setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`), 3000, ...ing
// )
// if(ing.includes('spinach')) clearTimeout(orderPizza)

// setInterval(() => {
//   const date = new Date()
//   console.log(date);

// }, 1000);

// console.log(Number.parseFloat('2.3rem'));
// console.log(Number.parseFloat('23rem'));

// console.log(Number.isFinite(23));
// console.log(Number.isFinite(+'23'));
// console.log(Number.isFinite('23'));
// console.log(Number.isFinite(2 / 0));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (cur, i) {
//     if (i % 2 === 0) cur.style.backgroundColor = 'red';
//   });
// });

// const now = new Date();
// console.log(now);
// console.log(new Date('Jan 21 2025 22:13:33'));
// console.log(new Date('24 December, 2025 22:12'));
// console.log(new Date(account1.movementsDates[0]));

// const future = new Date(2050, 10, 19, 22, 18);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());
// future.setFullYear(2040);
// console.log(future);
