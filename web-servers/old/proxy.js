const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

const netsapiensEndpoint = 'https://wiredftfuture-core-031-mci.wiredftfuture.ucaas.run/ns-api/';
const netsapiensAuthToken = 'nss_r49eJVIWyTcHb8N5b8is7HmLOOcxKIFyoIkZ26I6sszd3T0K36dc6fae';

app.post('/telnyx-webhook', async (req, res) => {
    try {
        // Log incoming Telnyx payload
        console.log('Received Telnyx payload:', JSON.stringify(req.body, null, 2));

        const telnyxPayload = req.body;
        const payload = telnyxPayload.data?.payload || {};

        // Flatten the payload
        const flattenedPayload = {
   	 'object': 'sms',
   	 'action': 'create',
   	 'nsCarrier': 'telnyx',
   	 'inboundSMS': 'true',
   	 'to': [{ 'phone_number': payload.to?.[0]?.phone_number || '' }],
    	 'from': { 'phone_number': payload.from?.phone_number || '' },
   	 'text': payload.text || '',
   	 'id': payload.id || telnyxPayload.data?.id || '',
   	 'received_at': payload.received_at || telnyxPayload.data?.occurred_at || ''
};

        // Full URL with query parameters
        const netsapiensUrl = `${netsapiensEndpoint}?object=sms&action=create&inboundSMS=true&nsCarrier=telnyx`;

        // Axios request configuration
        const requestConfig = {
            method: 'post',
            url: netsapiensUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': netsapiensAuthToken
            },
            data: flattenedPayload
        };

        // Log the exact request being sent to NS
        console.log('Sending POST to NetSapiens:', {
            url: requestConfig.url,
            headers: requestConfig.headers,
            body: JSON.stringify(requestConfig.data, null, 2)
        });

        // Send the request to NetSapiens
        const response = await axios(requestConfig);

        // Log the NS response
        console.log('NetSapiens response:', response.status, JSON.stringify(response.data, null, 2));

        // Respond to Telnyx
        res.status(200).json({ status: 'success', message: 'Forwarded to NetSapiens' });
    } catch (error) {
        console.error('Error processing webhook:', error.message, 'Status:', error.response?.status, 'Data:', JSON.stringify(error.response?.data, null, 2));
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to process webhook', 
            details: error.message, 
            netsapiensStatus: error.response?.status, 
            netsapiensData: error.response?.data 
        });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});
