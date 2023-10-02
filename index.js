require('dotenv');
const axios = require('axios');
const { SHOPIFY_URL, SHOPIFY_API } = process.env;
const SHOPIFY_GRAPHQL_ENDPOINT = `https://${SHOPIFY_URL}/admin/api/2023-01/graphql.json`;


const searchFile = async (req, res) => {
    const fileName = `${req.body}.jpg`;
    const query = `
        {
            files(first: 1, query: "filename:${fileName}") {
                edges {
                    node {
                        ... on GenericFile {
                            id
                            url
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

        const files = response.data.data.files.edges;
        if (files.length > 0) {
            return files[0].node;
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
        const file = await searchFileByName(fileName);
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