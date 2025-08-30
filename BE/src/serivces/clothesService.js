import { raw } from "body-parser";
import db from "../models";
import _, { includes } from "lodash"
import { Op } from "sequelize";
import fs from 'fs';
import path from 'path';
const config = require('../config/config.js');


const validateClothes = async (name) => {
    let isValid = true;
    let clothes = await db.Clothes.findOne({
        where: { name: name },
        raw: true
    })

    if (clothes && !_.isEmpty(clothes)) {
        isValid = false;
    }
    return isValid;
}

const createClothesService = async (data) => {
    try {

        if (
            !data || !data.category || !data.contentMarkdown || !data.discount
            || !data.stockData || !data.imgArray || !data.name || !data.type
            || !data.price
        ) {
            return {
                DT: "",
                EC: -1,
                EM: 'Missing parameter!'
            }
        }
        else {
            let isValid = await validateClothes(data.name);



            if (isValid === false) {
                return {
                    DT: "",
                    EC: -1,
                    EM: 'Product name is exist!'
                }
            }
            else {

                let clothes = await db.Clothes.create({
                    name: data.name,
                    category: data.category,
                    type: data.type,
                    price: data.price
                });

                if (clothes && clothes.dataValues && clothes.dataValues.id) {

                    let clothes_id = clothes.dataValues.id

                    await db.Markdown.create({
                        clothesId: clothes_id,
                        contentMarkdown: data.contentMarkdown
                    })

                    await db.Discount.create({
                        clothesId: clothes_id,
                        eventId: -1,
                        value: data.discount
                    })

                    let imgArray = data.imgArray;
                    let imgDataToStore = [];
                    const uploadsDir = config.UPLOADS_DIR;
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }

                    imgArray.forEach((base64Img, idx) => {
                        // Tách base64 và lấy extension
                        const match = /^data:(image\/[a-zA-Z]+);base64,(.+)$/.exec(base64Img);
                        if (!match) return;
                        const mimeType = match[1];
                        const ext = mimeType.split('/')[1];
                        const base64Data = match[2];
                        const fileName = `clothes_${clothes_id}_${Date.now()}_${idx}.${ext}`;
                        const filePath = path.join(uploadsDir, fileName);
                        console.log(filePath);
                        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                        const relativePath = `/uploads/${fileName}`;
                        imgDataToStore.push({
                            clothesId: clothes_id,
                            image: relativePath
                        });
                    });

                    await db.RelevantImage.bulkCreate(imgDataToStore);

                    let stockDataToStore = [];
                    let stockData = data.stockData;

                    stockData.map((item) => {
                        console.log(item);
                        let obj = {}
                        obj.clothesId = clothes_id;
                        obj.color = item.color;
                        obj.size = item.size;
                        obj.stock = item.stock;
                        stockDataToStore.push(obj);
                    })

                    await db.Color_Size.bulkCreate(stockDataToStore);

                    return {
                        DT: "",
                        EC: 0,
                        EM: 'Create clothes completed!'
                    }
                }
                else {
                    return {
                        DT: "",
                        EC: -1,
                        EM: 'Err from clothes service!'
                    }
                }
            }



        }
    }
    catch (e) {
        console.log(e);
        return {
            DT: "",
            EC: -1,
            EM: 'Err from sever service...'
        }
    }
}

