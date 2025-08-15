// Import necessary Firebase modules
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"; // Import getAuth, onAuthStateChanged, and signOut
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"; // Import authentication methods
// Show notification via service worker
function showTimerNotification(message) {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            if (registration.active) {
                registration.active.postMessage({
                    type: 'SHOW_NOTIFICATION',
                    body: message
                });
            }
        });
    }
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
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
const statusValue = document.getElementById('status-bar');
const bells = new Audio('./sounds/bell.wav');

// Get reference to the show sign-up and sign-in buttons
const showSignupButton = document.getElementById('show-signup');
const showLoginButton = document.getElementById('show-login');

// Get reference to the sign-out button and their division
const selectionButtons = document.querySelector('.selection-buttons'); 
const signOutButton = document.getElementById('sign-out-button');
const statusBarBackground = document.getElementById('status-bar-background');

// Get references to auth forms and app content
const authFormsDiv = document.querySelector('.auth-forms');
const appContentDiv = document.querySelector('.app-content'); 
const signupForm = document.getElementById('signup-form');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');

// Get references to sign-in form elements
const signinForm = document.getElementById('login-form');
const signinEmailInput = document.getElementById('login-email');
const signinPasswordInput = document.getElementById('login-password');

// TODO: Replace with your actual Firebase config from index.html
const firebaseConfig = {
    apiKey: "AIzaSyC1psj2pGnyw5vtr8gQfjAiCEQvF-GnVEo",
    authDomain: "pomodoro-app-c71d6.firebaseapp.com",
    projectId: "pomodoro-app-c71d6",
    storageBucket: "pomodoro-app-c71d6.firebasestorage.app",
    messagingSenderId: "441807519166",
    appId: "1:441807519166:web:755374ff7996b7c0434def",
    measurementId: "G-1HWSKHCDX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth object
const auth = getAuth(app);

// Set up an authentication state change listener
onAuthStateChanged(auth, (user) => { // Removed the duplicate declaration of auth
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        // You might want to display user's email or other info here
        // Hide auth forms and show app content
        if (authFormsDiv) authFormsDiv.style.display = 'none';
        if (appContentDiv) appContentDiv.style.display = 'flex'; // Or 'flex', depending on your layout
    } else {
        // User is signed out
        console.log("User is signed out");
        // Hide app content and show auth forms
        if (authFormsDiv) authFormsDiv.style.display = 'flex'; // Or 'flex'
        if (appContentDiv) appContentDiv.style.display = 'none';
    }
});

// Event listener for sign-up form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("Signed up user:", user);
            // Clear form fields
            signupEmailInput.value = '';
            signupPasswordInput.value = '';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Sign up error:", errorCode, errorMessage);
            // Display error message to the user (you'll need a UI element for this)
        });
});

// Event listener for sign-in form submission
signinForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    const email = signinEmailInput.value;
    const password = signinPasswordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("Signed in user:", user);
            // Clear form fields
            signinEmailInput.value = '';
            signinPasswordInput.value = '';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Sign in error:", errorCode, errorMessage);
            // Display error message to the user (you'll need a UI element for this)
        });
});

// Event listener for sign-out button click
signOutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User signed out successfully.");
    }).catch((error) => {
        // An error happened.
        console.error("Sign out error:", error);
    });
});

statusBarBackground.style.display = 'none'; // Initially hide the background circle

let myIntervalFocus;
let myIntervalPause;
let stateFocus = 1;
let statePause = 1;

let gradientAnimationId = null;
let gradientAngle = 0;

const CIRCUMFERENCE = 565.48; // Circumference of the circle in the SVG

function animateBackgroundGradient() {
  const gradient = document.getElementById('bar3d-bg');
  if (!gradient) return;
  gradientAngle = (gradientAngle - 0.4) % 360;
  const rad = gradientAngle * Math.PI / 180;
  const x1 = 50 - 50 * Math.cos(rad);
  const y1 = 50 - 50 * Math.sin(rad);
  const x2 = 50 + 50 * Math.cos(rad);
  const y2 = 50 + 50 * Math.sin(rad);
  gradient.setAttribute('x1', `${x1}%`);
  gradient.setAttribute('y1', `${y1}%`);
  gradient.setAttribute('x2', `${x2}%`);
  gradient.setAttribute('y2', `${y2}%`);
  gradientAnimationId = requestAnimationFrame(animateBackgroundGradient);
}
function stopBackgroundGradientAnimation() {
  if (gradientAnimationId) {
    cancelAnimationFrame(gradientAnimationId);
    gradientAnimationId = null;
  }
}

function colorBackgroundFocus(){
    const gradient = document.getElementById('bar3d-bg');
    const bgStop1 = document.getElementById('bg-stop1');
    const bgStop2 = document.getElementById('bg-stop2');
    if (gradient) {
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        bgStop1.setAttribute('stop-color', '#c4edb7'); // Light green
        bgStop2.setAttribute('stop-color', '#6bd14b'); // Darker green
    }
}

function colorBackgroundPause() {
    const gradient = document.getElementById('bar3d-bg');
    const bgStop1 = document.getElementById('bg-stop1');
    const bgStop2 = document.getElementById('bg-stop2');
    if (gradient) {
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        bgStop1.setAttribute('stop-color', '#e0ffe0'); // Light blue
        bgStop2.setAttribute('stop-color', '#85cbcc'); // Darker blue
    }
}


