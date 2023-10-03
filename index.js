require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const { SHOPIFY_URL, SHOPIFY_API } = process.env;
const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_URL}/admin/api/2023-01/graphql.json`;


const searchFile = async (req, res) => {
    const fileName = req;
    const query = `
        {
            files(first: 1, query: "filename:${fileName}") {
                edges {
                    node {
                        preview {
                            image {
                              url
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await axios({
            url: SHOPIFY_GRAPHQL_ENDPOINT,
            method: 'POST',
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_API,
                'Content-Type': 'application/json',
            },
            data: {
                query: query
            }
        });

        const files = response.data.data.files.edges[0].node.preview.image.url;
        if (files) {
            return files;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error searching for file:', error);
        throw error;
    }
};

const searchFileAPI = (req, res) => {
    const corsHandler = cors({    
        origin: 'https://pete.co.nz'
    });

    const fileName = req.body;
    
    corsHandler(req, res, async () => {
        try {
            const file = await searchFile(fileName);
            if (file) {
                console.log('File found:', file);
                res.status(200).send(file);
            } else {
                console.log('File not found.');
                res.status(404).send('File not found');
            }
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).send('Internal Server Error');
        }
    });
};

module.exports = {
    searchFile,
    searchFileAPI
}