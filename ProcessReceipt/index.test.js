const processReceipt = require('./index')
const functionDef = require('./function')

const context = require('../test/defaultContext')
const testEnvVars = require('../test/testEnvVars')

const inputBindingName = 'msgReceipt'
const outputBindingName = 'receipt'

describe('ProcessReceipt function', () => {
  afterEach(() => { jest.clearAllMocks() })

  test('receipt to be bound with correct properties', async () => {
    const id = 'id'
    const reference = 'reference'
    context.bindings = { msgReceipt: { id, reference } }

    await processReceipt(context)

    expect(context.bindings).toHaveProperty(outputBindingName)
    const receipt = JSON.parse(context.bindings[outputBindingName])
    expect(receipt).toMatchObject({ id: reference, notify_id: id })
    expect(receipt).not.toMatchObject({ reference: expect.anything() })
  })

  test('an error is thrown (and logged) when an error occurs', async () => {
    context.bindings = null

    await expect(processReceipt(context)).rejects.toThrow(Error)

    expect(context.log.error).toHaveBeenCalledTimes(1)
  })
})

describe('ProcessReceipt bindings', () => {
  test('input binding is correct', () => {
    const outputBindings = functionDef.bindings.filter((binding) => binding.direction === 'in')
    expect(outputBindings).toHaveLength(1)

    const outputBinding = outputBindings[0]
    expect(outputBinding.name).toEqual(inputBindingName)
    expect(outputBinding.type).toEqual('queueTrigger')
    expect(outputBinding.queueName).toEqual(`%${testEnvVars.NOTIFICATION_RECEIPT_QUEUE}%`)
  })

  test('output binding is correct', () => {
    const outputBindings = functionDef.bindings.filter((binding) => binding.direction === 'out')
    expect(outputBindings).toHaveLength(1)

    const outputBinding = outputBindings[0]
    expect(outputBinding.name).toEqual(outputBindingName)
    expect(outputBinding.type).toEqual('cosmosDB')
    expect(outputBinding.databaseName).toEqual('gwa')
    expect(outputBinding.collectionName).toEqual(`%${testEnvVars.COSMOS_DB_RECEIPTS_CONTAINER}%`)
  })
})
