import express, { Router } from 'express';
import axios from 'axios';
import { db } from '../config/db.js';
import githubProfileCheck from '../middleware/github.middleware.js';
import { generateSummary } from '../utils/grok.ai.summary.js';

const router = Router();

// Analyze GitHub profile
router.post('/analyze/:username',
    githubProfileCheck,

    async (req, res) => {

        try {

            const { username } = req.params;

            // Fetch GitHub profile
            const profileResponse = await axios.get(
                `https://api.github.com/users/${username}`
            );

            // Fetch repositories
            const repoResponse = await axios.get(
                `https://api.github.com/users/${username}/repos`
            );

            const profile = profileResponse.data;

            const repos = repoResponse.data;

            // Calculate insights
            let totalStars = 0;

            let totalForks = 0;

            const languageMap = {};

            repos.forEach((repo) => {

                totalStars += repo.stargazers_count;

                totalForks += repo.forks_count;

                if (repo.language) {

                    languageMap[repo.language] =
                        (languageMap[repo.language] || 0) + 1;
                }
            });

            // Find top language
            let topLanguage = 'Unknown';

            let max = 0;

            for (let lang in languageMap) {

                if (languageMap[lang] > max) {

                    max = languageMap[lang];

                    topLanguage = lang;
                }
            }

            // Generate profile score
            const profileScore = Math.min(
                100,
                profile.followers + profile.public_repos
            );

            // Generate AI summary
            const aiSummary = await generateSummary({
                username: profile.login,
                followers: profile.followers,
                publicRepos: profile.public_repos,
                topLanguage,
                totalStars
            });

            // SQL query
            const sql = `
                INSERT INTO github_profiles (

                    username,
                    name,
                    bio,
                    avatar_url,
                    location,
                    followers,
                    following,
                    public_repos,
                    total_stars,
                    total_forks,
                    top_language,
                    profile_score,
                    ai_summary

                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

                ON DUPLICATE KEY UPDATE

                    name = VALUES(name),
                    bio = VALUES(bio),
                    avatar_url = VALUES(avatar_url),
                    location = VALUES(location),
                    followers = VALUES(followers),
                    following = VALUES(following),
                    public_repos = VALUES(public_repos),
                    total_stars = VALUES(total_stars),
                    total_forks = VALUES(total_forks),
                    top_language = VALUES(top_language),
                    profile_score = VALUES(profile_score),
                    ai_summary = VALUES(ai_summary)
            `;

            // Insert into DB
            db.query(

                sql,

                [
                    profile.login,
                    profile.name,
                    profile.bio,
                    profile.avatar_url,
                    profile.location,
                    profile.followers,
                    profile.following,
                    profile.public_repos,
                    totalStars,
                    totalForks,
                    topLanguage,
                    profileScore,
                    aiSummary || 'No summary generated'
                ],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: 'Database insert failed'
                        });
                    }

                    res.status(200).json({

                        success: true,

                        message:
                            'Profile analyzed successfully',

                        data: {

                            username: profile.login,

                            followers: profile.followers,

                            publicRepos:
                                profile.public_repos,

                            totalStars,

                            totalForks,

                            topLanguage,

                            profileScore,

                            aiSummary
                        }
                    });
                }
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({

                success: false,

                message: error.message
            });
        }
    }
);

// Get all profiles
router.get('/allprofile', (req, res) => {

    db.query(
        'SELECT * FROM github_profiles',

        (err, data) => {

            if (err) {

                console.log(
                    'Error in allprofile',
                    err
                );

                return res.status(500).send(err);
            }

            res.status(200).json({

                success: true,

                count: data.length,

                data
            });
        }
    );
});

// Get profile by username
router.get('/profile/:username', (req, res) => {

    const { username } = req.params;

    const sql =
        'SELECT * FROM github_profiles WHERE username = ?';

    db.query(

        sql,

        [username],

        (err, data) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,

                    message: 'Database error'
                });
            }

            if (data.length === 0) {

                return res.status(404).json({

                    success: false,

                    message: 'Profile not found'
                });
            }

            res.status(200).json({

                success: true,

                data: data[0]
            });
        }
    );
});
router.get('/',(req,res)=>{
    res.json("routes working")
})

export default router;