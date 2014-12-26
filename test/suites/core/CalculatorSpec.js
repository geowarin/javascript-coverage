
describe('Calculator', function(){
    describe('Initialization', function(){
        it('result should be initialized at 0', function(){
            var calculator = new Calculator();
            assert.equal(calculator.result, 0);
        })
    })
});
