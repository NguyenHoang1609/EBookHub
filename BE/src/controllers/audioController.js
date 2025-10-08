import audioService from '../serivces/audioService';

function formatText(text) {
    // Remove excessive whitespace, tabs, and normalize newlines
    return text
        .replace(/[\t\r]+/g, ' ')
        .replace(/\n{2,}/g, '\n')
        .replace(/ +/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .trim();
}

const textToSpeech = async (req, res) => {
    try {
        let { text } = req.body;
        if (!text) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Missing required field: text.'
            });
        }
        text = formatText(text);
        const result = await audioService.textToSpeech(text);
        if (result.EC === 0) {
            console.log(result)
            res.set('Content-Type', result.contentType || 'audio/wav');
            res.set('Content-Disposition', 'inline; filename="tts-audio.' + (result.contentType === 'audio/mp4' ? 'mp4' : 'wav') + '"');
            return res.status(200).send(result.DT);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error('TTS controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during TTS.'
        });
    }
};

export default {
    textToSpeech
};
