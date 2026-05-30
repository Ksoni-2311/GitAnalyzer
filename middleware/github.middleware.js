import axios from 'axios';

const githubProfileCheck = async (req, res, next) => {
    try {
        const { username } = req.params;

        console.log(`Checking GitHub profile: ${username}`);

        const response = await axios.get(
            `https://api.github.com/users/${username}`,
            {
                headers: {
                    Accept: 'application/vnd.github+json',
                    'User-Agent': 'GitAnalyzer'
                }
            }
        );

        console.log('GitHub profile found');

        req.githubProfile = response.data;

        next();
    } catch (error) {
        console.error('GitHub Check Error:');

        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);

            if (error.response.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: 'GitHub profile not found'
                });
            }

            if (error.response.status === 403) {
                return res.status(403).json({
                    success: false,
                    message: 'GitHub API rate limit exceeded',
                    details: error.response.data
                });
            }

            return res.status(error.response.status).json({
                success: false,
                message: 'GitHub API error',
                details: error.response.data
            });
        }

        console.error('Message:', error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default githubProfileCheck;