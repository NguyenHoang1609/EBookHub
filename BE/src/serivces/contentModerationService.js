import db from '../models';
import { Op, where } from 'sequelize';
import ebookService from './ebookService';

const createModerationWord = async (moderationData) => {
    try {
        const { word, severity, category, language, description, createdBy } = moderationData;

        if (!word || !word.trim()) {
            return {
                DT: '',
                EC: -1,
                EM: 'Word is required!'
            };
        }

        // Check if word already exists
        const existingWord = await db.ContentModeration.findOne({
            where: { word: word.trim().toLowerCase() }
        });

        if (existingWord) {
            return {
                DT: '',
                EC: -1,
                EM: 'This word already exists in the moderation list!'
            };
        }

        const moderationWord = await db.ContentModeration.create({
            word: word.trim().toLowerCase(),
            severity: severity || 'medium',
            category: category || 'other',
            language: language || 'vi',
            description: description || '',
            isActive: true,
            createdBy: createdBy || null
        });

        return {
            DT: moderationWord,
            EC: 0,
            EM: 'Moderation word created successfully!'
        };

    } catch (error) {
        console.log('Create moderation word error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to create moderation word!'
        };
    }
};

const getAllModerationWords = async (queryParams) => {
    try {
        const { page = 1, limit = 10, severity, category, language, search, isActive } = queryParams;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let whereClause = {};

        if (severity) {
            whereClause.severity = severity;
        }

        if (category) {
            whereClause.category = category;
        }

        if (language) {
            whereClause.language = language;
        }

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
        }

        if (search) {
            whereClause[Op.or] = [
                { word: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        console.log('whereClause', whereClause)

        const { count, rows } = await db.ContentModeration.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email'],
                    required: false
                },
                {
                    model: db.User,
                    as: 'updater',
                    attributes: ['id', 'name', 'email'],
                    required: false
                }
            ],
            order: [['created_at', 'DESC']],
            offset,
            limit: parseInt(limit),
            distinct: true
        });

        return {
            DT: {
                moderationWords: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / parseInt(limit)),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            },
            EC: 0,
            EM: 'Moderation words retrieved successfully!'
        };

    } catch (error) {
        console.log('Get all moderation words error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve moderation words!'
        };
    }
};

const getModerationWordById = async (moderationId) => {
    try {
        if (!moderationId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Moderation ID is required!'
            };
        }

        const moderationWord = await db.ContentModeration.findByPk(moderationId, {
            include: [
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email'],
                    required: false
                },
                {
                    model: db.User,
                    as: 'updater',
                    attributes: ['id', 'name', 'email'],
                    required: false
                }
            ]
        });

        if (!moderationWord) {
            return {
                DT: '',
                EC: -1,
                EM: 'Moderation word not found!'
            };
        }

        return {
            DT: moderationWord,
            EC: 0,
            EM: 'Moderation word retrieved successfully!'
        };

    } catch (error) {
        console.log('Get moderation word by ID error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve moderation word!'
        };
    }
};

