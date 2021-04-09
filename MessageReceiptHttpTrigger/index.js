module.exports = async function (context) {
  context.log('Message Receipt HTTP Trigger function activated.')

  try {
    const authHeader = context.req.headers.authorization

    if (authHeader === process.env.NOTIFY_BEARER_HEADER) {
      const { body } = context.req
      context.bindings.messagesToSend = body
      context.res = {
        status: 202
      }
    } else if (!authHeader) {
      // No token
      context.res = {
        body: { error: 'AuthMissing', message: 'Missing authorization header.' },
        headers: {
          'Content-Type': 'application/json'
        },
        status: 401
      }
    } else {
      // Incorrect token
      context.res = {
        body: { error: 'AuthError', message: 'Authorization header is not acceptable.' },
        headers: {
          'Content-Type': 'application/json'
        },
        status: 403
      }
    }
  } catch (e) {
    context.log.error(e)
    // Throwing an error ensures the built-in retry will kick in
    throw new Error(e)
  }
}
