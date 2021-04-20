module.exports = async function (context) {
  try {
    const { msgReceipt } = context.bindings

    // 'reference' is the id sent in the send request, use it for doc id
    msgReceipt.notify_id = msgReceipt.id
    msgReceipt.id = msgReceipt.reference
    delete msgReceipt.reference

    context.bindings.receipt = JSON.stringify(msgReceipt)
  } catch (e) {
    context.log.error(e)
    // Throwing an error ensures the built-in retry will kick in
    throw new Error(e)
  }
}