const appTimerFocus = () => {
    startPauseBtn.classList.remove('active');
    startBtn.classList.add('active');

    statusValue.setAttribute('stroke-dasharray', CIRCUMFERENCE);
    statusValue.setAttribute('stroke-dashoffset', 0);

    statusBarBackground.style.display = '';
    statusBarBackground.setAttribute('fill', 'url(#bar3d-bg)'); // Set the gradient fill
    colorBackgroundFocus(); // Change background color to focus colors

    if (!gradientAnimationId) animateBackgroundGradient();

    if (stateFocus === 1) {
        const sessionAmount = 25;
        stateFocus = 0;
        const totalSecondsOg = sessionAmount * 60;
        const endTime = Date.now() + totalSecondsOg * 1000;
        focus.style.display = 'flex';

        const updateSecondsFocus = () => {
            const now = Date.now(); // Current time in milliseconds
            let remainingMs = endTime - now; 
            if (remainingMs < 0) remainingMs = 0;
            let totalSeconds = Math.ceil(remainingMs / 1000);
            let progress = totalSeconds / totalSecondsOg;
            let offset = CIRCUMFERENCE * (1 - progress);
            statusValue.setAttribute('stroke-dashoffset', offset);

            let minutesLeft = Math.floor(totalSeconds / 60);
            let secondsLeft = totalSeconds % 60;
            minuteDiv.textContent = minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft;
            secondDiv.textContent = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;

            if (totalSeconds <= 0) {
                bells.play();
                showTimerNotification('Focus session is over!');
                clearInterval(myIntervalFocus);
                focus.style.display = 'none';
                startBtn.classList.remove('active');
                statePause = 1;
                appTimerPause();
                stopBackgroundGradientAnimation();
            }
        };
        updateSecondsFocus(); // Initial update
        myIntervalFocus = setInterval(updateSecondsFocus, 1000);
    } else {
        alert('Focus already running!');
    }
}


const appTimerPause = () => {
    statusValue.setAttribute('stroke-dasharray', CIRCUMFERENCE);
    statusValue.setAttribute('stroke-dashoffset', 0);

    statusBarBackground.style.display = '';
    statusBarBackground.setAttribute('fill', 'url(#bar3d-bg)');
    colorBackgroundPause();

    if (!gradientAnimationId) animateBackgroundGradient();

    if (statePause === 1) {
        startBtn.classList.remove('active');
        const sessionAmount = 5;
        const totalSecondsOg = sessionAmount * 60;
        const endTime = Date.now() + totalSecondsOg * 1000;
        pause.style.display = 'flex';
        startPauseBtn.classList.add('active');

        const updateSecondsPause = () => {
            const now = Date.now();
            let remainingMs = endTime - now;
            if (remainingMs < 0) remainingMs = 0;
            let totalSeconds = Math.ceil(remainingMs / 1000);
            let progress = totalSeconds / totalSecondsOg;
            let offset = CIRCUMFERENCE * (1 - progress);
            statusValue.setAttribute('stroke-dashoffset', offset);

            let minutesLeft = Math.floor(totalSeconds / 60);
            let secondsLeft = totalSeconds % 60;
            minuteDiv.textContent = minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft;
            secondDiv.textContent = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;

            if (totalSeconds <= 0) {
                bells.play();
                showTimerNotification('Break is over!');
                clearInterval(myIntervalPause);
                pause.style.display = 'none';
                startPauseBtn.classList.remove('active');
                stateFocus = 1;
                appTimerFocus();
                stopBackgroundGradientAnimation();
            }
        };
        updateSecondsPause(); // Initial update
        myIntervalPause = setInterval(updateSecondsPause, 1000);
    } else {
        alert('Pause already running!');
    }
}

startBtn.addEventListener('click', () => {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
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
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
    clearInterval(myIntervalFocus);
    clearInterval(myIntervalPause);
    statusValue.setAttribute('stroke-dasharray', CIRCUMFERENCE);
    statusValue.setAttribute('stroke-dashoffset', 0);
    stateFocus = 1;
    statePause = 1;
    minuteDiv.textContent = '25';
    secondDiv.textContent = '00';
    focus.style.display = 'none';
    pause.style.display = 'none';
    startBtn.classList.remove('active');
    startPauseBtn.classList.remove('active')
    stopBackgroundGradientAnimation();
    statusBarBackground.style.display = 'none'; // Hide the background circle
});

startPauseBtn.addEventListener('click', () => {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
    if (statePause != 0) {
        clearInterval(myIntervalFocus);
        clearInterval(myIntervalPause);
        stateFocus = 1;
        focus.style.display = 'none';
        appTimerPause();
    } else {appTimerPause()}
    
});

showLoginButton.addEventListener('click', () => {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
    signupForm.style.display = 'none'; // Show auth forms
    signinForm.style.display = 'flex'; // Hide app content
    selectionButtons.style.display = 'none'; // Hide selection buttons
});

showSignupButton.addEventListener('click', () => {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(50); // Vibrate for 50 milliseconds
    }
    signupForm.style.display = 'flex'; // Show auth forms
    signinForm.style.display = 'none'; // Hide app content
    selectionButtons.style.display = 'none'; // Hide selection buttons
});
