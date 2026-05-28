import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (profileData) => {
  try {
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
    Generate a professional GitHub profile summary in 2 lines.

    Username: ${profileData.username}
    Followers: ${profileData.followers}
    Public Repositories: ${profileData.publicRepos}
    Top Language: ${profileData.topLanguage}
    Total Stars: ${profileData.totalStars}

    Keep it concise and developer focused.
    `;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.log(error);
    return "No summary generated";
  }
};