import { isNumber } from 'lodash';

export const tick = () => {
  const ticked = Date.now();
  return {
    tock: () => Date.now() - ticked,
  };
};

export const isBetween = (val, { maxVal, minVal }) => val >= minVal && val <= maxVal;
export const isNumberBetween = (val, minMaxVal) => isNumber(val) && isBetween(val, minMaxVal);
export const isNumeric = (s) => /^\d+$/.test(s);

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
    this.message = message;
  }
}

export const promiseTimeout = (promise, timeout, cb) => {
  const timeoutPromise = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      if (cb) {
        cb();
      }
      reject(new TimeoutError(timeout));
    }, timeout);
    promise.then(() => clearTimeout(id));
  });
  return Promise.race([promise, timeoutPromise]);
};
