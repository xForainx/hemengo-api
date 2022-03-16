const util = require('../app/helpers/util')

describe("Util", function () {
    describe("isToday() utilitary function", function () {
        it("returns true for today's date", function () {
            expect(util.isToday(Date.now())).toBeTrue()
        })
    })

    describe("isInTheFuture() utilitary function", function () {
        it("returns true if date is later than today", function () {
            expect(util.isInTheFuture(Date.now() + 24 * 3600 * 1000)).toBeTrue()
        })
    })
})