const convertClothesImgArray = (clothesArr) => {
    if (clothesArr && _.isArray(clothesArr)) {
        let data = [];
        clothesArr.map((item) => {
            let child = item;
            child.RelevantImages && child.RelevantImages.length > 0 && child.RelevantImages.map((item) => {
                let base64String = new Buffer(item.image, 'base64').toString('binary');
                item.image = base64String;
                return item;
            })

            if (child.Discounts[0].Event && child.Discounts[0].Event.bannerImg) {
                child.Discounts[0].Event.bannerImg = new Buffer(child.Discounts[0].Event.bannerImg, 'base64').toString('binary');
                child.Discounts[0].Event.backdropImg = new Buffer(child.Discounts[0].Event.backdropImg, 'base64').toString('binary');
            }

            data.push(child);
        })
        return data;
    }
    else if (_.isObject(clothesArr)) {
        clothesArr.RelevantImages.map((item) => {
            let base64String = new Buffer(item.image, 'base64').toString('binary');
            item.image = base64String;
            return item;
        })
        if (clothesArr.Discounts[0].Event && clothesArr.Discounts[0].Event.bannerImg) {
            clothesArr.Discounts[0].Event.bannerImg = new Buffer(clothesArr.Discounts[0].Event.bannerImg, 'base64').toString('binary');
            clothesArr.Discounts[0].Event.backdropImg = new Buffer(clothesArr.Discounts[0].Event.backdropImg, 'base64').toString('binary');
        }
        return clothesArr;
    }
    else {
        return '';
    }
}

const sortArrImageById = (clothesArr) => {
    let data = [];
    if (clothesArr && clothesArr.length > 0) {

        clothesArr.map((item) => {
            let child = item;

            child.RelevantImages && child.RelevantImages.length > 0 && child.RelevantImages.sort(function (a, b) {
                return a.id - b.id;
            });

            data.push(child);
        })
    }

    return data;
}

