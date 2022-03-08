const util = require('../app/helpers/util')

describe("Util", function () {
    describe("isToday() utilitary function", function () {
        it("returns true for today's date", function () {
            expect(util.isToday(Date.now())).toBeTrue()
        })

        it("mock testing -- it returns 42", function () {
            expect(util.isToday(Date.now())).toBeGreaterThanOrEqual(42)
        })
    })
})