const fs = require('fs');
const path = require('path');
import db from '../models/index';
import { Op } from 'sequelize';

const convertImages = async () => {
//   try {
//     // Tạo thư mục uploads nếu chưa tồn tại
//     const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }

//     // Lấy tất cả bản ghi có ảnh BLOB
//     const products = await db.RelevantImage.findAll({
//       where: {
//         image: { [Op.ne]: null }
//       }
//     });

//     console.log(`Found ${products.length} images to convert`);

//     for (const product of products) {
//       const { id, image } = product;

//       if (!image) {
//         console.log(`⚠️ Skipping product ${id} - no image data`);
//         continue;
//       }

//       // Tách phần base64 và xác định loại file
//       const match = /^data:(image\/[a-zA-Z]+);base64,(.+)$/.exec(image);
//       if (!match) {
//         console.log(`❌ Không nhận diện được định dạng ảnh cho id ${id}`);
//         continue;
//       }
//       const mimeType = match[1]; // image/jpeg hoặc image/webp
//       const ext = mimeType.split('/')[1]; // jpg hoặc webp
//       const base64Data = match[2];

//       const fileName = `relevant_image_${id}_${Date.now()}.${ext}`;
//       const filePath = path.join(uploadsDir, fileName);

//       // Ghi file
//       fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

//       // Tạo path tương đối (cho web server dùng)
//       const relativePath = `/uploads/${fileName}`;

//       // Update DB - uncomment khi muốn cập nhật database
//       await product.update({
//         image: relativePath
//       });

//       console.log(`✅ Saved ${fileName} for product ${id}`);
//     }

//     console.log('🎉 Hoàn tất chuyển ảnh!');
//   } catch (err) {
//     console.error('❌ Lỗi:', err);
//   }

try {
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    // Tên file dạng: relevant_image_{id}_{timestamp}.{ext}
    const match = /^relevant_image_(\d+)_\d+\.(jpeg|jpg|webp)$/.exec(file);
    if (!match) continue;
    const id = parseInt(match[1], 10);
    const relativePath = `/uploads/${file}`;

    // Update lại trường image thành tên file hoặc đường dẫn
    const [affectedRows] = await db.RelevantImage.update(
      { image: relativePath },
      { where: { id } }
    );

    if (affectedRows > 0) {
      console.log(`✅ Updated image for id ${id} -> ${relativePath}`);
    } else {
      console.log(`❌ Không tìm thấy bản ghi với id ${id}`);
    }
  }
  console.log('🎉 Đã cập nhật lại trường image cho các bản ghi thành công!');
} catch (error) {
    console.log(error);
}
};

export default convertImages;