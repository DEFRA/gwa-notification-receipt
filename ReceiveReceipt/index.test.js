const receiveReceipt = require('./index')

const context = require('../test/defaultContext')
const testEnvVars = require('../test/testEnvVars')

describe('ReceiveReceipt function', () => {
  afterEach(() => { jest.clearAllMocks() })

  test('request with correct bearer token sends message and returns 202', async () => {
    const body = { id: 'fake' }
    context.req = { body, headers: { authorization: testEnvVars.NOTIFY_BEARER_HEADER } }

    await receiveReceipt(context)

    expect(context).toHaveProperty('res')
    expect(context.res).toMatchObject({ status: 202 })
    expect(context.bindings).toHaveProperty('messagesToSend')
    expect(context.bindings.messagesToSend).toMatchObject(body)
  })

  test('request with no auth header does not send message and returns 401', async () => {
    context.req = { headers: { } }

    await receiveReceipt(context)

    expect(context).toHaveProperty('res')
    expect(context.res).toMatchObject({
      body: { error: 'AuthMissing', message: 'Missing authorization header.' },
      headers: { 'Content-Type': 'application/json' },
      status: 401
    })
  })

  test('request with incorrect bearer token does not send message and returns 403', async () => {
    context.req = { headers: { authorization: 'incorrect' } }

    await receiveReceipt(context)

    expect(context).toHaveProperty('res')
    expect(context.res).toMatchObject({
      body: { error: 'AuthError', message: 'Authorization header is not acceptable.' },
      headers: { 'Content-Type': 'application/json' },
      status: 403
    })
  })

  test('an error is thrown (and logged) when an error occurs', async () => {
    context.req = null

    await expect(receiveReceipt(context)).rejects.toThrow(Error)

    expect(context.log.error).toHaveBeenCalledTimes(1)
  })
})
