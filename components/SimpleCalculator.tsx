import React, { useState, useMemo } from 'react';

const SimpleCalculator: React.FC = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState<'+' | '-'>('+');

  const result = useMemo(() => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
      return '';
    }

    let res;
    switch (operation) {
      case '+':
        res = n1 + n2;
        break;
      case '-':
        res = n1 - n2;
        break;
      default:
        res = '';
    }
    return Number(res.toPrecision(15)); // Handle floating point inaccuracies
  }, [num1, num2, operation]);


  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white p-3 text-center rounded-t-md shadow">
        <h2 className="font-semibold text-lg">Calculator</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 border-x border-b border-gray-300 rounded-b-md shadow">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="First number"
          className="col-span-1 p-3 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />
        <div className="col-span-1 flex justify-center items-center">
            <button
              onClick={() => setOperation('+')}
              className={`w-12 h-12 text-2xl rounded-l-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 ${
                operation === '+' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={operation === '+'}
            >
              +
            </button>
            <button
              onClick={() => setOperation('-')}
              className={`w-12 h-12 text-2xl rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 ${
                operation === '-' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={operation === '-'}
            >
              -
            </button>
        </div>
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Second number"
          className="col-span-1 p-3 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />
        
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 text-center rounded-l-md col-span-1 flex items-center justify-center font-semibold">
            Result
        </div>
        <div className="col-span-2 bg-gray-100 border border-gray-300 rounded-r-md flex items-center justify-center p-3 text-gray-800 font-bold text-lg">
            {result}
        </div>
      </div>
    </div>
  );
};

export default SimpleCalculator;