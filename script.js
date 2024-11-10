// Select DOM Elements
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const amPmElement = document.getElementById('amPm');
const toggleFormatButton = document.getElementById('toggleFormat');
const timezoneSelect = document.getElementById('timezoneSelect');
const digitalClock = document.getElementById('digitalClock');
const toggleThemeButton = document.getElementById('toggleTheme');

// Initialize State
let is24Hour = false;
let selectedTimezone = 'local';
let isDarkMode = false;

/**
 * Pads a number with a leading zero if it's less than 10.
 * @param {number} num - The number to pad.
 * @returns {string} - The padded number as a string.
 */
function padNumber(num) {
    return num.toString().padStart(2, '0');
}

/**
 * Updates the time displayed on both digital clocks.
 */
function updateTime() {
    const now = new Date();

    // Get time in selected timezone
    let options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: !is24Hour,
        timeZone: selectedTimezone === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone : selectedTimezone
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const parts = formatter.formatToParts(now);
    let hour, minute, second, amPm = '';

    parts.forEach(part => {
        if (part.type === 'hour') hour = parseInt(part.value);
        if (part.type === 'minute') minute = parseInt(part.value);
        if (part.type === 'second') second = parseInt(part.value);
        if (part.type === 'dayPeriod') amPm = part.value;
    });

    // Handle 24-hour format
    let displayHour = hour;
    if (!is24Hour) {
        amPm = amPm || (hour >= 12 ? 'PM' : 'AM');
        displayHour = hour % 12 || 12; // Convert to 12-hour format
    } else {
        amPm = '';
    }

    // Pad numbers with leading zeros
    const paddedHours = padNumber(displayHour);
    const paddedMinutes = padNumber(minute);
    const paddedSeconds = padNumber(second);

    // Update AM/PM display
    amPmElement.textContent = amPm;

    // Update Digital Clock
    updateDigitalClock(paddedHours, paddedMinutes, paddedSeconds);
}

/**
 * Updates the digital clock display with animation.
 * @param {string} paddedHours 
 * @param {string} paddedMinutes 
 * @param {string} paddedSeconds 
 */
function updateDigitalClock(paddedHours, paddedMinutes, paddedSeconds) {
    // Update Hours
    if (hoursElement.textContent !== paddedHours) {
        hoursElement.textContent = paddedHours;
        hoursElement.classList.add('updated');
        setTimeout(() => hoursElement.classList.remove('updated'), 500);
    }

    // Update Minutes
    if (minutesElement.textContent !== paddedMinutes) {
        minutesElement.textContent = paddedMinutes;
        minutesElement.classList.add('updated');
        setTimeout(() => minutesElement.classList.remove('updated'), 500);
    }

    // Update Seconds
    if (secondsElement.textContent !== paddedSeconds) {
        secondsElement.textContent = paddedSeconds;
        secondsElement.classList.add('updated');
        setTimeout(() => secondsElement.classList.remove('updated'), 500);
    }
}

/**
 * Toggles between 12-hour and 24-hour formats.
 */
function toggleFormat() {
    is24Hour = !is24Hour;
    toggleFormatButton.textContent = is24Hour ? 'Switch to 12-Hour' : 'Switch to 24-Hour';
    updateTime();
}

/**
 * Changes the selected timezone based on user input.
 */
function changeTimezone() {
    selectedTimezone = timezoneSelect.value;
    updateTime();
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

/**
 * Initializes event listeners and starts the clock.
 */
function init() {
    // Event Listeners
    toggleFormatButton.addEventListener('click', toggleFormat);
    timezoneSelect.addEventListener('change', changeTimezone);
    toggleThemeButton.addEventListener('click', toggleTheme);

    // Initialize Clock
    updateTime();
    setInterval(updateTime, 1000);
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);