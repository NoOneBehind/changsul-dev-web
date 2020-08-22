import _SerialPort from 'serialport';

import { promiseTimeout } from './util';

class SerialPort {
  constructor(config) {
    const defaultConfig = {
      commandEnter: '\r\n',
      maxRetry: 5,
      openOptions: { baudRate: 9600 },
    };

    this.config = { ...defaultConfig, ...config };
    this.parser = null;
    this.serialport = null;
  }

  attachEnter(command) {
    return `${command}${this.config.commandEnter}`;
  }

  close() {
    return new Promise((resolve, reject) => (
      this.serialport.close((err) => (err ? reject(err) : resolve()))));
  }

  open() {
    const { connection, openOptions } = this.config;
    return new Promise((resolve, reject) => {
      this.serialport = new _SerialPort(connection.path, { autoOpen: false, ...openOptions });
      this.serialport.open((err) => (err ? reject(err) : resolve()));
    });
  }

  read() {
    return new Promise((resolve) => (this.parser || this.serialport).once('data', resolve));
  }

  setParser(parser) {
    if (this.parser) {
      this.serialport.unpipe(this.parser);
    }
    this.parser = parser;
    this.serialport.pipe(this.parser);
  }

  writeAndDrain(command, skipResponse, timeout) {
    return new Promise((resolve, reject) => {
      this.serialport.write(Buffer.isBuffer(command) ? command : this.attachEnter(command));
      this.serialport.drain((err) => {
        if (err) {
          reject(err);
        } else if (skipResponse) {
          resolve();
        } else if (timeout > 0) {
          promiseTimeout(this.read(), timeout).then(resolve).catch(reject);
        } else {
          this.read().then(resolve).catch(reject);
        }
      });
    });
  }

  write(command, skipResponse = false, timeout = 0) {
    return this.writeAndDrain(command, skipResponse, timeout);
  }

  writeWithRetry(command, timeout = 0, retry = 0) {
    const skipResponse = false;
    return this.writeAndDrain(command, skipResponse, timeout)
      .then((data) => ({ data, retry }))
      .catch(() => {
        if (retry === this.config.maxRetry) {
          throw Error('Reached maximum retry');
        }
        return this.writeWithRetry(command, timeout, retry + 1);
      });
  }

  isOpen() {
    if (!this.serialport) {
      return false;
    }
    return this.serialport.isOpen;
  }
}

export default SerialPort;
