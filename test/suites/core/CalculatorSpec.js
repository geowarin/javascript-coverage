
describe('Calculator', function(){
    describe('Initialization', function(){
        it('result should be initialized at 0', function(){
            new Calculator();
            assert.equal(window.result, 0);
        })
    });
    describe('Add', function(){
        it('should be possible to add a positive integer', function(){
            var calculator = new Calculator();
            calculator.add(42);
            assert.equal(window.result, 42);
        })
    })
});