const updateModerationWord = async (moderationId, updateData) => {
    try {
        const { word, severity, category, language, description, isActive, updatedBy } = updateData;

        if (!moderationId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Moderation ID is required!'
            };
        }

        const moderationWord = await db.ContentModeration.findByPk(moderationId);
        if (!moderationWord) {
            return {
                DT: '',
                EC: -1,
                EM: 'Moderation word not found!'
            };
        }

        // Check if word already exists (excluding current record)
        if (word && word.trim()) {
            const existingWord = await db.ContentModeration.findOne({
                where: {
                    word: word.trim().toLowerCase(),
                    moderationId: { [Op.ne]: moderationId }
                }
            });

            if (existingWord) {
                return {
                    DT: '',
                    EC: -1,
                    EM: 'This word already exists in the moderation list!'
                };
            }
        }

        const updateFields = {};
        if (word !== undefined) updateFields.word = word.trim().toLowerCase();
        if (severity !== undefined) updateFields.severity = severity;
        if (category !== undefined) updateFields.category = category;
        if (language !== undefined) updateFields.language = language;
        if (description !== undefined) updateFields.description = description;
        if (isActive !== undefined) updateFields.isActive = isActive;
        if (updatedBy !== undefined) updateFields.updatedBy = updatedBy;

        await moderationWord.update(updateFields);

        const updatedModerationWord = await db.ContentModeration.findByPk(moderationId, {
            include: [
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email'],
                    required: false
                },
                {
                    model: db.User,
                    as: 'updater',
                    attributes: ['id', 'name', 'email'],
                    required: false
                }
            ]
        });

        return {
            DT: updatedModerationWord,
            EC: 0,
            EM: 'Moderation word updated successfully!'
        };

    } catch (error) {
        console.log('Update moderation word error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to update moderation word!'
        };
    }
};

const deleteModerationWord = async (moderationId) => {
    try {
        if (!moderationId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Moderation ID is required!'
            };
        }

        const moderationWord = await db.ContentModeration.findByPk(moderationId);
        if (!moderationWord) {
            return {
                DT: '',
                EC: -1,
                EM: 'Moderation word not found!'
            };
        }

        await moderationWord.destroy();

        return {
            DT: '',
            EC: 0,
            EM: 'Moderation word deleted successfully!'
        };

    } catch (error) {
        console.log('Delete moderation word error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to delete moderation word!'
        };
    }
};

const bulkDeleteModerationWords = async (moderationIds) => {
    try {
        if (!moderationIds || moderationIds.length === 0) {
            return {
                DT: '',
                EC: -1,
                EM: 'Moderation IDs are required!'
            };
        }

        const deletedCount = await db.ContentModeration.destroy({
            where: {
                moderationId: {
                    [Op.in]: moderationIds
                }
            }
        });

        return {
            DT: { deletedCount },
            EC: 0,
            EM: `${deletedCount} moderation words deleted successfully!`
        };

    } catch (error) {
        console.log('Bulk delete moderation words error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to delete moderation words!'
        };
    }
};

const getModerationStats = async () => {
    try {
        const totalWords = await db.ContentModeration.count();
        const activeWords = await db.ContentModeration.count({ where: { isActive: true } });
        const inactiveWords = await db.ContentModeration.count({ where: { isActive: false } });

        const severityStats = await db.ContentModeration.findAll({
            attributes: [
                'severity',
                [db.sequelize.fn('COUNT', db.sequelize.col('severity')), 'count']
            ],
            group: ['severity'],
            raw: true
        });

        const categoryStats = await db.ContentModeration.findAll({
            attributes: [
                'category',
                [db.sequelize.fn('COUNT', db.sequelize.col('category')), 'count']
            ],
            group: ['category'],
            raw: true
        });

        const languageStats = await db.ContentModeration.findAll({
            attributes: [
                'language',
                [db.sequelize.fn('COUNT', db.sequelize.col('language')), 'count']
            ],
            group: ['language'],
            raw: true
        });

        return {
            DT: {
                totalWords,
                activeWords,
                inactiveWords,
                severityBreakdown: severityStats.reduce((acc, stat) => {
                    acc[stat.severity] = parseInt(stat.count);
                    return acc;
                }, {}),
                categoryBreakdown: categoryStats.reduce((acc, stat) => {
                    acc[stat.category] = parseInt(stat.count);
                    return acc;
                }, {}),
                languageBreakdown: languageStats.reduce((acc, stat) => {
                    acc[stat.language] = parseInt(stat.count);
                    return acc;
                }, {})
            },
            EC: 0,
            EM: 'Moderation statistics retrieved successfully!'
        };

    } catch (error) {
        console.log('Get moderation stats error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve moderation statistics!'
        };
    }
};

