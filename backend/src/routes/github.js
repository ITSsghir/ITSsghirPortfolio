const express = require('express');
const router = express.Router();
const https = require('https');

const GITHUB_USERNAME = 'itssghir';

// Function to fetch data from GitHub API
function fetchGitHubData(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: path,
            headers: {
                'User-Agent': 'Node.js',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        https.get(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode === 404) {
                        reject(new Error('GitHub user not found'));
                    } else if (res.statusCode !== 200) {
                        reject(new Error(`GitHub API returned status ${res.statusCode}`));
                    } else {
                        resolve(JSON.parse(data));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Route to get GitHub repositories
router.get('/repos', async (req, res) => {
    try {
        const repos = await fetchGitHubData(`/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        // Filter and transform the repos data
        const transformedRepos = repos
            .filter(repo => !repo.fork && !repo.archived) // Filter out forks and archived repos
            .map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                html_url: repo.html_url,
                topics: repo.topics || [],
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                updated_at: repo.updated_at,
                homepage: repo.homepage,
                size: repo.size
            }))
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        res.json(transformedRepos);
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        res.status(error.message.includes('not found') ? 404 : 500).json({ 
            error: 'Error fetching GitHub repositories',
            details: error.message 
        });
    }
});

module.exports = router; 