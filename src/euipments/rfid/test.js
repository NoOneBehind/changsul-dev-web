/* eslint-disable no-await-in-loop */

import { sleep } from '../lib/util';
import Rfid from './rfid';

const run = async () => {
  const rfid = new Rfid({ path: '/dev/tty.usbserial-A600MFOW' });
  await rfid.open();

  await rfid.setPowerGain(300);
  // console.log(await rfid.readTag({ listen: true }, console.log));
  console.log(await rfid.writeTag('do'));
  await rfid.setPowerGain(50);
  await rfid.readTest();

  await sleep(100);
  await rfid.close();
};

run().catch(console.log);
