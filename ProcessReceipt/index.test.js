const processReceipt = require('./index')

const context = require('../test/defaultContext')

describe('ProcessReceipt function', () => {
  afterEach(() => { jest.clearAllMocks() })

  test('receipt to be bound with correct properties', async () => {
    const id = 'id'
    const reference = 'reference'
    context.bindings = { msgReceipt: { id, reference } }

    await processReceipt(context)

    expect(context.bindings).toHaveProperty('receipt')
    const receipt = JSON.parse(context.bindings.receipt)
    expect(receipt).toMatchObject({ id: reference, notify_id: id })
    expect(receipt).not.toMatchObject({ reference: expect.anything() })
  })

  test('an error is thrown (and logged) when an error occurs', async () => {
    context.bindings = null

    await expect(processReceipt(context)).rejects.toThrow(Error)

    expect(context.log.error).toHaveBeenCalledTimes(1)
  })
})
