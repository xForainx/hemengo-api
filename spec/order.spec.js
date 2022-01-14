const axios = require("axios")

describe("Order", function () {
    const endpoint = "http://localhost:3000/order"

    describe("GET order without previous login", function () {
        it("returns Unauthorized as a response", function () {
            axios.get(endpoint).then(res => {
                // do something or only use catch ?
            }).catch(err => {
                expect(err.response.status).toBe(401)
            })
        })
    })
})