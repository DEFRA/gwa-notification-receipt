module.exports = async function (context) {
  try {
    const { msgReceipt } = context.bindings
    // context.log('Message Receipt Queue Trigger function activated:\n - QueueItem:', msgReceipt)

    // Reference is our Id, ensure doc is saved as such
    msgReceipt.notify_id = msgReceipt.id
    msgReceipt.id = msgReceipt.reference
    delete msgReceipt.reference

    // Save document
    context.bindings.receipt = JSON.stringify(msgReceipt)
  } catch (e) {
    context.log.error(e)
    // Throwing an error ensures the built-in retry will kick in
    throw new Error(e)
  }
}
