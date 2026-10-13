const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function load(relativePath, mocks) {
  const filename = path.resolve(__dirname, relativePath);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, experimentalDecorators: true },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded.require = name => {
    if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`);
    return mocks[name];
  };
  loaded._compile(compiled, filename);
  return loaded.exports;
}

test('gateway passes a URL list to all RabbitMQ clients', () => {
  const options = [];
  const { ClientProxySuperFlights } = load('../src/common/proxy/client-proxy.ts', {
    '@nestjs/common': { Injectable: () => value => value },
    '@nestjs/microservices/client': { ClientProxyFactory: { create: value => options.push(value) } },
    '@nestjs/microservices/enums': { Transport: { RMQ: 'RMQ' } },
    '../constants': { RabbitMQ: { UserQueue: 'users', PassengerQueue: 'passengers', FlightsQueue: 'flights' } },
  });
  const client = new ClientProxySuperFlights({ get: () => 'amqp://localhost:5672' });
  client.clientProxyUsers();
  client.clientProxyPassengers();
  client.clientProxyFlights();
  assert.equal(options.length, 3);
  for (const value of options) assert.deepEqual(value.options.urls, ['amqp://localhost:5672']);
});

test('passenger bootstrap passes a URL list to the RabbitMQ server', () => {
  const original = process.env.AMQP_URL;
  process.env.AMQP_URL = 'amqp://localhost:5672';
  let options;
  try {
    load('../../microservice-passengers/src/main.ts', {
      '@nestjs/core': { NestFactory: { createMicroservice: (_module, value) => {
        options = value;
        return Promise.resolve({ listen: async () => {} });
      } } },
      './app.module': { AppModule: class {} },
      './common/constants': { RabbitMQ: { PassengerQueue: 'passengers' } },
      '@nestjs/microservices': { Transport: { RMQ: 'RMQ' } },
    });
    assert.deepEqual(options.options.urls, ['amqp://localhost:5672']);
  } finally {
    if (original === undefined) delete process.env.AMQP_URL;
    else process.env.AMQP_URL = original;
  }
});
