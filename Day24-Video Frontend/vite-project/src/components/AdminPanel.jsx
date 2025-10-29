import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl"> {/* Adjusted padding and max-width */}
      <h1 className="text-4xl font-extrabold mb-8 text-center text-primary-content">Create New Problem</h1> {/* Larger title, centered */}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8"> {/* Increased space between sections */}
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-xl rounded-lg p-8"> {/* Increased padding, stronger shadow */}
          <h2 className="text-2xl font-bold mb-6 text-neutral-content">Basic Information</h2>
          <div className="space-y-5"> {/* Increased space between form controls */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">Title</span> {/* Larger label text */}
              </label>
              <input
                {...register('title')}
                className={`input input-bordered w-full text-base ${errors.title ? 'input-error' : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary'}`}
              />
              {errors.title && (
                <span className="text-error mt-1 text-sm">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">Description</span>
              </label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-40 w-full text-base ${errors.description ? 'textarea-error' : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary'}`}
              />
              {errors.description && (
                <span className="text-error mt-1 text-sm">{errors.description.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Responsive grid for difficulty and tag */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium">Difficulty</span>
                </label>
                <select
                  {...register('difficulty')}
                  className={`select select-bordered w-full text-base ${errors.difficulty ? 'select-error' : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium">Tag</span>
                </label>
                <select
                  {...register('tags')}
                  className={`select select-bordered w-full text-base ${errors.tags ? 'select-error' : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 shadow-xl rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-neutral-content">Test Cases</h2>
          
          {/* Visible Test Cases */}
          <div className="space-y-6 mb-8 border-b pb-8"> {/* Added bottom border and more padding */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-neutral-content">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="btn btn-sm btn-primary btn-outline" // Outline button for less visual weight
              >
                Add Visible Case
              </button>
            </div>
            
            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 p-6 rounded-lg space-y-3 bg-base-200"> {/* Light background for individual cases */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lg">Case #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="btn btn-xs btn-error btn-square" // Square remove button
                    >
                      ✕
                    </button>
                  </div>
                  
                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input input-bordered w-full text-base"
                  />
                  
                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input input-bordered w-full text-base"
                  />
                  
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className="textarea textarea-bordered w-full h-24 text-base"
                  />
                  {errors.visibleTestCases?.[index]?.input && <span className="text-error text-sm">{errors.visibleTestCases[index].input.message}</span>}
                  {errors.visibleTestCases?.[index]?.output && <span className="text-error text-sm">{errors.visibleTestCases[index].output.message}</span>}
                  {errors.visibleTestCases?.[index]?.explanation && <span className="text-error text-sm">{errors.visibleTestCases[index].explanation.message}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-6 pt-4"> {/* Padding top */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-neutral-content">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="btn btn-sm btn-primary btn-outline"
              >
                Add Hidden Case
              </button>
            </div>
            
            <div className="space-y-4">
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 p-6 rounded-lg space-y-3 bg-base-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lg">Case #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="btn btn-xs btn-error btn-square"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input input-bordered w-full text-base"
                  />
                  
                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input input-bordered w-full text-base"
                  />
                  {errors.hiddenTestCases?.[index]?.input && <span className="text-error text-sm">{errors.hiddenTestCases[index].input.message}</span>}
                  {errors.hiddenTestCases?.[index]?.output && <span className="text-error text-sm">{errors.hiddenTestCases[index].output.message}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-xl rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-neutral-content">Code Templates</h2>
          
          <div className="space-y-8"> {/* Increased space between language sections */}
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-5 p-6 rounded-lg bg-base-200"> {/* Light background for each language block */}
                <h3 className="text-xl font-semibold text-neutral-content">
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                </h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-medium">Initial Code</span>
                  </label>
                  <pre className="bg-neutral p-4 rounded-lg overflow-x-auto"> {/* Darker background for code, allow horizontal scroll */}
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono text-base text-neutral-content resize-y min-h-[120px]" // Resizable, min height
                      rows={6}
                    />
                  </pre>
                  {errors.startCode?.[index]?.initialCode && <span className="text-error mt-1 text-sm">{errors.startCode[index].initialCode.message}</span>}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-medium">Reference Solution</span>
                  </label>
                  <pre className="bg-neutral p-4 rounded-lg overflow-x-auto">
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono text-base text-neutral-content resize-y min-h-[120px]" // Resizable, min height
                      rows={6}
                    />
                  </pre>
                  {errors.referenceSolution?.[index]?.completeCode && <span className="text-error mt-1 text-sm">{errors.referenceSolution[index].completeCode.message}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full btn-lg mt-8 shadow-lg"> {/* Larger button, added margin top, stronger shadow */}
          Create Problem
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;