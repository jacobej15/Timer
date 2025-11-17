// try/catch error handling
const TimerModule = (function() {
    let startTime = null;
    let elapsedTime = 0;
    let timerInterval = null;
    let clickCount = 0;
    let isRunning = false;

    // time to display
    function formatTime(milliseconds) {
        return (milliseconds / 1000).toFixed(1) + 's';
    }

    // log to custom console
    function logToConsole(message, type = 'info') {
        try {
            const consoleOutput = document.getElementById('consoleOutput');
            const timestamp = new Date().toLocaleTimeString();
            const line = document.createElement('div');
            line.className = 'console-line';
            
            if (type === 'time') {
                line.innerHTML = `<span class="console-time">[${timestamp}]</span> ${message}`;
            } else if (type === 'clicks') {
                line.innerHTML = `<span class="console-clicks">[${timestamp}]</span> ${message}`;
            } else {
                line.innerHTML = `[${timestamp}] ${message}`;
            }
            
            consoleOutput.appendChild(line);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            
            //  log to browser console
            console.log(message);
        } catch (error) {
            console.error('Error logging to console:', error);
        }
    }

    // start timer
    function start() {
        try {
            if (isRunning) {
                throw new Error('Timer is already running');
            }
            
            startTime = Date.now() - elapsedTime;
            isRunning = true;
            
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                updateDisplay();
            }, 100);
            
            logToConsole('Timer started', 'time');
            updateStatus('running', 'Timer Running');
        } catch (error) {
            console.error('Start error:', error.message);
            logToConsole(` Error: ${error.message}`);
        }
    }

    // Stop timer
    function stop() {
        try {
            if (!isRunning) {
                throw new Error('Timer is not running');
            }
            
            clearInterval(timerInterval);
            isRunning = false;
            
            const finalTime = formatTime(elapsedTime);
            logToConsole(`Timer stopped at ${finalTime}`, 'time');
            logToConsole(`Total clicks: ${clickCount}`, 'clicks');
            logToConsole(`Average: ${clickCount > 0 ? (elapsedTime / clickCount / 1000).toFixed(2) + 's per click' : 'N/A'}`);
            
            updateStatus('stopped', 'Timer Stopped');
        } catch (error) {
            console.error('Stop error:', error.message);
            logToConsole(`Error: ${error.message}`);
        }
    }

    // reset timer
    function reset() {
        try {
            clearInterval(timerInterval);
            startTime = null;
            elapsedTime = 0;
            clickCount = 0;
            isRunning = false;
            
            updateDisplay();
            logToConsole('🔄 Timer reset', 'info');
            
            const statusElement = document.getElementById('status');
            statusElement.style.display = 'none';
        } catch (error) {
            console.error('Reset error:', error.message);
            logToConsole(`Error: ${error.message}`);
        }
    }

    // increment click counter
    function incrementClick() {
        try {
            if (isRunning) {
                clickCount++;
                document.getElementById('clickDisplay').textContent = clickCount;
                logToConsole(`Click #$${clickCount} at$$ {formatTime(elapsedTime)}`, 'clicks');
            }
        } catch (error) {
            console.error('Click increment error:', error.message);
        }
    }

    // update display
    function updateDisplay() {
        try {
            document.getElementById('timeDisplay').textContent = formatTime(elapsedTime);
        } catch (error) {
            console.error('Display update error:', error.message);
        }
    }

    // update message
    function updateStatus(status, message) {
        try {
            const statusElement = document.getElementById('status');
            statusElement.textContent = message;
            statusElement.className = `status ${status}`;
            statusElement.style.display = 'block';
        } catch (error) {
            console.error('Status update error:', error.message);
        }
    }

    // public API
    return {
        start,
        stop,
        reset,
        incrementClick,
        isRunning: () => isRunning
    };
})();

// event Listeners
document.addEventListener('DOMContentLoaded', () => {
    try {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => {
            TimerModule.start();
            startBtn.disabled = true;
            stopBtn.disabled = false;
        });

        stopBtn.addEventListener('click', () => {
            TimerModule.stop();
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });

        resetBtn.addEventListener('click', () => {
            TimerModule.reset();
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });

        // track clicks anywhere on the page while timer is running
        document.addEventListener('click', (event) => {
            // don't count control button clicks
            if (!event.target.closest('.controls')) {
                TimerModule.incrementClick();
            }
        });

        console.log(' Timer initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

export default TimerModule;
