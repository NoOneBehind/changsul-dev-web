/* eslint-disable no-await-in-loop */

import RegexParser from '@serialport/parser-regex';
import { isNumber, isString } from 'lodash';

import SerialPort from '../lib/serialport';
import { tick } from '../lib/util';

const BANK = {
  EPC: 1,
  RESERVED: 0,
  TID: 2,
  USER: 3,
};
const COMMAND = {
  INVENTORY: 'f',
  MEMORY_WRITE: 'w',
  SET: 'x',
  STOP: '3',
};
const CONTROL_TYPE = {
  BAUDRATE: '1',
  POWER_GAIN: 'p',
  SESSION: 's',
};
const EPC_ADDRESS = 2;
const EPC_INDEX = 6;
const HEADER = '>';
const MAX_TAG_ID_LENGTH = 32;
const REPLY_TYPE = {
  ACK: 'A',
  C: 'C',
  T: 'T',
};

const ackValidator = (response, command) => {
  if (response !== `${HEADER}${REPLY_TYPE.ACK}${command}`) {
    throw new Error('Invalid ACK');
  }

  return true;
};
const toHexString = (str) => str.split('')
  .map((char) => char.charCodeAt(0).toString(16))
  .join('');
const toString = (hexString) => hexString.match(/\w{2}/g)
  ?.filter((str) => str !== '00')
  .map((str) => String.fromCharCode(parseInt(str, 16)))
  .join('');

class Rfid extends SerialPort {
  constructor(connection) {
    super({
      commandEnter: '\r',
      connection,
      openOptions: { baudRate: 115200 },
    });

    this.regex = /\r\n/;
    this.timeout = 500;
  }

  async open() {
    await super.open();
    this.setParser(new RegexParser({ regex: this.regex }));
    console.log('Init');
    console.log('Stopping all running command...');
    // eslint-disable-next-line no-empty
    while (await this.stop()) {}
  }

  async readTest() {
    const response = await this.write(`${HEADER}${COMMAND.INVENTORY}`, false);
    if (ackValidator(response, COMMAND.INVENTORY)) {
      console.log('Listening...');

      let state = [];
      for (;;) {
        const s = tick();
        let next = [];
        while (s.tock() < 300) {
          const data = await this.read();
          next.push(toString(data.slice(EPC_INDEX)));
        }
        next = [...new Set(next)];
        const nextState = state.filter((value) => next.includes(value));
        next.forEach((value) => {
          if (!nextState.includes(value)) {
            nextState.push(value);
          }
        });
        state = nextState;
        console.log({ state });
      }
    }
  }

  async readTag({ listen = false } = {}, callback) {
    const response = await this.write(`${HEADER}${COMMAND.INVENTORY}`, false);
    if (ackValidator(response, COMMAND.INVENTORY)) {
      console.log('Listening...');

      let data = await this.read();
      let prev = null;
      let current = toString(data.slice(EPC_INDEX));
      if (!listen) {
        await this.stop();
        return current;
      }
      for (;;) {
        data = await this.read();
        current = toString(data.slice(EPC_INDEX));
        if (prev !== current) {
          callback(current);
        }
        prev = current;
      }
    }
    return response;
  }

  setControl(controlType, value) {
    const command = `${HEADER}${COMMAND.SET} ${controlType}`;
    return this.write(value ? `${command} ${value}` : command);
  }

  async setPowerGain(value) {
    if (!isNumber(value)) {
      throw new Error('Invalid input. Input must be a number');
    }
    if (value < 50 || value > 300) {
      throw new Error('Invalid input. Power gain must be 50 ~ 300');
    }

    const response = await this.setControl(CONTROL_TYPE.POWER_GAIN, value);
    return +response.split(' ').pop() === value;
  }

  async stop() {
    return this.write(COMMAND.STOP, false, this.timeout).catch(() => false);
  }

  async writeTag(id) {
    if (!isString(id)) {
      throw new Error('Invalid Input. TagId must be a string');
    }
    if (id.length % 2 !== 0) {
      throw new Error('Invalid Input. The length of TagId must be a even');
    }
    if (id.length > MAX_TAG_ID_LENGTH) {
      throw new Error(`Invalid Input. Max length of TagId is ${MAX_TAG_ID_LENGTH}`);
    }
    const hexString = id.length < MAX_TAG_ID_LENGTH
      ? `${toHexString(id)}${'00'.repeat(MAX_TAG_ID_LENGTH - id.length)}`
      : toHexString(id);
    const command = `${HEADER}${COMMAND.MEMORY_WRITE} ${BANK.EPC} ${EPC_ADDRESS} ${hexString}`;
    const response = await this.write(command);
    if (ackValidator(response, COMMAND.MEMORY_WRITE)) {
      console.log('Writing...');
      const resultCode = (await this.read()).slice(-1);
      await this.stop();
      switch (resultCode) {
        case '0':
          throw new Error('Other error');
        case '3':
          throw new Error('Memory overrun');
        case '4':
          throw new Error('Memory Locked');
        default:
          console.log('Success');
          return true;
      }
    }

    return response;
  }
}

export default (connection) => new Rfid(connection);
