module.exports = async function (context) {
  context.log('Message Receipt HTTP Trigger function activated.')

  const { body } = context.req
  context.bindings.messagesToSend = body

  context.done()
}