const validateContent = async (content) => {
    try {
        if (!content || typeof content !== 'string') {
            return {
                DT: { isValid: true, violations: [] },
                EC: 0,
                EM: 'Content is valid!'
            };
        }

        // Get all active moderation words
        const moderationWords = await db.ContentModeration.findAll({
            where: { isActive: true },
            attributes: ['word', 'severity', 'category', 'language']
        });

        if (moderationWords.length === 0) {
            return {
                DT: { isValid: true, violations: [] },
                EC: 0,
                EM: 'Content is valid!'
            };
        }

        const violations = [];
        const contentLower = content.toLowerCase();

        // Check for violations
        moderationWords.forEach(moderationWord => {
            const word = moderationWord.word.toLowerCase();
            if (contentLower.includes(word)) {
                violations.push({
                    word: moderationWord.word,
                    severity: moderationWord.severity,
                    category: moderationWord.category,
                    language: moderationWord.language,
                    foundAt: contentLower.indexOf(word)
                });
            }
        });

        // Determine if content is valid based on severity
        const hasCriticalViolations = violations.some(v => v.severity === 'critical');
        const hasHighViolations = violations.some(v => v.severity === 'high');
        const hasMediumViolations = violations.some(v => v.severity === 'medium');

        const isValid = !hasCriticalViolations && !hasHighViolations;

        return {
            DT: {
                isValid,
                violations,
                severity: hasCriticalViolations ? 'critical' :
                    hasHighViolations ? 'high' :
                        hasMediumViolations ? 'medium' : 'low'
            },
            EC: 0,
            EM: isValid ? 'Content is valid!' : 'Content contains inappropriate material!'
        };

    } catch (error) {
        console.log('Validate content error:', error);
        return {
            DT: { isValid: false, violations: [] },
            EC: -1,
            EM: 'Failed to validate content!'
        };
    }
};

const validateEbookContent = async (ebookId) => {
    try {
        if (!ebookId) {
            return {
                DT: { isValid: false, violations: [] },
                EC: -1,
                EM: 'Ebook ID is required!'
            };
        }

        // Get ebook with pages
        const ebookResult = await ebookService.getEbookById(ebookId, true);
        if (!ebookResult.success) {
            return {
                DT: { isValid: false, violations: [] },
                EC: -1,
                EM: 'Failed to retrieve ebook!'
            };
        }

        const ebook = ebookResult.DT;
        if (!ebook || !ebook.pages || ebook.pages.length === 0) {
            return {
                DT: { isValid: true, violations: [] },
                EC: 0,
                EM: 'Ebook has no content to validate!'
            };
        }

        // Combine all page content
        const allContent = [
            ebook.title || '',
            ebook.description || '',
            ...ebook.pages.map(page => page.content || '')
        ].join(' ');

        // Validate the combined content
        const validationResult = await validateContent(allContent);

        if (!validationResult.success) {
            return validationResult;
        }

        // If content is invalid, update ebook status to blocked
        if (!validationResult.DT.isValid) {
            try {
                await ebook.update({ status: 'blocked' });
                console.log(`Ebook ${ebookId} blocked due to content violations`);
            } catch (updateError) {
                console.error('Failed to update ebook status:', updateError);
            }
        }

        return {
            DT: {
                ...validationResult.DT,
                ebookId: ebookId,
                ebookTitle: ebook.title,
                totalPages: ebook.pages.length
            },
            EC: 0,
            EM: validationResult.DT.isValid ? 'Ebook content is valid!' : 'Ebook content contains inappropriate material and has been blocked!'
        };

    } catch (error) {
        console.log('Validate ebook content error:', error);
        return {
            DT: { isValid: false, violations: [] },
            EC: -1,
            EM: 'Failed to validate ebook content!'
        };
    }
};

