# ezl

Easy SSL CA and cert generation for mitm testing and more.

## Installation

`$ npm install --save ezl`

## Dependencies

- OpenSSL
- Bash shell

## API

### CA

```js
import { CA } from 'ezl';

// Generates a new CA
let ca = await CA.generate();

// Initiate an existing CA
let ca = new CA(crt, key);

console.log(ca.crt); // ca.crt holds a string containing the CA certificate
console.log(ca.key); // ca.crt holds a string containing the CA private key
```

### Device

Generate certificate pairs for "devices" (servers, clients, whatever) signed by your CA.

```js
import { Device } from 'ezl';

// Generate a new device from CA
let device = await Device.generate(ca, cn); // In cases of HTTPs servers CN should be your FQDN
let device = await ca.generateDevice(cn);

console.log(ca.crt); // ca.crt holds a string containing the device certificate
console.log(ca.key); // ca.crt holds a string containing the device private key
```
