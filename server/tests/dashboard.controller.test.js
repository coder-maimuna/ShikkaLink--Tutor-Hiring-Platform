const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('module');
const path = require('node:path');

const controllerPath = path.resolve(__dirname, '../src/controllers/dashboard.controller.js');
const prismaPath = path.resolve(__dirname, '../src/config/prisma.js');

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('verifyTutor returns 404 when target user does not exist', async () => {
  const mockPrisma = {
    user: {
      findUnique: async () => null,
      update: async () => {
        throw new Error('should not update');
      }
    },
    tutorProfile: {
      update: async () => ({})
    }
  };

  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (request === '../config/prisma' || request === prismaPath) {
      return mockPrisma;
    }
    return originalLoad.apply(this, arguments);
  };

  delete require.cache[require.resolve(controllerPath)];
  const controller = require(controllerPath);
  const res = createRes();

  await controller.verifyTutor({ user: { user_id: 1, role: 'admin' }, params: { user_id: '999' } }, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /not found/i);

  Module._load = originalLoad;
  delete require.cache[require.resolve(controllerPath)];
});

test('rejectTutor returns 400 when target user is not a tutor', async () => {
  const mockPrisma = {
    user: {
      findUnique: async () => ({ user_id: 2, role: 'student', is_verified: false }),
      update: async () => ({})
    },
    tutorProfile: {
      update: async () => ({})
    }
  };

  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (request === '../config/prisma' || request === prismaPath) {
      return mockPrisma;
    }
    return originalLoad.apply(this, arguments);
  };

  delete require.cache[require.resolve(controllerPath)];
  const controller = require(controllerPath);
  const res = createRes();

  await controller.rejectTutor({ user: { user_id: 1, role: 'admin' }, params: { user_id: '2' }, body: {} }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /only tutor/i);

  Module._load = originalLoad;
  delete require.cache[require.resolve(controllerPath)];
});
