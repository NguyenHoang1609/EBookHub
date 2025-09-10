// Local PDF Conversion Configuration using pdfjs-dist
export const PDF_CONVERSION_CONFIG = {
    // Quality settings
    SCALE: 2.0, // Higher scale for better quality
    OUTPUT_FORMAT: 'image/jpeg',
    QUALITY: 0.95, // High quality JPEG (0.0 to 1.0)

    // File size limits
    MAX_FILE_SIZE_MB: 100,

    // Performance settings
    ENABLE_WEBGL: false,
    RENDER_INTERACTIVE_FORMS: false,

    // Output settings
    BACKGROUND_COLOR: '#FFFFFF',
    PROGRESSIVE_JPEG: true,

    // Error handling
    TIMEOUT_MS: 300000, // 5 minutes timeout
    MAX_PAGES: 1000 // Maximum pages to process
};

// Validate conversion settings
export const validateConversionSettings = () => {
    if (PDF_CONVERSION_CONFIG.SCALE <= 0) {
        throw new Error('PDF conversion scale must be greater than 0');
    }

    if (PDF_CONVERSION_CONFIG.QUALITY < 0 || PDF_CONVERSION_CONFIG.QUALITY > 1) {
        throw new Error('PDF conversion quality must be between 0 and 1');
    }

    if (PDF_CONVERSION_CONFIG.MAX_FILE_SIZE_MB <= 0) {
        throw new Error('PDF conversion max file size must be greater than 0');
    }
};