const validateAllEbooks = async () => {
    try {
        // Get all published ebooks
        const ebooksResult = await ebookService.getAllEbooks({
            status: 'published',
            limit: 1000
        });

        if (!ebooksResult.success) {
            return {
                DT: { processed: 0, blocked: 0, errors: 0 },
                EC: -1,
                EM: 'Failed to retrieve ebooks!'
            };
        }

        const ebooks = ebooksResult.DT.ebooks;
        let processed = 0;
        let blocked = 0;
        let errors = 0;

        // Validate each ebook
        for (const ebook of ebooks) {
            try {
                const validationResult = await validateEbookContent(ebook.ebookId);
                processed++;

                if (!validationResult.DT.isValid) {
                    blocked++;
                }
            } catch (error) {
                console.error(`Error validating ebook ${ebook.ebookId}:`, error);
                errors++;
            }
        }

        return {
            DT: { processed, blocked, errors, total: ebooks.length },
            EC: 0,
            EM: `Validation completed! Processed: ${processed}, Blocked: ${blocked}, Errors: ${errors}`
        };

    } catch (error) {
        console.log('Validate all ebooks error:', error);
        return {
            DT: { processed: 0, blocked: 0, errors: 0 },
            EC: -1,
            EM: 'Failed to validate all ebooks!'
        };
    }
};

const validateCommentContent = async (content) => {
    try {
        if (!content || typeof content !== 'string') {
            return {
                DT: { isValid: true, violations: [], message: 'Content is valid' },
                EC: 0,
                EM: 'Content is valid!'
            };
        }

        // Get all active moderation words
        const moderationWords = await db.ContentModeration.findAll({
            where: { isActive: true },
            attributes: ['word', 'severity', 'category', 'language']
        });

        if (moderationWords.length === 0) {
            return {
                DT: { isValid: true, violations: [], message: 'Content is valid' },
                EC: 0,
                EM: 'Content is valid!'
            };
        }

        const violations = [];
        const contentLower = content.toLowerCase();

        // Check for violations
        moderationWords.forEach(moderationWord => {
            const word = moderationWord.word.toLowerCase();
            if (contentLower.includes(word)) {
                console.log('moderationWord', moderationWord)
                violations.push({
                    word: moderationWord.word,
                    severity: moderationWord.severity,
                    category: moderationWord.category,
                    language: moderationWord.language,
                    foundAt: contentLower.indexOf(word)
                });
            }
        });

        // Determine if content is valid based on severity
        const hasCriticalViolations = violations.some(v => v.severity === 'critical');
        const hasHighViolations = violations.some(v => v.severity === 'high');
        const hasMediumViolations = violations.some(v => v.severity === 'medium');
        const hasLowViolations = violations.some(v => v.severity === 'low');

        console.log('hasCriticalViolations', hasCriticalViolations)
        console.log('hasHighViolations', hasHighViolations)
        console.log('hasMediumViolations', hasMediumViolations)
        console.log('hasLowViolations', hasLowViolations)

        const isValid = !hasCriticalViolations && !hasHighViolations && !hasMediumViolations && !hasLowViolations;

        let message = 'Content is valid';
        if (!isValid) {
            message = 'Comment bao gồm nội dung bị cấm nên sẽ không được đăng';
        }


        return {
            DT: {
                isValid,
                violations,
                severity: hasCriticalViolations ? 'critical' :
                    hasHighViolations ? 'high' :
                        hasMediumViolations ? 'medium' : 'low',
                message
            },
            EC: 0,
            EM: isValid ? 'Content is valid!' : 'Content contains inappropriate material!'
        };

    } catch (error) {
        console.log('Validate comment content error:', error);
        return {
            DT: { isValid: false, violations: [], message: 'Validation failed' },
            EC: -1,
            EM: 'Failed to validate comment content!'
        };
    }
};

export default {
    createModerationWord,
    getAllModerationWords,
    getModerationWordById,
    updateModerationWord,
    deleteModerationWord,
    bulkDeleteModerationWords,
    getModerationStats,
    validateContent,
    validateEbookContent,
    validateAllEbooks,
    validateCommentContent
};
