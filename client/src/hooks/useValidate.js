import { useMemo } from 'react';

export const useValidateRegex = (value, regex, message) => {
  return useMemo(() => {
    if (!value)
      return {
        text: '',
        color: '',
        isValid: false,
      };
    const isValid = value.match(regex);
    return {
      text: isValid ? '' : message,
      color: isValid ? '' : 'error',
      isValid,
    };
  }, [value]);
};

export const useValidateAuthPassword = (password, authPassword, message) => {
  return useMemo(() => {
    if (!authPassword)
      return {
        text: '',
        color: '',
        isValid: false,
      };
    const isValid = password === authPassword;
    return {
      text: isValid ? '' : message,
      color: isValid ? '' : 'error',
      isValid,
    };
  }, [authPassword]);
};

// export const useValidateLength = (value, length, message) => {
//   return useMemo(() => {
//     if (!value) return { text: '', color: '', isValid: false };
//     return {
//       text: value.length <= length ? '' : message,
//       color: value.length <= length ? '' : true,
//       isValid: true,
//     };
//   }, [value]);
// };

export const useValidateDatetime = (date1, time1, date2, time2, message) => {
  return useMemo(() => {
    if (!(date1 && date2 && time1 && time2))
      return { text: '', color: '', isValid: false };

    let booleans = false;
    if (date1 > date2) {
      booleans = true;
    } else {
      if (date1 === date2) {
        booleans = true;
      }
      if (time1 && time2) {
        if (time1 > time2) {
          booleans = true;
        } else {
          booleans = false;
        }
      }
    }

    return {
      text: booleans ? '' : message,
      color: booleans ? '' : 'error',
      isValid: true,
    };
  }, [date1, date2, time1, time2]);
};
