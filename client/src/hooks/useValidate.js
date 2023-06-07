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
