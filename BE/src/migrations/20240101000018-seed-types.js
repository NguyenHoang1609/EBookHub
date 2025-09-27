'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // const types = [
        //     { name: 'Thơ - Tản văn', description: 'Thơ ca và tản văn', is_active: true },
        //     { name: 'Trinh thám - Kinh dị', description: 'Truyện trinh thám và kinh dị', is_active: true },
        //     { name: 'Marketing - Bán hàng', description: 'Sách về marketing và bán hàng', is_active: true },
        //     { name: 'Quản trị - Lãnh đạo', description: 'Sách về quản trị và lãnh đạo', is_active: true },
        //     { name: 'Tài chính cá nhân', description: 'Sách về tài chính cá nhân', is_active: true },
        //     { name: 'Phát triển cá nhân', description: 'Sách về phát triển bản thân', is_active: true },
        //     { name: 'Doanh nhân - Bài học kinh doanh', description: 'Sách về doanh nhân và kinh doanh', is_active: true },
        //     { name: 'Học tập - Hướng nghiệp', description: 'Sách về học tập và hướng nghiệp', is_active: true },
        //     { name: 'Sức khỏe - Làm đẹp', description: 'Sách về sức khỏe và làm đẹp', is_active: true },
        //     { name: 'Khoa học - Công nghệ', description: 'Sách về khoa học và công nghệ', is_active: true },
        //     { name: 'Tư duy sáng tạo', description: 'Sách về tư duy sáng tạo', is_active: true },
        //     { name: 'Chứng khoán - Bất động sản - Đầu tư', description: 'Sách về đầu tư và tài chính', is_active: true },
        //     { name: 'Giáo dục - Văn hóa & Xã hội', description: 'Sách về giáo dục và xã hội', is_active: true },
        //     { name: 'Nghệ thuật sống', description: 'Sách về nghệ thuật sống', is_active: true },
        //     { name: 'Tâm linh - Tôn giáo', description: 'Sách về tâm linh và tôn giáo', is_active: true },
        //     { name: 'Sách Ngoại văn', description: 'Sách ngoại văn', is_active: true },
        //     { name: 'Kinh doanh - Làm giàu', description: 'Sách về kinh doanh và làm giàu', is_active: true },
        //     { name: 'Ngôn tình', description: 'Truyện ngôn tình', is_active: true },
        //     { name: 'Tác phẩm kinh điển', description: 'Các tác phẩm kinh điển', is_active: true },
        //     { name: 'Truyện - Tiểu thuyết', description: 'Truyện và tiểu thuyết', is_active: true },
        //     { name: 'Sách thiếu nhi', description: 'Sách dành cho thiếu nhi', is_active: true },
        //     { name: 'Hiện đại', description: 'Truyện hiện đại', is_active: true },
        //     { name: 'Cổ đại', description: 'Truyện cổ đại', is_active: true },
        //     { name: 'Huyền huyễn', description: 'Truyện huyền huyễn', is_active: true },
        //     { name: 'Đam mỹ', description: 'Truyện đam mỹ', is_active: true }
        // ];

        // await queryInterface.bulkInsert('types', types.map(type => ({
        //     ...type,
        //     created_at: new Date(),
        //     updated_at: new Date()
        // })), {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('types', null, {});
    }
};
