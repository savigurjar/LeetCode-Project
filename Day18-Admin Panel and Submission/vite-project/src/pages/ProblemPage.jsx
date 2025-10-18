import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => {
          if (sc.language === "C++" && selectedLanguage === 'cpp') return true;
          if (sc.language === "Java" && selectedLanguage === 'java') return true;
          if (sc.language === "Javascript" && selectedLanguage === 'javascript') return true;
          return false;
        })?.initialCode || '';
        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };
    fetchProblem();
  }, [problemId, selectedLanguage]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => editorRef.current = editor;
  const handleLanguageChange = (lang) => setSelectedLanguage(lang);

  const handleRun = async () => {
    setRunLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ success: false, error: 'Internal server error', testCases: [] });
      setActiveRightTab('testcase');
    } finally {
      setRunLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setSubmitLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({ accepted: false, error: 'Submission failed' });
      setActiveRightTab('result');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          {['description','editorial','solutions','submissions'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeLeftTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeLeftTab === 'description' && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </div>
                <div className="badge badge-primary">{problem.tags}</div>
              </div>
              <div className="prose max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                {problem.description}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                <div className="space-y-4">
                  {problem.visibleTestCases.map((example, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <div><strong>Input:</strong> {example.input}</div>
                        <div><strong>Output:</strong> {example.output}</div>
                        <div><strong>Explanation:</strong> {example.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {activeLeftTab === 'editorial' && (
            <div className="prose max-w-none whitespace-pre-wrap text-sm leading-relaxed">
              Editorial content goes here.
            </div>
          )}
          {activeLeftTab === 'solutions' && (
            <div className="space-y-6">
              {(problem.referenceSolution || problem.solutions)?.map((solution, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-lg mb-2">{solution.language}</h4>
                  <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                    <code>{solution.completeCode || solution.code}</code>
                  </pre>
                </div>
              )) || (
                <p className="text-gray-500">Solutions will be available after you solve the problem.</p>
              )}
            </div>
          )}
          {activeLeftTab === 'submissions' && (
            <div className="text-gray-500">Your submission history will appear here.</div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          {['code','testcase','result'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeRightTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {['javascript','java','cpp'].map(lang => (
                    <button
                      key={lang}
                      className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang==='cpp'?'C++':lang==='javascript'?'JavaScript':'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="90%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false,
                    automaticLayout: true, tabSize: 2, insertSpaces: true, wordWrap: 'on',
                    lineNumbers: 'on', renderLineHighlight: 'line'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveRightTab('testcase')}>Console</button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${runLoading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={runLoading || submitLoading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${submitLoading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={submitLoading || runLoading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
                  {runResult.testCases?.map((tc,i) => (
                    <div key={i} className="bg-base-100 p-3 rounded text-xs mb-2 font-mono">
                      <div><strong>Input:</strong> {tc.stdin}</div>
                      <div><strong>Expected:</strong> {tc.expected_output}</div>
                      <div><strong>Output:</strong> {tc.stdout}</div>
                      <div className={tc.status_id === 3 ? 'text-green-600' : 'text-red-600'}>
                        {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Click "Run" to test your code with the example test cases.</div>
              )}
               <div className="p-4 border-t border-base-300 flex justify-between">
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveRightTab('testcase')}>Console</button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm ${runLoading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={runLoading || submitLoading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm ${submitLoading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={submitLoading || runLoading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult ? (
                <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
                  {submitResult.accepted ? (
                    <div>
                      <h4 className="font-bold text-lg">🎉 Accepted</h4>
                      <div className="mt-4 space-y-2">
                        <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        <p>Runtime: {submitResult.runtime} sec</p>
                        <p>Memory: {submitResult.memory} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
                      <div className="mt-4 space-y-2">
                        <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">Click "Submit" to submit your solution for evaluation.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
