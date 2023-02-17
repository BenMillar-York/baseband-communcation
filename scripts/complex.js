
/**
 * Complex Number Class
 */
class Complex {
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }

    get argument () {
        return Math.atan(this.imag, this.real);
    }

    get magnitude () {
        return Math.sqrt(this.real**2 + this.imag**2);
    }

    toString() {
        return `${this.real} + ${this.imag}`
    }

    /**
     * Multiplies a complex number with either another Complex number, a number or a boolean
     * @param {(Complex|number|boolean)} n
     * @returns {Complex} 
     */
    multiply(n) {
        if (!(n instanceof Complex && !(n instanceof Number) && !(n instanceof Boolean))) { throw new Error('Parameter is not a number.') }
        // n(a + bj) = (na+ncj)
        // Supports boolean by JS treating True as 1 and False as 0
        if (typeof(n) == 'number' || typeof(n) == 'boolean') {
            let realComponent = n * this.real;
            let imagComponent = n * this.imag;
            return new Complex(realComponent, imagComponent);
        }
        // (a + bj)(c + dj) = ((ac - bd) + (ad+bc)j)
        let realComponent = this.real * n.real - this.imag * n.imag;
        let imagComponent = this.real * n.imag + this.imag * n.real;
        return new Complex(realComponent, imagComponent)
    }

    /**
     * Multiplies a complex number with either another Complex number or a number
     * @param {(Complex|number)} n
     * @returns {Complex} 
     */
    divide(n) {

        if (!(n instanceof Complex) && (typeof n != 'number')) { throw new Error('Parameter is not a number.') }
        // (a + bi)/n = (a/n +b/n j)
        if (typeof(n) == 'number') {
            if (n == 0) { throw new Error('Cannot divide by zero.')}
            let realComponent = this.real / n;
            let imagComponent = this.imag / n;
            return new Complex(realComponent, imagComponent);
        }
        // (a + bi)/(c + di) = (((ac + bd)/(c^2 + d^2)) + ((bc - ad)/(c^2 + d^2))j)
        let r1 = this.real * n.real;
        let r2 = this.imag * n.imag;
        let i1 = this.real * n.imag;
        let i2 = this.imag * n.imag;
        let realComponent = (r1 + r2) / (n.real ** 2 + n.imag);
        let imagComponent = (i2 - i1) / (n.real ** 2 + n.imag);

        return new Complex(realComponent, imagComponent);
    }

}



function addComplex(Complex1, Complex2) {
    let real = Complex1.real + Complex2.real;
    let imag = Complex1.imag + Complex2.imag;

    return new Complex(real, imag);
}