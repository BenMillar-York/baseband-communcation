class UnitTest {
    /**
     * 
     * @param {Function} UUT 
     * @param {TestVector[]} test_vectors
     */
    constructor(UUT, method_to_test = null, test_vectors) {
        this.UUT = UUT;

        this.method_to_test = null;
        if (method_to_test != null) {
            if (!UUT.prototype.hasOwnProperty('multiply')) { 
                throw new Error(`${UUT} does not have a method ${method_to_test}`)
            };
            this.method_to_test = UUT.prototype[method_to_test];
        }

        this.test_vectors = test_vectors;

        this.runAllTests();
    }

    /**
     * 
     * @param {TestVector} test_vector 
     * @returns {boolean} true if test passed, result if test failed
     */
    runTest(test_vector) {

        const parameter = test_vector.parameters[0];

        if (this.method_to_test != null) {
            let method_to_test = this.method_to_test;
            let result = method_to_test.call(test_vector.object, parameter).toString()
            if (result != test_vector.expected_output.toString()) {
                return result;
            }
        }
        return true;
    }

    /**
     * Runs all test vectors on the object, raises an error if the tests fail.
     * @function runAllTests
     * @param {TestVector} test_vector 
     * @returns {boolean} True if test passed, False if test failed
     */
    runAllTests() {
        let allTestsPassed = true;
        this.test_vectors.forEach(test => {
            let response = this.runTest(test);
            if (response == true) { return true; }
            let error_message = `[UNIT TEST] Test failed for the method: '${this.method_to_test.name}' in the '${this.UUT.name}' class.\n${test}\n\tActual output: ${response}`
            console.warn(error_message);
            allTestsPassed = false;
        })
        if (allTestsPassed) {
            console.info(`[UNIT TEST] All tests passed for the method: '${this.method_to_test.name}' in the '${this.UUT.name}' class.`)
        }
    }
}

function run_all_unit_tests() {

}