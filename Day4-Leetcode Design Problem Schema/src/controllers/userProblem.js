const getLanguageById = require("../utils/problemUtility")
const createProblem = async (req, res) => {

    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, refrenceSolution, problemCreater } = req.body;

    try {

        for (const element of refrenceSolution) {
              //sorce_code,language_id,stdin,expectedOutput

              const languageId = getLanguageById(language);

              for(const element of visibleTestCases){
                
              }
        }

    } catch (err) {

    }














}