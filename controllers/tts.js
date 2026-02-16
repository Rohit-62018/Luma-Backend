module.exports.TTS = async (req, res) => {

    const response = await axios.post(
      "http://127.0.0.1:8000/tts",
        req.body,
      { responseType: "arraybuffer" }
    ).catch((err) => {
        console.error("TTS service error:", err.message);
        throw new ExpressError("TTS service is unavailable", 502);
    });

    res.set("Content-Type", "audio/wav");
    res.send(response.data);

}