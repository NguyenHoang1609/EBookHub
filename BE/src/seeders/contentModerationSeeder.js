'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            const moderationWords = [
                // Profanity - High severity
                { word: 'địt', severity: 'high', category: 'profanity', language: 'vi', description: 'Profanity word' },
                { word: 'đụ', severity: 'high', category: 'profanity', language: 'vi', description: 'Profanity word' },
                { word: 'đéo', severity: 'high', category: 'profanity', language: 'vi', description: 'Profanity word' },
                { word: 'đĩ', severity: 'high', category: 'profanity', language: 'vi', description: 'Profanity word' },
                { word: 'đĩ mẹ', severity: 'critical', category: 'profanity', language: 'vi', description: 'Severe profanity' },
                { word: 'đụ má', severity: 'critical', category: 'profanity', language: 'vi', description: 'Severe profanity' },
                { word: 'địt mẹ', severity: 'critical', category: 'profanity', language: 'vi', description: 'Severe profanity' },
                { word: 'đéo biết', severity: 'medium', category: 'profanity', language: 'vi', description: 'Profanity phrase' },
                { word: 'đéo hiểu', severity: 'medium', category: 'profanity', language: 'vi', description: 'Profanity phrase' },
                { word: 'đéo care', severity: 'medium', category: 'profanity', language: 'vi', description: 'Profanity phrase' },

                // Violence - High severity
                { word: 'giết', severity: 'high', category: 'violence', language: 'vi', description: 'Violence-related word' },
                { word: 'chém', severity: 'high', category: 'violence', language: 'vi', description: 'Violence-related word' },
                { word: 'đánh', severity: 'medium', category: 'violence', language: 'vi', description: 'Violence-related word' },
                { word: 'đấm', severity: 'medium', category: 'violence', language: 'vi', description: 'Violence-related word' },
                { word: 'đá', severity: 'medium', category: 'violence', language: 'vi', description: 'Violence-related word' },
                { word: 'bạo lực', severity: 'high', category: 'violence', language: 'vi', description: 'Violence term' },
                { word: 'hung bạo', severity: 'high', category: 'violence', language: 'vi', description: 'Violence term' },
                { word: 'tàn bạo', severity: 'high', category: 'violence', language: 'vi', description: 'Violence term' },

                // Hate speech - Critical severity
                { word: 'đồng tính', severity: 'medium', category: 'hate_speech', language: 'vi', description: 'Potentially discriminatory term' },
                { word: 'bê đê', severity: 'high', category: 'hate_speech', language: 'vi', description: 'Derogatory term' },
                { word: 'bóng', severity: 'high', category: 'hate_speech', language: 'vi', description: 'Derogatory term' },
                { word: 'đồng bóng', severity: 'high', category: 'hate_speech', language: 'vi', description: 'Derogatory term' },
                { word: 'đàn bà', severity: 'low', category: 'hate_speech', language: 'vi', description: 'Potentially sexist term' },
                { word: 'con gái', severity: 'low', category: 'hate_speech', language: 'vi', description: 'Potentially sexist term' },

                // Sexual content - High severity
                { word: 'sex', severity: 'high', category: 'sexual', language: 'vi', description: 'Sexual content' },
                { word: 'tình dục', severity: 'high', category: 'sexual', language: 'vi', description: 'Sexual content' },
                { word: 'làm tình', severity: 'high', category: 'sexual', language: 'vi', description: 'Sexual content' },
                { word: 'quan hệ', severity: 'medium', category: 'sexual', language: 'vi', description: 'Sexual content' },
                { word: 'yêu', severity: 'low', category: 'sexual', language: 'vi', description: 'Love/romance term' },
                { word: 'hôn', severity: 'low', category: 'sexual', language: 'vi', description: 'Romance term' },

                // Spam - Medium severity
                { word: 'spam', severity: 'medium', category: 'spam', language: 'vi', description: 'Spam content' },
                { word: 'quảng cáo', severity: 'medium', category: 'spam', language: 'vi', description: 'Advertisement spam' },
                { word: 'bán hàng', severity: 'medium', category: 'spam', language: 'vi', description: 'Sales spam' },
                { word: 'mua bán', severity: 'medium', category: 'spam', language: 'vi', description: 'Trading spam' },
                { word: 'kiếm tiền', severity: 'medium', category: 'spam', language: 'vi', description: 'Money-making spam' },

                // Political - Medium severity
                { word: 'chính trị', severity: 'medium', category: 'political', language: 'vi', description: 'Political content' },
                { word: 'đảng', severity: 'medium', category: 'political', language: 'vi', description: 'Political party' },
                { word: 'nhà nước', severity: 'medium', category: 'political', language: 'vi', description: 'Government term' },
                { word: 'cộng sản', severity: 'medium', category: 'political', language: 'vi', description: 'Political ideology' },
                { word: 'tư bản', severity: 'medium', category: 'political', language: 'vi', description: 'Political ideology' },

                // Religious - Medium severity
                { word: 'phật', severity: 'low', category: 'religious', language: 'vi', description: 'Religious term' },
                { word: 'chúa', severity: 'low', category: 'religious', language: 'vi', description: 'Religious term' },
                { word: 'thần', severity: 'low', category: 'religious', language: 'vi', description: 'Religious term' },
                { word: 'tôn giáo', severity: 'low', category: 'religious', language: 'vi', description: 'Religious term' },
                { word: 'đạo', severity: 'low', category: 'religious', language: 'vi', description: 'Religious term' },

                // Other inappropriate content - Medium severity
                { word: 'ma túy', severity: 'critical', category: 'other', language: 'vi', description: 'Drug-related content' },
                { word: 'cần sa', severity: 'critical', category: 'other', language: 'vi', description: 'Drug-related content' },
                { word: 'heroin', severity: 'critical', category: 'other', language: 'vi', description: 'Drug-related content' },
                { word: 'cocaine', severity: 'critical', category: 'other', language: 'vi', description: 'Drug-related content' },
                { word: 'tự tử', severity: 'high', category: 'other', language: 'vi', description: 'Self-harm content' },
                { word: 'giết mình', severity: 'high', category: 'other', language: 'vi', description: 'Self-harm content' },
                { word: 'tự sát', severity: 'high', category: 'other', language: 'vi', description: 'Self-harm content' },

                // Internet slang and inappropriate terms
                { word: 'vl', severity: 'medium', category: 'profanity', language: 'vi', description: 'Internet slang profanity' },
                { word: 'vcl', severity: 'medium', category: 'profanity', language: 'vi', description: 'Internet slang profanity' },
                { word: 'vcc', severity: 'medium', category: 'profanity', language: 'vi', description: 'Internet slang profanity' },
                { word: 'dm', severity: 'high', category: 'profanity', language: 'vi', description: 'Internet slang profanity' },
                { word: 'đcm', severity: 'high', category: 'profanity', language: 'vi', description: 'Internet slang profanity' },

                // Additional common inappropriate terms
                { word: 'ngu', severity: 'medium', category: 'profanity', language: 'vi', description: 'Insult term' },
                { word: 'ngu si', severity: 'medium', category: 'profanity', language: 'vi', description: 'Insult term' },
                { word: 'đần', severity: 'medium', category: 'profanity', language: 'vi', description: 'Insult term' },
                { word: 'đần độn', severity: 'medium', category: 'profanity', language: 'vi', description: 'Insult term' },
                { word: 'thằng ngu', severity: 'high', category: 'profanity', language: 'vi', description: 'Insult phrase' },
                { word: 'con ngu', severity: 'high', category: 'profanity', language: 'vi', description: 'Insult phrase' },

                // Gaming and online inappropriate terms
                { word: 'noob', severity: 'low', category: 'profanity', language: 'vi', description: 'Gaming insult' },
                { word: 'newbie', severity: 'low', category: 'profanity', language: 'vi', description: 'Gaming term' },
                { word: 'hack', severity: 'medium', category: 'other', language: 'vi', description: 'Potentially harmful activity' },
                { word: 'cheat', severity: 'medium', category: 'other', language: 'vi', description: 'Potentially harmful activity' },

                // Additional Vietnamese profanity variations
                { word: 'địt con mẹ', severity: 'critical', category: 'profanity', language: 'vi', description: 'Severe profanity phrase' },
                { word: 'đụ con mẹ', severity: 'critical', category: 'profanity', language: 'vi', description: 'Severe profanity phrase' },
                { word: 'đéo thèm', severity: 'medium', category: 'profanity', language: 'vi', description: 'Profanity phrase' },
                { word: 'đéo cần', severity: 'medium', category: 'profanity', language: 'vi', description: 'Profanity phrase' },
                { word: 'đéo muốn', severity: 'medium', category: 'profanity', language: 'vi', description: 'Profanity phrase' }
            ];

            // Clear existing records first
            await queryInterface.bulkDelete('content_moderation', null, {});
            console.log('Cleared existing moderation words');

            // Insert moderation words one by one to catch specific errors
            for (let i = 0; i < moderationWords.length; i++) {
                const word = moderationWords[i];
                try {
                    await queryInterface.bulkInsert('content_moderation', [{
                        word: word.word,
                        severity: word.severity,
                        category: word.category,
                        language: word.language,
                        description: word.description,
                        is_active: true,
                        created_at: new Date(),
                        updated_at: new Date()
                    }]);
                    console.log(`Inserted word ${i + 1}: ${word.word}`);
                } catch (error) {
                    console.error(`Error inserting word ${i + 1} (${word.word}):`, error.message);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Seeder error:', error);
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('content_moderation', null, {});
    }
};
