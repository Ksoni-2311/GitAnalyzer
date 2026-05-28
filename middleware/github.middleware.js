import axios from 'axios';

const githubProfileCheck = async (
    req,
    res,
    next
) => {

    try {

        const { username } = req.params;

        // Search profile on GitHub
        const response = await axios.get(
            `https://api.github.com/users/${username}`
        );

        // If found
        req.githubProfile = response.data;

        next();

    } catch (error) {

        // GitHub user not found
        if (error.response?.status === 404) {

            return res.status(404).json({

                success: false,

                message:
                    'GitHub profile not found'
            });
        }

        // Other errors
        return res.status(500).json({

            success: false,

            message:
                'Error checking GitHub profile'
        });
    }
};

export default githubProfileCheck;