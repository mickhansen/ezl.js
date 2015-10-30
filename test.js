import { CA } from './src/index';

(async function () {
  // Generates a new CA
  let ca = await CA.generate();

  //console.log(ca.key);
  //console.log(ca.crt);

  let device = await ca.generateDevice('api.snaplytics.io');

  console.log(device.key);
  console.log(device.crt);
})().catch(function (err) {
  console.error(err.toString());
});
