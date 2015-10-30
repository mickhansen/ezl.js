import { exec } from 'mz/child_process';
import Device from './device';

export default class CA {
  constructor(crt, key) {
    this.crt = crt;
    this.key = key;
  }

  async generateDevice(cn) {
    return await Device.generate(this, cn);
  }

  static async generate() {
    let key, crt;

    [key, ] = await exec(`openssl genrsa 2048`);
    [crt, ] = await exec(`
      openssl req -x509 -new -nodes \
      -key <(echo "$KEY") \
      -days 1024 \
      -subj "/C=US/ST=Utah/L=Provo/O=ACME Signing Authority Inc/CN=example.com"
    `, {
      env: {
        PATH: process.env.PATH,
        KEY: key
      },
      shell: '/bin/bash'
    });

    return new CA(crt, key);
  }
}
