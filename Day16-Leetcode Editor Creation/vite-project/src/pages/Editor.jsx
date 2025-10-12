import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  // Default code snippets for each language
  const initialCode = {
    javascript: `// JavaScript Example
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("World"));`,
    python: `# Python Example
def greet(name):
    return "Hello, " + name + "!"

print(greet("World"))`,
    cpp: `// C++ Example
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    html: `<!-- HTML Example -->
<!DOCTYPE html>
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>`,
  };

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(initialCode["javascript"]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(initialCode[selectedLang]); // load default code for that language
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const runCode = () => {
    console.clear();
    console.log("Running code for:", language);
    console.log(code);
    alert(`Code for ${language} printed in console!`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Monaco Code Editor</h1>

        <div className="flex gap-3 items-center">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-800 border border-gray-600 px-3 py-2 rounded"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
          </select>

          <button
            onClick={runCode}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Run
          </button>
        </div>
      </div>

      <Editor
        height="80vh"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
