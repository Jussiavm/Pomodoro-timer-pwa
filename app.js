if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/Pomodoro-timer-pwa/sw.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    });
  }

const startBtn = document.querySelector('#start-button');
const resetBtn = document.querySelector('#reset-button');
const startPauseBtn = document.querySelector('#start-pause-button');
const minuteDiv = document.querySelector('.minutes');
const secondDiv = document.querySelector('.seconds');
const pause = document.querySelector('#pause-subtitle');
const focus = document.querySelector('#focus-subtitle');

let myIntervalFocus;
let myIntervalPause;
let stateFocus = 1;
let statePause = 1;

const appTimerFocus =  () => {
    startPauseBtn.classList.remove('active');
    startBtn.classList.add('active');

    if (stateFocus === 1) {
        const sessionAmount = 25;
        stateFocus = 0;
        let totalSeconds = sessionAmount * 60;
        focus.style.display = 'flex';
        
        const updateSecondsFocus = () => {

            totalSeconds--;

            let minutesLeft = Math.floor(totalSeconds / 60);
            let secondsLeft = totalSeconds % 60;
            if (minutesLeft < 10) {
                minuteDiv.textContent = `0${minutesLeft}`;
            } else {
                minuteDiv.textContent = minutesLeft;
            }
            if (secondsLeft < 10) {
                secondDiv.textContent = `0${secondsLeft}`;
            } else {
                secondDiv.textContent = secondsLeft;
            }

            if (minutesLeft === 0 && secondsLeft === 0) {
                clearInterval(myIntervalFocus);
                focus.style.display = 'none';
                startBtn.classList.remove('active');
                statePause = 1;
                appTimerPause();
            }
        }
        myIntervalFocus = setInterval(updateSecondsFocus, 1000);
    } else {
        alert('Focus already running!');
    }
}

const appTimerPause = () => {

    if (statePause === 1) {
        startBtn.classList.remove('active');
        const sessionAmount = 5;
        minuteDiv.textContent = '05';
        secondDiv.textContent = '00';
        statePause = 0;
        let totalSeconds = sessionAmount * 60;
        pause.style.display = 'flex';
        startPauseBtn.classList.add('active');

        const updateSecondsPause = () => {

            totalSeconds--;

            let minutesLeft = Math.floor(totalSeconds / 60);
            let secondsLeft = totalSeconds % 60;
            if (minutesLeft < 10) {
                minuteDiv.textContent = `0${minutesLeft}`;
            } else {
                minuteDiv.textContent = minutesLeft;
            }
            if (secondsLeft < 10) {
                secondDiv.textContent = `0${secondsLeft}`;
            } else {
                secondDiv.textContent = secondsLeft;
            }

            if (minutesLeft === 0 && secondsLeft === 0) {
                clearInterval(myIntervalPause);
                pause.style.display = 'none';
                startPauseBtn.classList.remove('active');
                stateFocus = 1;
                appTimerFocus();
            }
        }
        
        myIntervalPause = setInterval(updateSecondsPause, 1000);
    } else {
        alert('Pause already running!');
    }
}

startBtn.addEventListener('click', () => {
    if (stateFocus != 0) {
        clearInterval(myIntervalFocus);
        clearInterval(myIntervalPause);
        statePause = 1;
        focus.style.display = 'none';
        pause.style.display = 'none';
        appTimerFocus();
    } else {appTimerFocus()}
});
resetBtn.addEventListener('click', () => {
    clearInterval(myIntervalFocus);
    clearInterval(myIntervalPause);
    stateFocus = 1;
    statePause = 1;
    minuteDiv.textContent = '25';
    secondDiv.textContent = '00';
    focus.style.display = 'none';
    pause.style.display = 'none';
    startBtn.classList.remove('active');
    startPauseBtn.classList.remove('active')
});

startPauseBtn.addEventListener('click', () => {
    if (statePause != 0) {
        clearInterval(myIntervalFocus);
        clearInterval(myIntervalPause);
        stateFocus = 1;
        focus.style.display = 'none';
        appTimerPause();
    } else {appTimerPause()}
    
});