const getClothesService = async (type, id, page, pageSize, clothesType, category, size, color, priceRange, keyWord, eventId) => {
    try {
        if (!type) {
            return {
                DT: "",
                EC: -1,
                EM: 'Missing parameter!'
            }
        }
        else {

            let paginationData = {
                rowCount: 0,
                data: ''
            };

            let data = [];
            console.log('type', type)

            if (type === 'ALL') {
                data = await db.Clothes.findAll({

                    include: [{
                        model: db.Discount,
                        order: [['createdAt', 'DESC']],

                    },
                    {
                        model: db.Markdown,
                        attributes: ['id', 'contentMarkdown'],

                    },
                    {
                        model: db.RelevantImage,
                        attributes: ['id', 'image'],
                        order: [['id', 'ASC']],

                    },
                    {
                        model: db.Color_Size,
                        attributes: ['id', 'color', 'size', 'stock'],

                    }
                    ]
                })
            }

            else if (type === 'NEW') {
                data = await db.Clothes.findAll({
                    limit: 8,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: db.Discount,
                            attributes: ['id', 'value'],
                            include: [{ model: db.Event, attributes: ['header', 'title', 'action'], },],
                        },
                        {
                            model: db.Markdown,
                            attributes: ['id', 'contentMarkdown'],
                        },
                        {
                            model: db.RelevantImage,
                            attributes: ['id', 'image'],
                        },
                        {
                            model: db.Color_Size,
                            attributes: ['id', 'color', 'size', 'stock'],

                        },
                    ]

                })

            }

            else if (type === 'PAGINATION') {
                const { count, rows } = await db.Clothes.findAndCountAll({
                    offset: ((+page) - 1) * (+pageSize),
                    limit: +pageSize,
                    order: [["id", "DESC"]],
                    distinct: true,
                    where: {
                        category: (category && category !== 'ALL') ? category : { [Op.ne]: null },
                        type: clothesType ? clothesType : { [Op.ne]: null },
                        price: priceRange ? { [Op.between]: priceRange } : { [Op.ne]: null },
                        name: keyWord ?
                            { [Op.or]: keyWord.map(word => ({ [Op.iLike]: `%${word}%` })) } :
                            { [Op.ne]: null },
                    },

                    include: [
                        {
                            model: db.Discount,
                            order: [['createdAt', 'DESC']],
                            include: [{ model: db.Event, attributes: ['header', 'title', 'action'], },],

                            where: {
                                eventId: eventId ? eventId : { [Op.ne]: null },
                            }
                        },
                        {
                            model: db.Markdown,
                            attributes: ['id', 'contentMarkdown'],

                        },
                        {
                            model: db.RelevantImage,
                            attributes: ['id', 'image'],

                        },
                        {
                            model: db.Color_Size,
                            attributes: ['id', 'color', 'size', 'stock'],
                            where: {
                                color: color ? color : { [Op.ne]: null },
                                size: size ? size : { [Op.ne]: null }
                            }

                        }
                    ],
                })
                console.log(rows);

                paginationData.data = rows;
                paginationData.rowCount = count;

            }
            else if (type === 'ONE') {
                data = await db.Clothes.findOne({
                    where: { id: id },
                    include: [{
                        model: db.Discount,
                        attributes: ['id', 'value'],

                    },
                    {
                        model: db.Markdown,
                        attributes: ['id', 'contentMarkdown'],

                    },
                    {
                        model: db.RelevantImage,
                        attributes: ['id', 'image'],

                    },
                    {
                        model: db.Color_Size,
                        attributes: ['id', 'color', 'size', 'stock'],

                    }
                    ]

                })

            }

            else if (type === 'BEST') {
                let topData = await db.Review.findAll({
                    attributes: ['id', 'clothesId'],
                    raw: true
                });
                let countsData = {}
                topData.map(item => {
                    countsData[item.clothesId] = (countsData[item.clothesId] || 0) + 1;
                })

                let sortable = [];

                for (let item in countsData) {
                    sortable.push([item, countsData[item]]);
                }

                sortable.sort(function (a, b) {
                    return b[1] - a[1];
                });


                for (let i = 0; i < sortable.length; i++) {
                    let clothes = await db.Clothes.findOne({
                        where: { id: +sortable[i][0] },
                        include: [{
                            model: db.Discount,
                            attributes: ['id', 'value'],
                        },
                        {
                            model: db.Markdown,
                            attributes: ['id', 'contentMarkdown'],

                        },
                        {
                            model: db.RelevantImage,
                            attributes: ['id', 'image'],

                        },
                        {
                            model: db.Color_Size,
                            attributes: ['id', 'color', 'size', 'stock'],

                        }]

                    })
                    if (clothes) {
                        clothes.setDataValue('total', sortable[i][1])
                        data.push(clothes)
                    }
                }

                if (data.length === 0) {
                    data = await db.Clothes.findAll({
                        limit: 8,
                        order: [['createdAt', 'DESC']],

                        include: [{
                            model: db.Discount,
                            attributes: ['id', 'value'],

                        },
                        {
                            model: db.Markdown,
                            attributes: ['id', 'contentMarkdown'],

                        },
                        {
                            model: db.RelevantImage,
                            attributes: ['id', 'image'],

                        },
                        {
                            model: db.Color_Size,
                            attributes: ['id', 'color', 'size', 'stock'],

                        }
                        ]

                    })
                }


            }
            else {
                return {
                    DT: '',
                    EC: -1,
                    EM: 'Type is not exist!'
                }
            }

            if (type === 'PAGINATION') {

                paginationData.data = sortArrImageById(paginationData.data);
                return {
                    DT: paginationData,
                    EC: 0,
                    EM: 'Done!'
                }
            }


            else {

                let clothesData = data;
                if (_.isArray(clothesData)) {
                    clothesData = sortArrImageById(clothesData);
                }

                return {
                    DT: clothesData,
                    EC: 0,
                    EM: 'Done!'
                }
            }



        }
    } catch (e) {
        console.log(e);
        return {
            DT: "",
            EC: -1,
            EM: 'Err from sever service...'
        }
    }
}

