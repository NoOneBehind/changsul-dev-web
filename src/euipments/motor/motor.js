/* eslint-disable no-await-in-loop */

import { Gpio } from 'onoff';
import NanoTimer from 'nanotimer';

const HIGH = 1;
const INTERVAL = '600u';
const LOW = 0;
const OUT = 'out';

class Motor {
  constructor({ dirPinNum, stepPinNum }) {
    this.dir = dirPinNum && new Gpio(dirPinNum, OUT);
    this.step = stepPinNum && new Gpio(stepPinNum, OUT);
  }

  rotate(pulse) {
    this.dir.writeSync(pulse > 0 ? HIGH : LOW);

    const timer = new NanoTimer();
    let state = true;
    let count = 0;

    // eslint-disable-next-line consistent-return
    return new Promise((resolver) => timer.setInterval(() => {
      if (count === Math.abs(pulse)) {
        resolver();
        return timer.clearInterval();
      }

      if (state) {
        this.step.writeSync(HIGH);
      } else {
        this.step.writeSync(LOW);
        count += 1;
      }
      state = !state;
    }, '', INTERVAL));
  }
}

export default (option) => new Motor(option);
