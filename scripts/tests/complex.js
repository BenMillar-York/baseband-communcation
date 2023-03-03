let complex_test_vectors = {};

complex_test_vectors.multiply =  [
    // [a, b, a*b]
    new TestVector(new Complex(1, 1), new Complex(1, 1), new Complex(0, 2)),
    new TestVector(new Complex(-5, 2), new Complex(3, -4), new Complex(-7, 26)),
    new TestVector(new Complex(-0.4, 2), new Complex(1, -0.9), new Complex(1.4, 2.36)),
    new TestVector(new Complex(2.5, -2), new Complex(1, -0.5), new Complex(1.5, -3.25)),
    new TestVector(new Complex(-3490950, -54545), new Complex(3535, -3535), new Complex(-12533324825, 12147691675))
]

complex_test_vectors.divide =  [
    // [a, b, a/b]
    new TestVector(new Complex(1, 1), new Complex(1, 1), new Complex(1, 0)),
    new TestVector(new Complex(-5, 2), new Complex(8, -4), new Complex(-0.8, -0.4666666666666667)),
    new TestVector(new Complex(-0.5, 2), new Complex(1, -2), new Complex(4.5, 5)),
    new TestVector(new Complex(2.5, -2), new Complex(1, -0.5), new Complex(7, 4.5)),
    new TestVector(new Complex(-3490950, -54545), new Complex(3535, -3535), new Complex(-972.3839841539332, -972.3839841539332))
]

new UnitTest(Complex, 'multiply', complex_test_vectors.multiply);
new UnitTest(Complex, 'divide', complex_test_vectors.divide);