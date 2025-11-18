let alarmTime = null;
let alarmActive = false;

const currentTimeDisplay = document.getElementById("currentTime");
const alarmTimeDisplay = document.getElementById("alarmTime");
const alarmInput = document.getElementById("alarmInput");
const setAlarmBtn = document.getElementById("setAlarmBtn");
const clearAlarmBtn = document.getElementById("clearAlarmBtn");
const statusBox = document.getElementById("status");
const alarmSound = document.getElementById("alarmSound");


// notification permission on load
document.addEventListener("DOMContentLoaded", () => {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
});

// format numbers
function format(num) {
    return num < 10 ? "0" + num : num;
}

// browser notification
function showNotification(message) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification("Alarm Clock", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/992/992700.png"
        });
    }
}

// update real time
setInterval(() => {
    const now = new Date();
    const hours = format(now.getHours());
    const mins = format(now.getMinutes());
    const secs = format(now.getSeconds());
    const current = `${hours}:${mins}:${secs}`;

    currentTimeDisplay.textContent = current;

    // alarm check
    if (alarmActive && alarmTime === `${hours}:${mins}` && secs === "00") {
        statusBox.textContent = "ALARM RINGING!";
        statusBox.className = "status running";
        statusBox.style.display = "block";

        alarmSound.play();

        // end notification
        showNotification("Your alarm is going off!");

        // only notify
        alarmActive = false;
    }

}, 1000);

// set alarm
setAlarmBtn.addEventListener("click", () => {
    if (!alarmInput.value) {
        alert("Please choose a time for your alarm.");
        return;
    }

    alarmTime = alarmInput.value;
    alarmActive = true;

    alarmTimeDisplay.textContent = alarmTime;

    statusBox.textContent = "Alarm set for " + alarmTime;
    statusBox.className = "status running";
    statusBox.style.display = "block";

    showNotification("Alarm set for " + alarmTime);
});

// clear alarm
clearAlarmBtn.addEventListener("click", () => {
    alarmTime = null;
    alarmActive = false;
    alarmTimeDisplay.textContent = "--:--";
    alarmSound.pause();
    alarmSound.currentTime = 0;

    statusBox.textContent = "Alarm cleared.";
    statusBox.className = "status stopped";
    statusBox.style.display = "block";

    showNotification("Alarm has been cleared.");
});

// export default TimerModule;
