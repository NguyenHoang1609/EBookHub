import axios from 'axios';

const TTS_API_URL = 'https://viettelai.vn/tts/speech_synthesis';
const TTS_TOKEN = 'b5dccbc76cc47a8e23bc5a06e6425e58';
const TTS_VOICE = 'hcm-diemmy';
const TTS_SPEED = 0.9;

const textToSpeech = async (text) => {
    try {
        const response = await axios.post(TTS_API_URL, {
            token: TTS_TOKEN,
            text: text,
            without_filter: true,
            voice: TTS_VOICE,
            speed: TTS_SPEED
        }, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            const contentType = response.headers['content-type'] || 'audio/wav';
            return {
                DT: Buffer.from(response.data),
                EC: 0,
                EM: 'TTS audio generated successfully.',
                contentType
            };
        } else {
            return {
                DT: '',
                EC: -1,
                EM: 'TTS API error: ' + response.statusText
            };
        }
    } catch (error) {
        console.error('TTS service error:', error?.response?.data || error.message);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to generate TTS audio.'
        };
    }
};

export default {
    textToSpeech
};
