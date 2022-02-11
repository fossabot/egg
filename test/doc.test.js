'use strict';

const path = require('path');
const findlinks = require('findlinks');
const assert = require('assert');
const runscript = require('runscript');
const utils = require('./utils');

describe('test/doc.test.js', () => {
  let app;
  before(async () => {
    const cwd = path.dirname(__dirname);
    const dumi = path.join(cwd, 'node_modules', '.bin', 'dumi');
    const crossEnv = path.join(cwd, 'node_modules', '.bin', 'cross-env');
    await runscript(`${crossEnv} APP_ROOT=docs ${dumi} build`, {
      cwd,
    });
  });
  before(async () => {
    app = utils.cluster({
      baseDir: 'apps/docapp',
    });
    app.coverage(false);
    await app.ready();
  });
  after(() => app.close());

  it('should no broken url', async () => {
    const result = await findlinks({ src: app.url, logger: console });
    if (result.fail !== 0) console.log(result);
    assert(result.fail === 0);
  });
});
