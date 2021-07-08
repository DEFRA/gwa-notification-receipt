module.exports = async function (context) {
  try {
    const { msgReceipt } = context.bindings

    msgReceipt.notifyId = msgReceipt.id
    // See README for more info on `reference`.
    const [messageId, id] = msgReceipt.reference.split(':')
    msgReceipt.id = id
    msgReceipt.messageId = messageId
    msgReceipt.status = `Notify: ${msgReceipt.status}`

    context.bindings.receipt = JSON.stringify(msgReceipt)
  } catch (e) {
    context.log.error(e)
    // Throwing an error ensures the built-in retry will kick in
    throw new Error(e)
  }
}
