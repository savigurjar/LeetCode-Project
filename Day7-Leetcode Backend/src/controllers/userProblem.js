const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem")

const createProblem = async (req, res) => {

  const { title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode,
    referenceSolution, problemCreator
  } = req.body;


  try {

    for (const { language, completeCode } of referenceSolution) {


      // source_code:
      // language_id:
      // stdin: 
      // expectedOutput:

      const languageId = getLanguageById(language);

      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
      // console.log(resultToken)
      const testResult = await submitToken(resultToken);
     

      //  console.log(testResult);

      for (const test of testResult) {
        if (test.status_id === 3) {
          console.log(" Test Passed");
        } else if (test.status_id === 1 || test.status_id === 2) {
          console.log(" Please wait, still processing...");
        } else if (test.status_id === 4) {
          return res.status(400).send(" Wrong Answer in reference solution");
        } else if (test.status_id === 5) {
          return res.status(400).send(" Time Limit Exceeded");
        } else if (test.status_id === 6) {
          return res.status(400).send(" Compilation Error");
        } else {
          return res.status(400).send("Runtime/Internal Error");
        }
      }

    }


    // We can store it in our DB

    const userProblem = await Problem.create({
      ...req.body,
      problemCreater: req.result._id
    });

    res.status(201).send("Problem Saved Successfully");
  }
  catch (err) {
    res.status(400).send("Error: " + err);
  }
}

const updateProblem = async (req, res) => {
  // kis problem ko edit krna h----> id se check krege

  const { id } = req.params;


  // fronted me sara data aayega fir se, to check krege sb sahi chl rha h ya nhi
  const { title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode,
    referenceSolution, problemCreator
  } = req.body;

  try {
    if (!id) {
      return res.status(400).send("Missing Id");
    }

    // update
    const DsaProblem = await Problem.findById(id)
    if (!DsaProblem) {
      return res.status(404).send("Id is not present in server");
    }

    for (const { language, completeCode } of referenceSolution) {

      const languageId = getLanguageById(language);

      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

      const testResult = await submitToken(resultToken);

      //  console.log(testResult);

      for (const test of testResult) {
        if (test.status_id === 3) {
          console.log(" Test Passed");
        } else if (test.status_id === 1 || test.status_id === 2) {
          console.log(" Please wait, still processing...");
        } else if (test.status_id === 4) {
          return res.status(400).send(" Wrong Answer ");
        } else if (test.status_id === 5) {
          return res.status(400).send(" Time Limit Exceeded");
        } else if (test.status_id === 6) {
          return res.status(400).send(" Compilation Error");
        } else {
          return res.status(400).send("Runtime/Internal Error");
        }
      }

    }

    const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true })



    //  res.status(200).send(newProblem)


    return res.status(200).json({
      message: "Problem updated successfully",
      data: newProblem
    });




  } catch (err) {
    res.status(500).send("Error ", +err)
  }

}

const deleteProblem = async (req, res) => {

  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is missing");

    // problem present h ya nhi
    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) return res.status(400).send("ID is not present in server")

    const deleteProblem = await Problem.findByIdAndDelete(id)

    if (!deleteProblem) return res.status(404).send("Problem is missing");


    res.status(200).send("Successfully Deleted")
  }
  catch (err) {
    res.status(500).send("Error " + err)
  }

}
const getProblemById = async (req, res) => {

  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is missing");

    // problem present h ya nhi and kon kon se field lana h
    const DsaProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode');
    if (!DsaProblem) return res.status(400).send("Problem is missing")

    res.status(200).send(DsaProblem)
  }
  catch (err) {
    res.status(500).send("Error " + err)
  }

}

const getAllProblem = async (req, res) => {
  // empty object dedenge jisse sari problem fetch hokr aa jayegi
  try {
    const getProblems = await Problem.find({}).select('_id title tags difficulty');


    // kyu ki array type ka hota h
    if (getProblems.length==0) return res.status(404).send("Problems are missing");

    res.status(200).send(getProblems)

  } catch (err) {
    res.status(500).send("Error " + err)
  }
}

module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem };


