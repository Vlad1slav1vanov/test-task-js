const selectRoute = document.querySelector('#route');
const selectBackTime = document.querySelector('#back-time');
const selectTime = document.querySelector('#time');
const buttonCount = document.querySelector('#Count');
const num = document.querySelector('#num');
const messageField = document.querySelector('#message');

const FROM_A_TO_B = 700;
const FROM_B_TO_A = 700;
const FROM_A_TO_B_AND_BACK = 1200;
const TRAVEL_TIME = 50;
let ticketPrice = FROM_A_TO_B;
let travelTime = TRAVEL_TIME;

const userTime = new Date().getTimezoneOffset(); // GMT Пользователя
const spbTime = 180;  // GMT Санкт-Петербурга

const timeOptions = selectTime.querySelectorAll('option');
const backTimeOptions = selectBackTime.querySelectorAll('option');

// Функция скрывает выбор из B в А при включенной опции из А в В

const fromAtoB = (params) => {
  timeOptions.forEach(option => {
    if (option.value.indexOf('из B в A') !== -1) {
      option.style.display = 'none';
    } else {
      option.style.display = 'inline';
    }
  });
}

// Функция скрывает выбор из А в В при включенной опции из В в А

const fromBtoA = () => {
  timeOptions.forEach(option => {
    if (option.value.indexOf('из A в B') !== -1) {
      option.style.display = 'none';
    } else {
      option.style.display = 'inline';
    }
  });
}

// Функция показывает еще один селект с обратным путем

const fromAtoBandBack = () => {
  selectBackTime.style.display = 'inline';
  timeOptions.forEach(option => {
    if (option.value.indexOf('из B в A') !== -1) {
      option.style.display = 'none';
    } else {
      option.style.display = 'inline';
    }
  });
}

// Функция сравнивает время в первом и втором селекторе времени

const checkMinutes = (currentTarget) => {
  const currentMinutes = setTimeToMinutes(currentTarget);  
  backTimeOptions.forEach(option => {
    if (setTimeToMinutes(option) <= currentMinutes + 50) {
      option.style.display = 'none';
    } else {
      option.style.display = 'inline';
    }
  })
}

selectRoute.addEventListener('change', (evt) => {
  const route = evt.target.value;

  if (route == 'из A в B и обратно в А') {
    ticketPrice = FROM_A_TO_B_AND_BACK;
    travelTime = TRAVEL_TIME * 2;
    fromAtoBandBack();
    checkMinutes(selectTime);
    selectTime.addEventListener('change', (evt) => {
      const currentTarget = evt.target;
      checkMinutes(currentTarget);
    })

  } else {
    selectBackTime.style.display = 'none'
  }

  if (route == 'из A в B') {
    ticketPrice = FROM_A_TO_B;
    fromAtoB();
  }

  if (route == 'из B в A') {
    ticketPrice = FROM_B_TO_A;
    fromBtoA();
  }
});

// Функция возвращает приведенное в минуты время из опции

const setTimeToMinutes = (option) => {
  const currentTime = (option.value.split('(')[0]);
  const hoursAndMinutes = currentTime.split(':');
  const currentTimeInMinutes = Number(hoursAndMinutes[0]) * 60 + Number(hoursAndMinutes[1]);
  return currentTimeInMinutes;
}


// Функция предоставляет выбор пользователю времени, исходя из его часового пояса

const userTimeAccess = (option) => {
  const timeInMinutes = setTimeToMinutes(option);
  const currentUserTimeInMinutes = timeInMinutes - spbTime - userTime;
  let currentUserTimeInHours = Math.floor(currentUserTimeInMinutes / 60);
  if (currentUserTimeInHours >= 24) {
    currentUserTimeInHours -= 24
  }

  let currentUserTimeReminder = timeInMinutes % 60;


  if (currentUserTimeReminder === 0) {
    currentUserTimeReminder = currentUserTimeReminder.toString();
    currentUserTimeReminder = `${currentUserTimeReminder}0`
  }
  const userTextContentOption = [];
  userTextContentOption.push(`${currentUserTimeInHours}:${currentUserTimeReminder}(${option.textContent.split('(')[1]}`);
  option.textContent = userTextContentOption
}

fromAtoB();

timeOptions.forEach(option => {
  userTimeAccess(option);
});

backTimeOptions.forEach(option => {
  userTimeAccess(option);
});


buttonCount.addEventListener('click', (evt) => {
  evt.preventDefault();
  const ticketsCount = num.value;
  const ticketRoute = selectRoute.value;
  const ticketFullPrice = ticketPrice * ticketsCount;
  const routeTime = travelTime;

  const currentTime = (selectTime.value.split('(')[0]);
  const hoursAndMinutes = currentTime.split(':');
  const currentTimeInMinutes = Number(hoursAndMinutes[0]) * 60 + Number(hoursAndMinutes[1]);
  const currentUserTimeInMinutes = currentTimeInMinutes - spbTime - userTime;
  const finishUserTimeInMinutes = currentUserTimeInMinutes + travelTime;

  let currentUserTimeInHours = Math.floor(currentUserTimeInMinutes / 60);
  let finishUserTimeInHours = Math.floor(finishUserTimeInMinutes / 60); 
  
  if (currentUserTimeInHours >= 24) {
    currentUserTimeInHours -= 24
  }
  let currentUserTimeReminder = currentTimeInMinutes % 60;
  if (currentUserTimeReminder === 0) {
    currentUserTimeReminder = currentUserTimeReminder.toString();
    currentUserTimeReminder = `${currentUserTimeReminder}0`
  }

  //////
  if (finishUserTimeInHours >= 24) {
    finishUserTimeInHours -= 24
  }
  let finishUserTimeReminder = finishUserTimeInMinutes % 60;
  if (finishUserTimeReminder === 0) {
    finishUserTimeReminder = finishUserTimeReminder.toString();
    finishUserTimeReminder = `${finishUserTimeReminder}0`
  }
  //////
  const finishTextContentOption = [];
  finishTextContentOption.push(`${finishUserTimeInHours}:${finishUserTimeReminder}`);
  userFinishText = finishTextContentOption;
  ////
  const userTextContentOption = [];
  userTextContentOption.push(`${currentUserTimeInHours}:${currentUserTimeReminder}`);
  userStartText = userTextContentOption;

  messageField.textContent = `Вы выбрали ${ticketsCount} билета по маршруту ${ticketRoute} стоимостью ${ticketFullPrice}.
  Это путешествие займет у вас ${routeTime} минут. 
  Теплоход отправляется в ${userStartText}, а прибудет в ${userFinishText}.`
})





















