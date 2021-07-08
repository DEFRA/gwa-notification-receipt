const processReceipt = require('.')
const { bindings: functionBindings } = require('./function')

const context = require('../test/defaultContext')
const testEnvVars = require('../test/testEnvVars')

const inputBindingName = 'msgReceipt'
const outputBindingName = 'receipt'

describe('ProcessReceipt function', () => {
  beforeEach(() => { jest.clearAllMocks() })

  test('receipt to be bound with correct properties', async () => {
    const notifyId = '57c767c8-db85-4c08-af26-048c6efb1bf6'
    const messageId = '4e91a2ee-a674-47c7-a8dd-04dee676c935'
    const receiptId = 'f0f68cdd-2af1-4d2f-88ae-f0bbf2cbad25'
    const reference = `${messageId}:${receiptId}`
    const status = 'delivered'
    context.bindings = { msgReceipt: { id: notifyId, reference, status } }

    await processReceipt(context)

    expect(context.bindings).toHaveProperty(outputBindingName)
    const receipt = JSON.parse(context.bindings[outputBindingName])
    expect(receipt).toMatchObject({ id: receiptId, notifyId, messageId, reference, status: `Notify: ${status}` })
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
