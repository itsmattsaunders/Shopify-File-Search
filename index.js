require('dotenv').config();
const axios = require('axios');
const { SHOPIFY_URL, SHOPIFY_API } = process.env;
console.log(SHOPIFY_API, SHOPIFY_URL);
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

const searchFileAPI = async (req, res) => {
    const fileName = req.body;
    try {
        const file = await searchFile(fileName);
        if (file) {
            console.log('File found:', file);
        } else {
            console.log('File not found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports = {
    searchFile,
    searchFileAPI
}