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

// Valite thời gian trước sau (dateOrTime: true - date, false - time)
export const useValidateDatetime = (
  datetime_1,
  datetime_2,
  dateOrTime,
  message,
  date_1,
  date_2
) => {
  return useMemo(() => {
    if (!(datetime_1 && datetime_2))
      return { text: '', color: '', isValid: false };

    let isValid = false;
    if (dateOrTime) {
      if (datetime_1 >= datetime_2) isValid = true;
    } else {
      if (date_1 === date_2) {
        if (datetime_1 > datetime_2) isValid = true;
      } else {
        isValid = true;
      }
    }

    return {
      text: isValid ? '' : message,
      color: isValid ? '' : 'error',
      isValid,
    };
  }, [datetime_1, datetime_2, date_1, date_2]);
};
