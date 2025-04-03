
document.addEventListener('DOMContentLoaded', function() {
  // Calculator state
  const state = {
    currentInput: '0',
    previousInput: '',
    operation: null,
    shouldResetInput: false,
    memory: 0,
    angleMode: 'deg', // 'deg' or 'rad'
    history: []
  };
  
  // Mode switching
  const modeButtons = document.querySelectorAll('.mode-btn');
  const calculatorModes = document.querySelectorAll('.calculator-mode');
  
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.getAttribute('data-mode');
      
      // Update active button
      modeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show selected mode
      calculatorModes.forEach(calcMode => {
        calcMode.style.display = calcMode.id === `${mode}-mode` ? 'block' : 'none';
      });
      
      // Initialize converter if selected
      if (mode === 'converter') {
        initializeConverter();
      }
    });
  });
  
  // Standard calculator functionality
  const currentInputDisplay = document.getElementById('current-input');
  const previousOperationDisplay = document.getElementById('previous-operation');
  
  document.querySelectorAll('.keypad .btn').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      const value = button.textContent;
      
      handleCalculatorAction(action, value);
      updateDisplay();
    });
  });
  
  function handleCalculatorAction(action, value) {
    switch(action) {
      case 'number':
        handleNumber(value);
        break;
      case 'decimal':
        handleDecimal();
        break;
      case 'operation':
        handleOperation(value);
        break;
      case 'calculate':
        calculate();
        break;
      case 'clear':
        clear();
        break;
      case 'backspace':
        backspace();
        break;
      case 'percent':
        handlePercent();
        break;
      case 'toggle-sign':
        toggleSign();
        break;
    }
  }
  
  function handleNumber(number) {
    if (state.currentInput === '0' || state.shouldResetInput) {
      state.currentInput = number;
      state.shouldResetInput = false;
    } else {
      state.currentInput += number;
    }
  }
  
  function handleDecimal() {
    if (state.shouldResetInput) {
      state.currentInput = '0.';
      state.shouldResetInput = false;
    } else if (!state.currentInput.includes('.')) {
      state.currentInput += '.';
    }
  }
  
  function handleOperation(operator) {
    const currentValue = parseFloat(state.currentInput);
    
    if (state.operation !== null && !state.shouldResetInput) {
      calculate();
    } else {
      state.previousInput = state.currentInput;
    }
    
    state.operation = operator;
    state.shouldResetInput = true;
  }
  
  function calculate() {
    if (state.operation === null) return;
    
    const previousValue = parseFloat(state.previousInput);
    const currentValue = parseFloat(state.currentInput);
    let result = 0;
    
    switch(state.operation) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '*':
        result = previousValue * currentValue;
        break;
      case '/':
        result = previousValue / currentValue;
        break;
    }
    
    // Add to history
    const expression = `${state.previousInput} ${state.operation} ${state.currentInput}`;
    addToHistory(expression, result);
    
    state.currentInput = result.toString();
    state.operation = null;
    state.shouldResetInput = true;
  }
  
  function clear() {
    state.currentInput = '0';
    state.previousInput = '';
    state.operation = null;
    state.shouldResetInput = false;
  }
  
  function backspace() {
    if (state.currentInput.length === 1 || 
        (state.currentInput.length === 2 && state.currentInput.startsWith('-'))) {
      state.currentInput = '0';
    } else {
      state.currentInput = state.currentInput.slice(0, -1);
    }
  }
  
  function handlePercent() {
    const value = parseFloat(state.currentInput);
    state.currentInput = (value / 100).toString();
  }
  
  function toggleSign() {
    const value = parseFloat(state.currentInput);
    state.currentInput = (-value).toString();
  }
  
  function updateDisplay() {
    currentInputDisplay.textContent = state.currentInput;
    
    if (state.operation !== null) {
      previousOperationDisplay.textContent = `${state.previousInput} ${state.operation}`;
    } else {
      previousOperationDisplay.textContent = '';
    }
  }
  
  function addToHistory(expression, result) {
    state.history.push({ expression, result });
    updateHistoryDisplay();
  }
  
  function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    state.history.slice().reverse().forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const expressionSpan = document.createElement('span');
      expressionSpan.className = 'history-expression';
      expressionSpan.textContent = item.expression + ' =';
      
      const resultSpan = document.createElement('span');
      resultSpan.className = 'history-result';
      resultSpan.textContent = item.result;
      
      historyItem.appendChild(expressionSpan);
      historyItem.appendChild(resultSpan);
      historyList.appendChild(historyItem);
    });
  }
  
  // Scientific calculator functionality
  const sciCurrentInputDisplay = document.getElementById('sci-current-input');
  const sciPreviousOperationDisplay = document.getElementById('sci-previous-operation');
  const sciCalculator = {
    currentInput: '0',
    expression: '',
    shouldResetInput: false,
    memory: 0,
    angleMode: 'deg'
  };
  
  document.querySelectorAll('.scientific-keypad .btn').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      const value = button.textContent;
      
      handleScientificAction(action, value);
      updateScientificDisplay();
    });
  });
  
  function handleScientificAction(action, value) {
    switch(action) {
      case 'sci-number':
        handleScientificNumber(value);
        break;
      case 'sci-decimal':
        handleScientificDecimal();
        break;
      case 'sci-operation':
        handleScientificOperation(value);
        break;
      case 'sci-calculate':
        calculateScientific();
        break;
      case 'sci-clear':
        clearScientific();
        break;
      case 'sci-backspace':
        backspaceScientific();
        break;
      case 'sci-toggle-sign':
        toggleScientificSign();
        break;
      case 'sci-memory':
        handleMemory(value);
        break;
    }
  }
  
  function handleScientificNumber(number) {
    if (sciCalculator.currentInput === '0' || sciCalculator.shouldResetInput) {
      sciCalculator.currentInput = number;
      sciCalculator.shouldResetInput = false;
    } else {
      sciCalculator.currentInput += number;
    }
  }
  
  function handleScientificDecimal() {
    if (sciCalculator.shouldResetInput) {
      sciCalculator.currentInput = '0.';
      sciCalculator.shouldResetInput = false;
    } else if (!sciCalculator.currentInput.includes('.')) {
      sciCalculator.currentInput += '.';
    }
  }
  
  function handleScientificOperation(operator) {
    switch(operator) {
      case 'sin':
        applyTrigFunction('sin');
        break;
      case 'cos':
        applyTrigFunction('cos');
        break;
      case 'tan':
        applyTrigFunction('tan');
        break;
      case 'ln':
        applyFunction('log');
        break;
      case 'log':
        applyFunction('log10');
        break;
      case 'π':
        sciCalculator.currentInput = Math.PI.toString();
        break;
      case 'e':
        sciCalculator.currentInput = Math.E.toString();
        break;
      case '^':
        sciCalculator.expression += sciCalculator.currentInput + ' ^ ';
        sciCalculator.shouldResetInput = true;
        break;
      case '√':
        applyFunction('sqrt');
        break;
      case 'x²':
        sciCalculator.currentInput = Math.pow(parseFloat(sciCalculator.currentInput), 2).toString();
        break;
      case '!':
        sciCalculator.currentInput = factorial(parseInt(sciCalculator.currentInput)).toString();
        break;
      case '1/x':
        sciCalculator.currentInput = (1 / parseFloat(sciCalculator.currentInput)).toString();
        break;
      case '|x|':
        sciCalculator.currentInput = Math.abs(parseFloat(sciCalculator.currentInput)).toString();
        break;
      case 'rad':
        sciCalculator.angleMode = 'rad';
        sciPreviousOperationDisplay.textContent = 'Mode: Radians';
        return;
      case 'deg':
        sciCalculator.angleMode = 'deg';
        sciPreviousOperationDisplay.textContent = 'Mode: Degrees';
        return;
      default:
        // For basic operators (+, -, *, /, etc.)
        sciCalculator.expression += sciCalculator.currentInput + ' ' + operator + ' ';
        sciCalculator.shouldResetInput = true;
    }
  }
  
  function applyTrigFunction(func) {
    let value = parseFloat(sciCalculator.currentInput);
    if (sciCalculator.angleMode === 'deg') {
      value = value * (Math.PI / 180); // Convert to radians
    }
    
    switch(func) {
      case 'sin':
        sciCalculator.currentInput = Math.sin(value).toString();
        break;
      case 'cos':
        sciCalculator.currentInput = Math.cos(value).toString();
        break;
      case 'tan':
        sciCalculator.currentInput = Math.tan(value).toString();
        break;
    }
  }
  
  function applyFunction(func) {
    const value = parseFloat(sciCalculator.currentInput);
    
    switch(func) {
      case 'sqrt':
        sciCalculator.currentInput = Math.sqrt(value).toString();
        break;
      case 'log':
        sciCalculator.currentInput = Math.log(value).toString();
        break;
      case 'log10':
        sciCalculator.currentInput = Math.log10(value).toString();
        break;
    }
  }
  
  function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
  
  function calculateScientific() {
    try {
      const expression = sciCalculator.expression + sciCalculator.currentInput;
      const result = math.evaluate(expression);
      
      // Add to history
      addToHistory(expression, result);
      
      sciCalculator.currentInput = result.toString();
      sciCalculator.expression = '';
      sciCalculator.shouldResetInput = true;
    } catch (error) {
      sciCalculator.currentInput = "Error";
      sciCalculator.shouldResetInput = true;
    }
  }
  
  function clearScientific() {
    sciCalculator.currentInput = '0';
    sciCalculator.expression = '';
    sciCalculator.shouldResetInput = false;
  }
  
  function backspaceScientific() {
    if (sciCalculator.currentInput.length === 1 || 
        (sciCalculator.currentInput.length === 2 && sciCalculator.currentInput.startsWith('-'))) {
      sciCalculator.currentInput = '0';
    } else {
      sciCalculator.currentInput = sciCalculator.currentInput.slice(0, -1);
    }
  }
  
  function toggleScientificSign() {
    const value = parseFloat(sciCalculator.currentInput);
    sciCalculator.currentInput = (-value).toString();
  }
  
  function handleMemory(action) {
    switch(action) {
      case 'MC':
        sciCalculator.memory = 0;
        break;
      case 'MR':
        sciCalculator.currentInput = sciCalculator.memory.toString();
        break;
      case 'M+':
        sciCalculator.memory += parseFloat(sciCalculator.currentInput);
        break;
    }
  }
  
  function updateScientificDisplay() {
    sciCurrentInputDisplay.textContent = sciCalculator.currentInput;
    sciPreviousOperationDisplay.textContent = sciCalculator.expression;
  }
  
  // Unit converter functionality
  const converterTypes = {
    length: {
      units: ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'],
      baseUnit: 'meter',
      conversionFactors: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        millimeter: 1000,
        mile: 0.000621371,
        yard: 1.09361,
        foot: 3.28084,
        inch: 39.3701
      }
    },
    weight: {
      units: ['kilogram', 'gram', 'milligram', 'pound', 'ounce', 'ton'],
      baseUnit: 'kilogram',
      conversionFactors: {
        kilogram: 1,
        gram: 1000,
        milligram: 1000000,
        pound: 2.20462,
        ounce: 35.274,
        ton: 0.001
      }
    },
    temperature: {
      units: ['celsius', 'fahrenheit', 'kelvin'],
      baseUnit: 'celsius',
      // Special case - handled in convert function
    },
    time: {
      units: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
      baseUnit: 'second',
      conversionFactors: {
        second: 1,
        minute: 1/60,
        hour: 1/3600,
        day: 1/86400,
        week: 1/604800,
        month: 1/2592000,
        year: 1/31536000
      }
    },
    area: {
      units: ['square meter', 'square kilometer', 'square centimeter', 'square millimeter', 'square mile', 'square yard', 'square foot', 'square inch', 'acre', 'hectare'],
      baseUnit: 'square meter',
      conversionFactors: {
        'square meter': 1,
        'square kilometer': 0.000001,
        'square centimeter': 10000,
        'square millimeter': 1000000,
        'square mile': 3.861e-7,
        'square yard': 1.19599,
        'square foot': 10.7639,
        'square inch': 1550,
        'acre': 0.000247105,
        'hectare': 0.0001
      }
    },
    volume: {
      units: ['cubic meter', 'cubic centimeter', 'liter', 'milliliter', 'cubic inch', 'cubic foot', 'cubic yard', 'gallon', 'quart', 'pint', 'cup', 'fluid ounce'],
      baseUnit: 'cubic meter',
      conversionFactors: {
        'cubic meter': 1,
        'cubic centimeter': 1000000,
        'liter': 1000,
        'milliliter': 1000000,
        'cubic inch': 61023.7,
        'cubic foot': 35.3147,
        'cubic yard': 1.30795,
        'gallon': 264.172,
        'quart': 1056.69,
        'pint': 2113.38,
        'cup': 4166.67,
        'fluid ounce': 33814
      }
    },
    speed: {
      units: ['m/s', 'km/h', 'mph', 'knot'],
      baseUnit: 'm/s',
      conversionFactors: {
        'm/s': 1,
        'km/h': 3.6,
        'mph': 2.23694,
        'knot': 1.94384
      }
    },
    data: {
      units: ['bit', 'byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'],
      baseUnit: 'bit',
      conversionFactors: {
        bit: 1,
        byte: 1 / 8,
        kilobyte: 1 / (8 * 1024),
        megabyte: 1 / (8 * 1024 ** 2),
        gigabyte: 1 / (8 * 1024 ** 3),
        terabyte: 1 / (8 * 1024 ** 4)
      }
    }
  };

  const converterTypeSelect = document.getElementById('converter-type');
  const fromUnitSelect = document.getElementById('from-unit');
  const toUnitSelect = document.getElementById('to-unit');
  const fromValueInput = document.getElementById('from-value');
  const toValueInput = document.getElementById('to-value');
  const convertBtn = document.getElementById('convert-btn');

  function initializeConverter() {
    updateUnitOptions();
  }

  converterTypeSelect.addEventListener('change', updateUnitOptions);

  function updateUnitOptions() {
    const type = converterTypeSelect.value;
    const units = converterTypes[type].units;

    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    units.forEach(unit => {
      const optionFrom = document.createElement('option');
      optionFrom.value = optionFrom.textContent = unit;
      fromUnitSelect.appendChild(optionFrom);

      const optionTo = document.createElement('option');
      optionTo.value = optionTo.textContent = unit;
      toUnitSelect.appendChild(optionTo);
    });
  }

  convertBtn.addEventListener('click', () => {
    const type = converterTypeSelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    const fromValue = parseFloat(fromValueInput.value);

    if (isNaN(fromValue)) {
      toValueInput.value = 'Invalid';
      return;
    }

    if (type === 'temperature') {
      let result;
      if (fromUnit === 'celsius') {
        if (toUnit === 'fahrenheit') result = fromValue * 9/5 + 32;
        else if (toUnit === 'kelvin') result = fromValue + 273.15;
        else result = fromValue;
      } else if (fromUnit === 'fahrenheit') {
        if (toUnit === 'celsius') result = (fromValue - 32) * 5/9;
        else if (toUnit === 'kelvin') result = (fromValue - 32) * 5/9 + 273.15;
        else result = fromValue;
      } else if (fromUnit === 'kelvin') {
        if (toUnit === 'celsius') result = fromValue - 273.15;
        else if (toUnit === 'fahrenheit') result = (fromValue - 273.15) * 9/5 + 32;
        else result = fromValue;
      }
      toValueInput.value = result.toFixed(4);
    } else {
      const fromFactor = converterTypes[type].conversionFactors[fromUnit];
      const toFactor = converterTypes[type].conversionFactors[toUnit];
      const baseValue = fromValue / fromFactor;
      const convertedValue = baseValue * toFactor;
      toValueInput.value = convertedValue.toFixed(4);
    }
  });

  // Graphing functionality
  const graphBtn = document.getElementById('graph-btn');
  const functionInput = document.getElementById('function-input');
  const canvas = document.getElementById('graph-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  graphBtn.addEventListener('click', () => {
    const expression = functionInput.value;
    const xMin = parseFloat(document.getElementById('x-min').value);
    const xMax = parseFloat(document.getElementById('x-max').value);
    const yMin = parseFloat(document.getElementById('y-min').value);
    const yMax = parseFloat(document.getElementById('y-max').value);

    drawGraph(expression, xMin, xMax, yMin, yMax);
  });

  function drawGraph(expression, xMin, xMax, yMin, yMax) {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    const xAxis = canvas.height * (-yMin / (yMax - yMin));
    const yAxis = canvas.width * (-xMin / (xMax - xMin));

    ctx.beginPath();
    ctx.moveTo(0, xAxis);
    ctx.lineTo(canvas.width, xAxis);
    ctx.moveTo(yAxis, 0);
    ctx.lineTo(yAxis, canvas.height);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // Plot function
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';

    for (let px = 0; px <= canvas.width; px++) {
      const x = xMin + (px / canvas.width) * (xMax - xMin);
      let y;

      try {
        y = math.evaluate(expression, { x });
      } catch {
        y = NaN;
      }

      if (isNaN(y)) continue;

      const py = canvas.height - ((y - yMin) / (yMax - yMin)) * canvas.height;

      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.stroke();
  }
});
