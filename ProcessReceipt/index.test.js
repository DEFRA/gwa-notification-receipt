const processReceipt = require('.')
const { bindings: functionBindings } = require('./function')

const context = require('../test/defaultContext')
const testEnvVars = require('../test/testEnvVars')

const inputBindingName = 'msgReceipt'
const outputBindingName = 'receipt'

describe('ProcessReceipt function', () => {
  beforeEach(() => { jest.clearAllMocks() })

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
    const bindings = functionBindings.filter((binding) => binding.direction === 'in')
    expect(bindings).toHaveLength(1)

    const binding = bindings[0]
    expect(binding.name).toEqual(inputBindingName)
    expect(binding.type).toEqual('queueTrigger')
    expect(binding.queueName).toEqual(`%${testEnvVars.NOTIFICATION_RECEIPT_QUEUE}%`)
    expect(binding.connection).toEqual('AzureWebJobsStorage')
  })

  test('output binding is correct', () => {
    const bindings = functionBindings.filter((binding) => binding.direction === 'out')
    expect(bindings).toHaveLength(1)

    const binding = bindings[0]
    expect(binding.name).toEqual(outputBindingName)
    expect(binding.type).toEqual('cosmosDB')
    expect(binding.databaseName).toEqual('gwa')
    expect(binding.collectionName).toEqual(`%${testEnvVars.COSMOS_DB_RECEIPTS_CONTAINER}%`)
    expect(binding.connectionStringSetting).toEqual(`${testEnvVars.COSMOS_DB_CONNECTION_STRING}`)
  })
})
