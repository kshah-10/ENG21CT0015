const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 500; 
let numbersWindow = [];

const endpoints = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand'
};

const companyName = "Jarvis";
const clientID = "ccc98e9c-7628-45b2-b8f1-d3c0e5b2a5dd";
const clientSecret = "NsNsuMSMuzNXIGAT";
const ownerName = "Khushi";
const ownerEmail = "shahkhushi499@gmail.com";
const rollNo = "ENG21CT0015";


async function fetchNumbers(endpoint) {
    try {
        const response = await axios.get(endpoint, { timeout: TIMEOUT });
        console.log(`Fetched numbers from ${endpoint}:`, response.data.numbers); 
        return response.data.numbers; 
    } catch (error) {
        console.error(`Error fetching numbers from ${endpoint}:`, error.message);
        return [];
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: "Invalid number ID" });
    }

    const endpoint = endpoints[numberid];
    const newNumbers = await fetchNumbers(endpoint);
    const uniqueNewNumbers = [...new Set(newNumbers)];

    console.log('New numbers fetched:', uniqueNewNumbers); // Add this line
    console.log('Current window state before update:', numbersWindow); // Add this line

    const previousState = [...numbersWindow];
    numbersWindow = [...new Set([...numbersWindow, ...uniqueNewNumbers])];

    if (numbersWindow.length > WINDOW_SIZE) {
        numbersWindow = numbersWindow.slice(-WINDOW_SIZE);
    }

    const avg = calculateAverage(numbersWindow);

    const response = {
        "windowPrevState": previousState,
        "windowCurrState": numbersWindow,
        "numbers": uniqueNewNumbers,
        "avg": parseFloat(avg.toFixed(2))
    };

    console.log('Response:', response);

    return res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});