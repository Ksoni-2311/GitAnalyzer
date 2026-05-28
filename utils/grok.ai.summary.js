import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generateSummary = async (profileData) => {
    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: `
Generate a professional GitHub profile summary in maximum 40 words.

Focus on:
- developer skills
- GitHub activity
- top technology
- open-source presence
- achievements

Keep it concise, professional, and impactful.
Username: ${profileData.username}
Followers: ${profileData.followers}
Repositories: ${profileData.publicRepos}
Top Language: ${profileData.topLanguage}
`,
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.log(error);

        return "Summary generation failed";
    }
};