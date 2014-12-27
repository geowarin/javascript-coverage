Calculator = function () {
    window.result = 0;

    Calculator.prototype.add = function(number) {
        window.result += number;
    }
};
