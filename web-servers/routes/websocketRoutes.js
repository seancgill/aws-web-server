const express = require('express');
const router = express.Router();

// Route for /streamtest
router.all('/streamtest', (req, res) => {
    console.log('Request method:', req.method);
    console.log('Query params:', req.query);
    console.log('Body:', req.body);
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Stream url="wss://echo.websocket.org">
      <Parameter name="direction" value="bidirectional"/>
  </Stream>
</Response>`);
});

// Route for /streamstart
router.all('/streamstart', (req, res) => {
    console.log('Request method:', req.method);
    console.log('Query params:', req.query);
    console.log('Body:', req.body);
    // Use only custom params, not SIP params, in the WSS URL
    const { agent_id, called_number, caller_id, call_sid, conversation_signature } = req.query;
    const customAgentId = agent_id || 'Ht3KtACC4pQXIDzDYvTH';
    const customCalledNumber = called_number || '+14128952924';
    const customCallerId = caller_id || '+14847844455';
    const customCallSid = call_sid || 'CA6bb570a98ff8afe21b3aeb1b5ba40dzz';
    const customConvSig = conversation_signature || '1xs2D0rsG3YmAluI6cTn';

    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Stream url="wss://sgdemo-aws.work/wss-stream/?agent_id=${customAgentId}&called_number=${customCalledNumber}&caller_id=${customCallerId}&call_sid=${customCallSid}&conversation_signature=${customConvSig}">
      <Parameter name="direction" value="bidirectional"/>
  </Stream>
</Response>`);
});

module.exports = router;
