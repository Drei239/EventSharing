function inputTimeValidation(timeEndSignup, timeBegin, timeEnd) {
    if (Date.parse(timeEndSignup) < Date.parse(timeBegin) &&
        Date.parse(timeEndSignup) < Date.parse(timeEnd) &&
        Date.parse(timeBegin) < Date.parse(timeEnd)) {
        return true;
    } else {
        return false;
    }
}

module.exports = { inputTimeValidation };