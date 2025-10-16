import React from 'react';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import './Policy.scss';

const Policy = () => {
    return (
        <div className="policy-page">
            <Navigation />

            <div className="policy-container">
                <div className="policy-header">
                    <h1 className="policy-title">
                        🛡️ Chính Sách Bảo Mật & Quyền Riêng Tư
                    </h1>
                    <p className="policy-update">
                        Cập nhật lần cuối: [ngày/tháng/năm]
                    </p>
                </div>

                <div className="policy-content">
                    <div className="policy-section">
                        <p className="policy-intro">
                            Trang web [Tên website ebook] luôn coi trọng quyền riêng tư của người dùng, bao gồm cả tác giả đăng tải sách điện tử và độc giả sử dụng dịch vụ. Chính sách này được xây dựng để giúp mọi người hiểu rõ cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân trong suốt quá trình hoạt động trên nền tảng.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Thu Thập Thông Tin</h2>
                        <p>
                            Khi một tác giả tham gia xuất bản ebook trên [Tên website ebook], chúng tôi có thể yêu cầu cung cấp các thông tin cần thiết như họ tên, email, số điện thoại và thông tin thanh toán để xác minh danh tính, đảm bảo quyền lợi về bản quyền và xử lý các giao dịch. Bên cạnh đó, các dữ liệu về tác phẩm như tên sách, mô tả, ảnh bìa và giá bán cũng sẽ được lưu trữ để phục vụ cho việc hiển thị và quảng bá đến người đọc. Tương tự, đối với độc giả, việc tạo tài khoản yêu cầu một số thông tin cơ bản để xác thực, đồng thời giúp hệ thống lưu lại lịch sử mua sách, tải sách và các hoạt động đọc nhằm tối ưu trải nghiệm cá nhân hóa.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Sử Dụng Thông Tin</h2>
                        <p>
                            Tất cả dữ liệu mà chúng tôi thu thập đều được sử dụng với mục đích duy nhất là vận hành, duy trì và cải thiện chất lượng dịch vụ. Thông tin có thể được dùng để xử lý thanh toán, gửi thông báo liên quan đến giao dịch, hỗ trợ kỹ thuật, hoặc gửi đến người dùng các bản tin cập nhật nếu họ đồng ý. Chúng tôi cam kết không bán, cho thuê hay trao đổi thông tin người dùng cho bất kỳ bên thứ ba nào. Trong một số trường hợp đặc biệt, dữ liệu có thể được chia sẻ với đối tác thanh toán hoặc nhà cung cấp dịch vụ kỹ thuật nhằm đảm bảo hoạt động của hệ thống, hoặc theo yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Bảo Mật Dữ Liệu</h2>
                        <p>
                            Chúng tôi áp dụng nhiều biện pháp bảo mật nghiêm ngặt để bảo vệ dữ liệu người dùng, bao gồm mã hóa, tường lửa và các cơ chế kiểm soát truy cập nội bộ. Mọi thông tin cá nhân được lưu trữ an toàn trên máy chủ đáng tin cậy, chỉ có nhân sự được ủy quyền mới được phép tiếp cận. Người dùng hoàn toàn có quyền yêu cầu xem lại, chỉnh sửa hoặc xóa thông tin của mình bất cứ lúc nào. Nếu không muốn tiếp tục nhận thông tin quảng cáo, bạn cũng có thể dễ dàng hủy đăng ký hoặc yêu cầu xóa vĩnh viễn tài khoản.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Cookie và Công Nghệ Theo Dõi</h2>
                        <p>
                            Trang web có thể sử dụng cookie và các công nghệ theo dõi khác để ghi nhớ lựa chọn đăng nhập, ngôn ngữ hoặc gợi ý nội dung phù hợp với thói quen đọc sách của từng người. Việc chấp nhận cookie giúp trải nghiệm của bạn mượt mà hơn, tuy nhiên, bạn có thể tắt tính năng này trong cài đặt trình duyệt nếu muốn, dù điều đó có thể khiến một số chức năng không hoạt động đúng cách.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Bản Quyền và Sở Hữu Trí Tuệ</h2>
                        <p>
                            Mọi nội dung ebook, hình ảnh hoặc dữ liệu được đăng tải bởi tác giả vẫn thuộc quyền sở hữu trí tuệ của chính họ. [Tên website ebook] chỉ đóng vai trò là nền tảng phân phối và tôn trọng tuyệt đối quyền tác giả. Độc giả không được phép sao chép, phát hành lại hay sử dụng trái phép các tác phẩm đã mua hoặc tải. Mọi hành vi vi phạm bản quyền đều có thể bị xử lý theo quy định của pháp luật Việt Nam về sở hữu trí tuệ.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Liên Hệ</h2>
                        <p>
                            Nếu bạn có bất kỳ câu hỏi, yêu cầu hoặc thắc mắc nào liên quan đến việc bảo mật thông tin cá nhân, vui lòng liên hệ với chúng tôi qua email <a href="mailto:contact@tenwebsite.com" className="contact-link">contact@tenwebsite.com</a> hoặc số điện thoại [số hotline]. Mọi phản hồi sẽ được xử lý nhanh chóng và minh bạch.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Thay Đổi Chính Sách</h2>
                        <p>
                            Chúng tôi có thể thay đổi hoặc cập nhật Chính sách bảo mật này trong tương lai để phù hợp hơn với quy định pháp luật hoặc điều chỉnh hệ thống dịch vụ. Khi có thay đổi, thông báo sẽ được đăng tải công khai trên website và có hiệu lực sau một khoảng thời gian hợp lý.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Đồng Ý Sử Dụng</h2>
                        <p className="policy-conclusion">
                            [Tên website ebook] luôn mong muốn mang lại một không gian xuất bản và đọc sách điện tử an toàn, minh bạch và đáng tin cậy cho cả tác giả lẫn người đọc. Việc bạn tiếp tục sử dụng nền tảng đồng nghĩa với việc bạn đồng ý với các điều khoản được nêu trong chính sách này.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Policy;
