const { getLanguageById, submitBatch } = require("../utils/problemUtility");
const axios = require("axios")
const createProblem = async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        refrenceSolution,
        problemCreater
    } = req.body;

    try {
        for (const element of refrenceSolution) {
            // element should have language and completeCode
            const { language, completeCode } = element;

            const languageId = getLanguageById(language);


            // batch submission
            const submissions = visibleTestCases.map(({ input, expectedOutput }) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: input,
                expected_output: expectedOutput
            }));
            const submitResult = await submitBatch(submissions)

            console.log(submissions);
        }

        res.status(201).json({ message: "Problem created successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
