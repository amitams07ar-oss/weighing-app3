import React, { useState, useMemo } from 'react';
import { Unit } from '../types.ts';

interface FormRowProps {
  label: string;
  children: React.ReactNode;
  isLocked?: boolean;
  labelClassName?: string;
}

const FormRow: React.FC<FormRowProps> = ({ label, children, isLocked, labelClassName }) => (
  <>
    <div className={`${labelClassName || 'bg-gradient-to-r from-fuchsia-500 to-purple-600'} text-white p-3 text-center rounded-l-md flex items-center justify-center shadow`}>
      <span className="font-semibold text-sm md:text-base">{label}</span>
    </div>
    <div className={`${isLocked ? 'bg-gray-100' : 'bg-white'} border-y border-r border-gray-300 rounded-r-md flex items-center justify-center text-gray-800 font-medium shadow transition focus-within:ring-2 focus-within:ring-purple-500`}>
      {children}
    </div>
  </>
);

const WeighingCalculator: React.FC = () => {
  const [theoreticalWeight, setTheoreticalWeight] = useState('2.063');
  const [unit1, setUnit1] = useState<Unit>(Unit.MG);
  const [times, setTimes] = useState('2');
  const [unit2, setUnit2] = useState<Unit>(Unit.MG);
  const [actualWeight, setActualWeight] = useState('4.01');

  const {
    totalTheoreticalWeight,
    lowerBound,
    upperBound,
    status,
    displayPrecision
  } = useMemo(() => {
    const tWeight = parseFloat(theoreticalWeight) || 0;
    const numTimes = parseInt(times, 10) || 0;
    const aWeight = parseFloat(actualWeight) || 0;

    if (tWeight === 0 || numTimes === 0) {
      return {
        totalTheoreticalWeight: 0,
        lowerBound: 0,
        upperBound: 0,
        status: { text: '-', color: 'text-gray-500' },
        displayPrecision: 4
      };
    }

    let totalWeightInUnit1 = tWeight * numTimes;
    let finalTotalWeight;

    if (unit1 === unit2) {
      finalTotalWeight = totalWeightInUnit1;
    } else if (unit1 === Unit.MG && unit2 === Unit.G) {
      finalTotalWeight = totalWeightInUnit1 / 1000;
    } else { // G to MG
      finalTotalWeight = totalWeightInUnit1 * 1000;
    }

    const newLowerBound = finalTotalWeight * 0.98;
    const newUpperBound = finalTotalWeight * 1.02;

    let currentStatus;
    if (actualWeight.trim() === '') {
      currentStatus = { text: 'Awaiting Input', color: 'text-yellow-600' };
    } else if (aWeight >= newLowerBound && aWeight <= newUpperBound) {
      currentStatus = { text: 'Pass', color: 'text-purple-700' };
    } else {
      currentStatus = { text: 'Fail', color: 'text-red-600' };
    }

    // Adjust precision for display based on magnitude
    const precision = finalTotalWeight < 1 ? 8 : 4;

    return {
      totalTheoreticalWeight: finalTotalWeight,
      lowerBound: newLowerBound,
      upperBound: newUpperBound,
      status: currentStatus,
      displayPrecision: precision
    };
  }, [theoreticalWeight, unit1, times, unit2, actualWeight]);

  const handleClearAll = () => {
    setTheoreticalWeight('');
    setUnit1(Unit.MG);
    setTimes('');
    setUnit2(Unit.MG);
    setActualWeight('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        <FormRow label="Theoretical Weight (As Per AP Sheet)">
          <div className="flex items-center w-full">
            <input
              type="number"
              value={theoreticalWeight}
              onChange={(e) => setTheoreticalWeight(e.target.value)}
              className="flex-grow w-full text-center p-2 bg-transparent focus:outline-none"
              placeholder="e.g., 2.063"
            />
            <div className="flex-shrink-0 pr-2">
              <button
                onClick={() => setUnit1(Unit.MG)}
                className={`px-3 py-1 text-sm rounded-l-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 ${
                  unit1 === Unit.MG ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={unit1 === Unit.MG}
              >
                mg
              </button>
              <button
                onClick={() => setUnit1(Unit.G)}
                className={`px-3 py-1 text-sm rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 ${
                  unit1 === Unit.G ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={unit1 === Unit.G}
              >
                g
              </button>
            </div>
          </div>
        </FormRow>

        <FormRow label="No. of Times Weighing to be taken">
          <input
            type="number"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
            className="w-full text-center p-2 bg-transparent focus:outline-none"
            placeholder="e.g., 2"
          />
        </FormRow>

        <FormRow label="Total Theoretical Weight to be taken" isLocked>
          <div className="flex items-center w-full">
            <span className="flex-grow w-full text-center p-2">{totalTheoreticalWeight.toFixed(displayPrecision)}</span>
            <div className="flex-shrink-0 pr-2">
              <button
                onClick={() => setUnit2(Unit.MG)}
                className={`px-3 py-1 text-sm rounded-l-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 ${
                  unit2 === Unit.MG ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={unit2 === Unit.MG}
              >
                mg
              </button>
              <button
                onClick={() => setUnit2(Unit.G)}
                className={`px-3 py-1 text-sm rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 ${
                  unit2 === Unit.G ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-pressed={unit2 === Unit.G}
              >
                g
              </button>
            </div>
          </div>
        </FormRow>

        <FormRow label="Acceptable Range" isLocked labelClassName="bg-gradient-to-r from-blue-500 to-teal-400">
          <span className="p-2 w-full text-center">
            {lowerBound.toFixed(displayPrecision)} - {upperBound.toFixed(displayPrecision)}
          </span>
        </FormRow>
        
        <FormRow label="Actual Weight Taken">
           <input
            type="number"
            value={actualWeight}
            onChange={(e) => setActualWeight(e.target.value)}
            className="w-full text-center p-2 bg-transparent focus:outline-none"
            placeholder="Enter value"
          />
        </FormRow>
        <FormRow label="Status" isLocked labelClassName="bg-gradient-to-r from-blue-500 to-teal-400">
           <span className={`p-2 w-full text-center font-bold text-lg ${status.color}`}>
            {status.text}
           </span>
        </FormRow>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleClearAll}
          className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:from-fuchsia-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          aria-label="Clear all weighing calculator inputs"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default WeighingCalculator;