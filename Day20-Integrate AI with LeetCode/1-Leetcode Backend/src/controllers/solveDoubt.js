const { GoogleGenAI } = require("@google/genai");



const solveDoubt = async (req, res) => {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.
                GEMINI_KEY
        });


        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Explain how AI works in a few words",
            });

            res.status(200).send(response.text);
            console.log(response.text);
        }
        main();
    } catch (err) {
        res.status(500).send("Internal server error");
    }
}
module.exports = solveDoubt;