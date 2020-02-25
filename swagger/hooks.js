const hooks = require("hooks")

function decodeBase64(x) {
    return Buffer.from(x, 'base64').toString('ascii')
}

hooks.beforeValidation('/api/users > GET > 200 > application/json; charset=utf-8', transaction => {
    transaction.real.body = decodeBase64(transaction.real.body)
    delete transaction.real.bodyEncoding
})
