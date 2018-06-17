calculatorModel = {
    historyList : [],
    maxListBount : 255,
    historyDisplay : '',
    periviosOpr:null,
    memroy: null,
    result: null, // Holds the actual result in memory
    operation: "",
    currentNumber: null,
    currentDisplay: "", // Shows the input until the result is shown

    reset: function() {

        this.result = 0;
        this.historyList = [];
        this.operation = "";
        this.currentNumber = "";
        this.currentDisplay = "" ;
        this.historyDisplay = "" ;
    },
    memoryReset:function () {

    },
    memoryCall:function () {
    },
    setOperation: function(operationToSet) {
        /*
         * 1- Add Current Number To Top Of List
         * 2- Check Operation
         *
         */
        this.addToStack(this.getCurrentNumber());
        this.currentDisplay = "" ;
        if(this.IsExecutionOpr(operationToSet)){
            switch(operationToSet){
                case '=':
                    this.calculate();
                    this.displayResult();
                    // Calcculat An Display
                    break;
                case 'm+':
                case 'm-':
                case 'm':
                case 'md':
                    // Memory Operatoin Call
                    break
            }
        }
        else{
            if(this.IsBinaryOpr(operationToSet)){
                this.addToStack(operationToSet);
            }
            if(this.IsUnaryOpr(operationToSet)){
                // this.addToStack(operationToSet);
            }
        }

        this.currentNumber = null ;
        this.displayValue();

    },
    addToStack:function (value) {
        if(this.isOperation(value)){
            if(this.historyList.length >0 && this.isOperation(this.historyList[this.historyList.length - 1])){
                this.historyList.pop();
            }
            if(this.historyList.length > 0)
                this.historyList.push(value);
            console.log(this.historyList);
        }else{
            if(!(value === null))
                this.historyList.push(value);
        }
    },
    displayValue:function () {
        var str ='';
        for(var i = 0; i< this.historyList.length; i++){
            if(this.isOperation(this.historyList[i])){
                str += ' '+this.historyList[i]+' ';
            }else{
                str += ''+this.historyList[i];
            }
        }
        this.historyDisplay = str;
    },
    displayResult:function () {
        this.currentDisplay = this.result;
    },
    getCurrentNumber:function () {
      if(this.currentNumber === null) return null;
      return parseFloat(this.currentNumber);
    },
    checkListValidation:function () {
        var lastOpInd = -1;
        for(var i=0;i<this.historyList.length;i++){
            if(this.isOperation(this.historyList[i])){
                if(i = lastOpInd +1) return false;
                lastOpInd = i;
            }
        }
        return true;
    },
    isOperation :function (val) {
        var opr =['+','-','*','/','%','sin','cos','tan','cot','m','m+','m-','md','='];
        for(var i=0;i<opr.length;i++){
            if(opr[i] === val){
                return true;
            }
        }
        return false;
    },
    /**
     * @return {boolean}
     */
    IsBinaryOpr:function (opr) {
        return opr === '/' || opr === '*' || opr === '+' || opr === '-' || opr === '%';


    },
    /**
     * @return {boolean}
     */
    IsUnaryOpr:function (opr) {
        return opr === 'sin' || opr === 'cos' || opr === 'tan' || opr === 'cot';


    },
    /**
     * @return {boolean}
     */
    IsExecutionOpr:function (opr) {
        return  (opr === '=' || opr === 'm+' || opr === 'm-' || opr === 'md');

    },
    calculate: function() {
        if(this.historyList.length >0 && this.isOperation(this.historyList[this.historyList.length - 1])){
            this.historyList.pop();
        }
        var result = 0;
        var previose = null;
        var current = null;
        var opr = null;
        for(var i = 0; i< this.historyList.length; i++){
            if(this.isOperation(this.historyList[i])){
                opr = this.historyList[i];
            }else{
                if(current === null){
                    current = this.historyList[i];
                }else{
                    previose = current;
                    current = this.historyList[i];

                    result = this.calculateBinary(current, opr, previose);
                    current = result;
                }
            }
        }
        this.result = result;
        console.log(result);
    },
    calculateBinary: function(current, opr, previose) {
        current = parseFloat(current);
        previose = parseFloat(previose);
        switch(opr){
            case '+':
                return previose + current;
                break;
            case '-':
                return previose - current;
                break;
            case '*':
                return previose * current;
                break;
            case '/':
                // TODO: Bivided By Zero Exception Handleing
                return previose / current;
                break;
            case '%':
                // TODO: Bivided By Zero Exception Handleing
                return previose % current;
                break;
        }
    }

};

var calculatorApp = angular.module('calculatorApp', ['calculatorModule']);
var calculatorModule = angular.module('calculatorModule', []);
calculatorModule.controller('calculatorController', ['$scope', function ($scope) {
    $scope.calculator = calculatorModel;


    $scope.numberButtonClicked = function(clickedNumber) {
        if(calculatorModel.currentNumber === null && calculatorModel.result === null) {
            calculatorModel.currentNumber = '0';
            calculatorModel.currentDisplay = "";
        }

        calculatorModel.currentNumber += clickedNumber;
        calculatorModel.currentDisplay += clickedNumber;
    };

    $scope.operationButtonClicked = function(clickedOperation) {
        calculatorModel.setOperation(clickedOperation);
    };

    $scope.enterClicked = function() {
        if(!(calculatorModel.result === null))
        {
            calculatorModel.calculate();
            calculatorModel.History += calculatorModel.currentNumber;
            calculatorModel.currentDisplay = calculatorModel.result;
            calculatorModel.periviosOpr = "=";
        }
        else{
        }

    };
    $scope.memoryCall = function() {

    };
    $scope.memoryReset = function() {

    };

    $scope.resetClicked = function() {
        calculatorModel.reset();
    };
}]);