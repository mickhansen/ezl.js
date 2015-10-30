import { exec } from 'mz/child_process';
import tmp from 'tmp';
import Promise from 'bluebird';
import fs from 'mz/fs';

const tmpFile = Promise.promisify(tmp.file, {context: tmp});

export default class Device {
  constructor(ca, crt, key) {
    this.crt = crt;
    this.key = key;
  }

  static async generate(ca, cn) {
    let key, csr, crt, caTmp;

    [key, ] = await exec(`openssl genrsa 2048`);
    [csr, ] = await exec(`
      openssl req -new \
      -key <(echo "$KEY") \
      -subj "/C=US/ST=Utah/L=Provo/O=ACME Tech Inc/CN=${cn}"
    `, {
      env: {
        PATH: process.env.PATH,
        KEY: key
      },
      shell: '/bin/bash'
    });

    // OpenSSL attempts to seek the cert file, not possible with process substitution
    caTmp = await tmpFile();
    await fs.writeFile(caTmp, ca.crt);

    [crt, ] = await exec(`
      openssl x509 -req \
      -in <(echo "$CSR") \
      -CA ${caTmp} \
      -CAkey <(echo "$CA_KEY") \
      -CAcreateserial \
      -days 500
    `, {
      env: {
        PATH: process.env.PATH,
        CSR: csr,
        KEY: key,
        CA_CERT: ca.crt,
        CA_KEY: ca.key
      },
      shell: '/bin/bash'
    });

    return new Device(ca, crt, key);
  }
}
