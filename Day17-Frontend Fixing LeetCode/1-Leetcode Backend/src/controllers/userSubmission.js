const Problem = require("../models/problem")
const Submission = require("../models/Submission")
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility")

const submitCode = async (req, res) => {
    // userId and ProblemId
    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        const { code, language } = req.body;

        if (!(userId && code && problemId && language)) {
            return res.status(400).send("some field missing");
        }

         if(language==='cpp')
        language='c++'
        // fetch the problem from database - kyu ki hidden test case chahiye rhege
        const problem = await Problem.findById(problemId)
        //    hiddentest case mil jayege

        // kya submission ko store krwa de pending status...bina judge0 ko phle bheje and jo bhi result aayega usko update krwa dege accepted or wrong ans complexity

        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: "pending",
            testCasesTotal: problem.hiddenTestCases.length
        })
        // judge0 ko code submit krna h

        const languageId = getLanguageById(language);

        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);


        // submitResult ko update
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted";
        let errorMessage = null;
        // testresult array ki form me h

        for (const test of testResult) {
            if (test.status_id === 3) {  // Accepted
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else if (test.status_id === 4) {
                status = "Wrong Answer";
                errorMessage = test.stderr;
            } else if (test.status_id === 5) {
                status = "Time Limit Exceeded";
            } else if (test.status_id === 6) {
                status = "Compilation Error";
                errorMessage = test.stderr;
            } else if (test.status_id === 7) {
                status = "Runtime Error";
                errorMessage = test.stderr;
            }
        }


        // store the result in database 


        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;


        // and upadtebyId se bhi kr skte h
        await submittedResult.save()

        // req.result ke under user info present h
        // problemId ko inser krege userSchema le problemSolved me if it is not present in thier
        if (!req.result.ProblemSolved.includes(problemId)) {
            req.result.ProblemSolved.push(problemId);
            await req.result.save();
        }


        // res.status(201).send(submittedResult)
         const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });



    } catch (err) {
        res.status(500).send("Internal server error");
    }
}

const runCode = async (req, res) => {
    //    eski info db in store krne ki need ni h // 
     try {
        const userId = req.result._id;
        const problemId = req.params.id;

        const { code, language } = req.body;

        if (!(userId && code && problemId && language)) {
            return res.status(400).send("some field missing");
        }

        // fetch the problem from database - kyu ki hidden test case chahiye rhege
        const problem = await Problem.findById(problemId)
        //    hiddentest case mil jayege
      if(language==='cpp')
        language='c++'
        
        // judge0 ko code submit krna h

        const languageId = getLanguageById(language);

        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);
        
let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }

        // res.status(201).send(testResult)
        res.status(201).json({
    success:status,
    testCases: testResult,
    runtime,
    memory
   });



    } catch (err) {
        res.status(500).send("Internal server error");
    }
}
module.exports = { submitCode, runCode }

// language_id: 54,
// stdin: '-1 5',
// expected_output: '4',
// stdout: '4',
// status_id: 3,
// created_at: '2025-09-04T06:46:40.963Z',
// finished_at: '2025-09-04T06:46:41.531Z',
// time: '0.003',
// memory: 1504,
// stderr: null,
// token: 'e485fc35-8498-41bd-b0df-a7df601bebcd',  