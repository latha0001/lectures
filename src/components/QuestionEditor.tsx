import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  answer: string;
}

interface QuestionEditorProps {
  question: Question | undefined;
  onClose: () => void;
  onSave: (question: Question) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onClose, onSave }) => {
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [answer, setAnswer] = useState(question?.answer || '');

  if (!question) {
    return null;
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (!text.trim()) {
      alert('Question text cannot be empty');
      return;
    }

    if (options.some(option => !option.trim())) {
      alert('All options must be filled');
      return;
    }

    if (!answer) {
      alert('You must select a correct answer');
      return;
    }

    onSave({
      text,
      options,
      answer
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit Question</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="question-text" className="block text-sm font-medium text-gray-700 mb-1">
              Question Text
            </label>
            <textarea
              id="question-text"
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer Options
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={option === answer}
                    onChange={() => setAnswer(option)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="ml-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">Select the radio button next to the correct answer.</p>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;