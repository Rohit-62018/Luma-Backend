const axios = require('axios');
const { ExpressError } = require('../utils/ExpressError')

module.exports.TTS = async (req, res) => {

    const response = await axios.post(
      "http://0.0.0.0:7860/tts",
        req.body,
      { responseType: "arraybuffer" }
    ).catch((err) => {
        console.error("TTS service error:", err.message);
        throw new ExpressError("TTS service is unavailable", 502);
    });

    res.set("Content-Type", "audio/wav");
    res.send(response.data);
}