function inputTimeValidation(timeEndSignup, timeBegin, timeEnd) {
  if (
    timeEnd > timeBegin &&
    timeEnd > timeEndSignup &&
    timeBegin < timeEndSignup
  ) {
    return true;
  } else {
    return false;
  }
}

function inputTitleValidation(existEvent, requestId) {
  if ((existEvent && existEvent._id == requestId) || existEvent === null) {
    return true;
  } else {
    return false;
  }
}

module.exports = { inputTimeValidation, inputTitleValidation };
