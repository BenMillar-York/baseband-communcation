class TestVector {
    constructor(object, parameters, expected_output) {
        this.object = object;
        this.parameters = parameters;
        if (typeof(parameters) != 'Array') {
            this.parameters = Array(parameters);
        }
        this.expected_output = expected_output;
    }

    toString() {
        return `\tTest vector:\n\t\tObject: ${this.object.constructor.name}: ${this.object},\n\t\tParameters: ${this.parameters},\n\t\tExpected Output: ${this,this.expected_output}`
    }
}