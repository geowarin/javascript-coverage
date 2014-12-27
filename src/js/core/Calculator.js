Calculator = function () {
    window.result = 0;

    Calculator.prototype.add = function(number) {
        window.result += number;
    };

    Calculator.prototype.substract = function(number) {
        window.result -= number;
    };
};
