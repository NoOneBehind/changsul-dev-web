import { createMotor } from './index';

const run = async () => {
  const motor = createMotor({ dirPinNum: 20, stepPinNum: 21 });

  await motor.rotate(1000);
  await motor.rotate(-1000);
};

// eslint-disable-next-line no-console
run().catch(console.error);
