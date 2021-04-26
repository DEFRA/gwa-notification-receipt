const receiveReceipt = require('./index')
const { bindings: functionBindings } = require('./function')

const context = require('../test/defaultContext')
const testEnvVars = require('../test/testEnvVars')

const requestBindingName = 'req'
const responseBindingName = 'res'
const queueBindingName = 'messagesToSend'

describe('ReceiveReceipt function', () => {
  afterEach(() => { jest.clearAllMocks() })

  test('request with correct bearer token sends message and returns 202', async () => {
    const body = { id: 'fake' }
    context[requestBindingName] = { body, headers: { authorization: testEnvVars.NOTIFY_BEARER_HEADER } }

    await receiveReceipt(context)

    expect(context).toHaveProperty(requestBindingName)
    expect(context[responseBindingName]).toMatchObject({ status: 202 })
    expect(context.bindings).toHaveProperty(queueBindingName)
    expect(context.bindings[queueBindingName]).toMatchObject(body)
  })

  test('request with no auth header does not send message and returns 401', async () => {
    context[requestBindingName] = { headers: { } }

    await receiveReceipt(context)

    expect(context).toHaveProperty(requestBindingName)
    expect(context[responseBindingName]).toMatchObject({
      body: { error: 'AuthMissing', message: 'Missing authorization header.' },
      headers: { 'Content-Type': 'application/json' },
      status: 401
    })
  })

  test('request with incorrect bearer token does not send message and returns 403', async () => {
    context[requestBindingName] = { headers: { authorization: 'incorrect' } }

    await receiveReceipt(context)

    expect(context).toHaveProperty(requestBindingName)
    expect(context[responseBindingName]).toMatchObject({
      body: { error: 'AuthError', message: 'Authorization header is not acceptable.' },
      headers: { 'Content-Type': 'application/json' },
      status: 403
    })
  })

  test('an error is thrown (and logged) when an error occurs', async () => {
    context[requestBindingName] = null

    await expect(receiveReceipt(context)).rejects.toThrow(Error)

    expect(context.log.error).toHaveBeenCalledTimes(1)
  })
})

describe('ReceiveReceipt bindings', () => {
  test('input binding is correct', () => {
    const bindings = functionBindings.filter((binding) => binding.direction === 'in')
    expect(bindings).toHaveLength(1)

    const binding = bindings[0]
    expect(binding.name).toEqual(requestBindingName)
    expect(binding.type).toEqual('httpTrigger')
    expect(binding.authLevel).toEqual('function')
    expect(binding.methods).toHaveLength(1)
    expect(binding.methods[0]).toEqual('post')
  })

  const outputBindings = functionBindings.filter(binding => binding.direction === 'out')

  test('two output bindings exist', () => {
    expect(outputBindings).toHaveLength(2)
  })

  test('http response output binding is correct', () => {
    const bindings = outputBindings.filter(binding => binding.name === responseBindingName)
    expect(bindings).toHaveLength(1)

    const binding = bindings[0]
    expect(binding.type).toEqual('http')
  })

  test('message queue output binding is correct', () => {
    const bindings = outputBindings.filter(binding => binding.name === queueBindingName)
    expect(bindings).toHaveLength(1)

    const binding = bindings[0]
    expect(binding.type).toEqual('queue')
    expect(binding.queueName).toEqual(`%${testEnvVars.NOTIFICATION_RECEIPT_QUEUE}%`)
  })
})
