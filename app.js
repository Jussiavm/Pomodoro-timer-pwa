const startBtn = document.querySelector('#start-button');
const stopBtn = document.querySelector('#stop-button');
const resetBtn = document.querySelector('#reset-button');
const startPauseBtn = document.querySelector('#start-pause-button');
const session = document.querySelector('.minutes');

let myInterval;
let state = 1;

const appTimer =  () => {
    const sessionAmount = Number.parseInt(session.textContent);

    if (state === 1) {
        state = 0;
        let totalSeconds = sessionAmount * 60;

        const updateSeconds = () => {
            const minuteDiv = document.querySelector('.minutes');
            const secondDiv = document.querySelector('.seconds');

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
                clearInterval(myInterval);
            }
        }
        myInterval = setInterval(updateSeconds, 1000);
    } else {
        alert('Timer is already running!');
    }
}

startBtn.addEventListener('click', appTimer);