const updateClothesService = async (type, data) => {
    try {
        if (!data || !type || !data.id
            // || !data.id || !data.category || !data.contentMarkdown || !data.discount
            // || !data.stockData || !data.imgArray || !data.name || !data.type
            // || !data.price
        ) {
            return {
                DT: "",
                EC: -1,
                EM: 'Missing parameter!'
            }
        }
        else {
            if (type === 'OTHER') {
                let clothes = await db.Clothes.findOne({
                    where: { id: data.id }
                })

                if (clothes && clothes.id) {
                    await clothes.set({
                        name: data.name,
                        type: data.type,
                        category: data.category,
                        price: data.price
                    })

                    await clothes.save();

                    if (data.color_size) {
                        await db.Color_Size.destroy({ where: { clothesId: data.id } })

                        let stockData = data.color_size.map(item => {
                            item.clothesId = data.id;
                            return item;
                        })

                        await db.Color_Size.bulkCreate(stockData);

                        let discount = await db.Discount.findOne({ where: { clothesId: data.id } })
                        if (discount && discount.id) {

                            discount.value = data.discount;
                            await discount.save();

                            let markdown = await db.Markdown.findOne({ where: { clothesId: data.id } });

                            if (markdown && markdown.id) {
                                markdown.contentMarkdown = data.contentMarkdown;
                                await markdown.save();

                                return {
                                    DT: "",
                                    EC: 0,
                                    EM: 'Completed!'
                                }

                            }
                            else {
                                return {
                                    DT: "",
                                    EC: -1,
                                    EM: 'Cant not find markdown value!'
                                }
                            }
                        }
                        else {
                            return {
                                DT: "",
                                EC: -1,
                                EM: 'Cant not find discount value!'
                            }
                        }
                    }

                    else {
                        return {
                            DT: "",
                            EC: -1,
                            EM: 'Cant not find stock data!'
                        }
                    }

                }
                else {
                    return {
                        DT: "",
                        EC: -1,
                        EM: 'Can not find clothes!'
                    }
                }
            }


            else if (type === 'IMG') {
                // Xóa ảnh cũ trong database
                const oldImages = await db.RelevantImage.findAll({ where: { clothesId: data.id } });
                const uploadsDir = config.UPLOADS_DIR;
                // Xóa file vật lý
                oldImages.forEach(img => {
                    if (img.image && typeof img.image === 'string') {
                        const filePath = path.join(uploadsDir, path.basename(img.image));
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    }
                });
                await db.RelevantImage.destroy({ where: { clothesId: data.id } });

                // Lưu ảnh mới
                let imgArrToStore = [];
                if (data && data.imageArr) {
                    data.imageArr.forEach((base64Img, idx) => {
                        const match = /^data:(image\/[a-zA-Z]+);base64,(.+)$/.exec(base64Img);
                        if (!match) return;
                        const mimeType = match[1];
                        const ext = mimeType.split('/')[1];
                        const base64Data = match[2];
                        const fileName = `clothes_${data.id}_${Date.now()}_${idx}.${ext}`;
                        const filePath = path.join(uploadsDir, fileName);
                        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                        const relativePath = `/uploads/${fileName}`;
                        imgArrToStore.push({
                            clothesId: data.id,
                            image: relativePath
                        });
                    });
                }
                await db.RelevantImage.bulkCreate(imgArrToStore);

                return {
                    DT: "",
                    EC: 0,
                    EM: 'Completed!'
                }

            }
        }
    } catch (e) {
        console.log(e);
        return {
            DT: "",
            EC: -1,
            EM: 'Err from sever service...'
        }
    }
}

const deleteClothesService = async (id) => {
    try {
        if (!id) {
            return {
                DT: "",
                EC: -1,
                EM: 'Missing parameter!'
            }
        }
        else {

            let clothes = await db.Clothes.findOne({ where: { id: id } });

            if (clothes && clothes.id) {
                await db.Clothes.destroy({ where: { id: id } })
                await db.Discount.destroy({ where: { id: id } })
                await db.RelevantImage.destroy({ where: { id: id } })
                await db.Color_Size.destroy({ where: { id: id } })

                return {
                    DT: "",
                    EC: 0,
                    EM: 'Delete clothes completed!'
                }
            }
            else {
                return {
                    DT: "",
                    EC: -1,
                    EM: 'Can not find clothes!'
                }
            }


        }

    } catch (e) {
        console.log(e);
        return {
            DT: "",
            EC: -1,
            EM: 'Err from sever service...'
        }
    }
}

module.exports = {
    createClothesService, getClothesService, updateClothesService, deleteClothesService, convertClothesImgArray
}