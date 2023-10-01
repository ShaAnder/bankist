"use strict";

// BANKIST APP

// Data

// // https://www.tothenew.com/blog/connect-to-postgresql-using-javascript/

// var connectionString =
//   "postgres://userName:password@serverName/ip:port/nameOfDatabase";
// var pgClient = new pg.Client(connectionString);

// var query = pgClient.query(
//   "SELECT id from Customer where name = 'customername'"
// );

// query.on("row", function (row, result) {
//   result.addRow(row);
// });

// query.on("end", function (result) {
//   if (result.rows[0] === undefined) {
//     return;
//   } else {
//     var id = result.rows[0].id;

//     var query = "delete from CustomerAddress where customer_id = " + id;

//     pgClient.query(query);
//   }

//   pgClient.end();
// });
// DIFFERENT DATA! Contains movement dates, currency and locale

// (Table_left = ID), Email, username; // account // username primary key
// (Table_acc_data = ID),
//   USERNAME,
//   pin,
//   46134613717, // usernames foreign key links to primary
//   (table_trans_data = id),
//   username,
//   movements,
//   movementsDates; // usernames foreign key links to primary
// Table_usr_settings;

// username - foreignkey
// 1 row - 1 movement 1 date

// instead of delete add column with numeric value if enabled set to 1, if disabled 0, if true lock user acc,
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, -500],
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
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, +500],
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

// we have an array of accounts, again in a real app, this would be a loop that loops over every db entry
const accounts = [account1, account2];

// WE have all our DOM elements, these are to select various sections of the webpage for manipulating

// LABELS
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

// CONTAINTERS
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

// BUTTONS
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

// FORMS
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// FUNCTIONS

//we're making a less specific function here one that can be used with any app not just this one
const formatcur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const formatMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return Intl.DateTimeFormat(locale).format(date);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // print remaining time to ui in each call
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 log user out stop timer
    if (time === 0) {
      clearInterval(logoutTimer);
      //Display UI and welcome
      labelWelcome.textContent = `Login To Get Started`;
      containerApp.style.opacity = 0;
    }
    // Decrease by 1s
    time--;
  };

  // set time to 10:00
  let time = 10;

  // call timer every second
  tick();
  const logoutTimer = setInterval(tick, 1000);
  return logoutTimer;
};

// Display lodgements / withdrawals
const displayMovements = function (acc, sort = false) {
  // First we clear the current html in the movments tab
  containerMovements.innerHTML = " ";

  // For our sorting function we're going to conditionally define it here with a terniary, if true sort the movements, if false, do nothing.

  // ALSO if we want to sort the movement we need to slice it into a new array OR it will mutate the original

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // Now loop through each movement, and get the type, if less than 0 must be a withdrawal, if more must be deposit
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    // we're creating a function to edit and change the dates based on how long ago it was, if a deposit was today it will read today, 3 days ago 3 days ago ect
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDates(date, acc.locale);

    const formattedMov = formatcur(mov, acc.locale, acc.currency);

    // now with template literals we create the hmtl that type will be plugged into, (this will create an html entry for every movement)
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>;
    `;
    // Now we insert html, using afterbegin (inserts it after the beginning) into the movement container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// For some of these functions we are passing in the entire account rather than the movements so that it only updates for the current account in question

// Display balance of the current account
const calcDisplayBalance = function (acc) {
  // using reduce we get the sum of our account balance
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // then update the balance label
  labelBalance.textContent = formatcur(acc.balance, acc.locale, acc.currency);
};

// Display the summary of the current account
const calcDisplaySummary = function (acc) {
  // get our incomes (moevemnts)
  const incomes = acc.movements
    // filter all the ones greater than 0 (only those stay)
    .filter((mov) => mov > 0)
    // reduce it into a single number
    .reduce((acc, mov) => acc + mov, 0);
  // this is our income
  labelSumIn.textContent = formatcur(incomes, acc.locale, acc.currency);

  // same with outgoings, filter only those less than 0
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatcur(Math.abs(out), acc.locale, acc.currency);

  // Now for intrest
  const interest = acc.movements
    // filter greater than 0
    .filter((mov) => mov > 0)
    // multiply them by interest rate / 100
    .map((deposit) => (deposit * acc.interestRate) / 100)
    // BANK HAS A RULE OF INTEREST ON THINGS ONLY OVER 1 EURO FILTER EVERYTHING BELOW
    .filter((int) => int >= 1)
    // Reduce to single number
    .reduce((acc, int) => acc + int, 0);
  // update interest
  labelSumInterest.textContent = formatcur(interest, acc.locale, acc.currency);
};

// Compute usernames
const createUserNames = function (accs) {
  // Loop over the accounts array to get the names
  accs.forEach(function (acc) {
    // create a username property and set it to acc owner
    acc.username = acc.owner
      .toLowerCase() // set to lowercase, conflict handling
      .split(" ") // split the string
      .map((name) => name[0]) // get first letter
      .join(""); // join the string

    // that's it, we don't return anything we just create a property on run (for a potential future app we would need to call this on account creation and it would need to be more than 2 letters)
  });
};

// Now we run the function
createUserNames(accounts);

// Finally UI update, for when anything happens
const updateUI = function (acc) {
  // Movements / balance and summary
  displayMovements(acc);
  calcDisplaySummary(acc);
  calcDisplayBalance(acc);
};

// EVENT HANDLERS

// set our current account
let currentAccount, logoutTimer;
console.log(currentAccount);

// right now this is static, and won't change we would need a timer which we will do later

// login
btnLogin.addEventListener("click", function (e) {
  // Prevent page from reloading
  e.preventDefault();

  // get the account owner
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Current Date And Time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    if (logoutTimer) clearInterval(logoutTimer);
    logoutTimer = startLogOutTimer();

    updateUI(currentAccount);

    // If account does not exist or pin incorrect
  } else if (currentAccount?.owner === undefined) {
    alert("Account does not exist");
  } else if (currentAccount?.pin != Number(inputLoginPin.value)) {
    alert(`Incorrect pin`);
  }
});

// Transfers
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  // get the transfer amount
  const amount = Number(inputTransferAmount.value);
  // set payee
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  // conditional check
  if (
    amount > 0 && // if greater than 0
    receiverAcc && // if payee exists
    currentAccount.balance >= amount && // balance > amount
    receiverAcc?.username !== currentAccount.username // payee is not the account owner
  ) {
    // Do the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // Reset our timer
    clearInterval(logoutTimer);
    logoutTimer = startLogOutTimer();

    // current account -> add row -> movements + movement date -> negative transaction
    // reviever account -> add row -> movements + movement date -> positive transaction
  }
});

// request a loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  // we get our amount from the loan field, we want to round down so there's no decimals on loan requests
  const amount = Math.floor(inputLoanAmount.value);
  // now check if the amount is greater than 0 AND there is a deposit greater than or equal to 10% of our request in the account.
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add Date
      currentAccount.movementsDates.push(new Date().toISOString());

      //update ui
      updateUI(currentAccount);
    }, 3000);
  }

  // clear field

  inputLoanAmount.value = " ";

  // current account -> add row -> movements + movement date -> positive transaction
  // if accounts + 500 -> delete row
});

// Delete an account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // first we do a check to see if the username and pin are the same
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // get the index using the new find index method
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // delete the account
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;
  }
  // clear the fields
  inputCloseUsername.value = inputClosePin.value = " ";
});

// Sorting event handler
let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;

  // current account -> credentials correct -> delete row (add flag) -> primary key (no updates) -> if primary key deleted delete foreign
});
