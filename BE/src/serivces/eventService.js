import { includes } from "lodash";
import db from "../models"
import { Op, where } from "sequelize";
import _ from "lodash";
import { sendSimpleEmail } from '../middleware/EmailService'

const createEventService = async (eventData) => {
    try {
        if (!eventData || !eventData.arrDiscountProductId || eventData.arrDiscountProductId.length === 0) {
            return {
                DT: '',
                EC: -1,
                EM: 'Err from event service: missing parameter!'
            }
        }
        else {


            let event = await db.Event.create({
                header: eventData.header,
                title: eventData.title,
                action: eventData.action,
                bannerImg: eventData.bannerImg,
                backdropImg: eventData.backdropImg
            })


            await db.Discount.update({
                value: eventData.discount,
                eventId: event.id,
                note: eventData.header
            }, {
                where: {
                    clothesId: eventData.arrDiscountProductId
                }
            });

            let users = await db.User.findAll({})

            if (users && users.length > 0) {

                users.map(item => {
                    setTimeout(() => {
                        sendSimpleEmail({
                            discount: eventData.discount,
                            receiverEmail: item.email,
                            bannerImg: eventData.bannerImg,
                            header: eventData.header ? eventData.header : 'New Event'
                        })
                    }, 500);

                })

            }

            return {
                DT: '',
                EC: 0,
                EM: 'Create event completed!'
            }




        }
    }
    catch (e) {
        console.log(e);
        return {
            DT: '',
            EC: -1,
            EM: 'Err from event service!'
        }
    }
}


const updateEventService = async (eventData) => {
    try {
        if (!eventData) {
            return {
                DT: '',
                EC: -1,
                EM: 'Err from event service: missing parameter!'
            }
        }
        else {
            console.log(eventData)
            let event = await db.Event.findOne({
                where: { id: eventData.id },

            })

            if (event) {

                event.header = eventData.header;
                event.title = eventData.title;
                event.action = eventData.action;
                event.bannerImg = eventData.bannerImg;
                event.backdropImg = eventData.backdropImg;

                await event.save();

                return {
                    DT: event.id,
                    EC: 0,
                    EM: 'Update event completed!'
                }
            }

        }
    }
    catch (e) {
        console.log(e);
        return {
            DT: '',
            EC: -1,
            EM: 'Err from event service!'
        }
    }
}

const convertBufferToBase64 = (eventData) => {

    eventData.map(item => {
        item.bannerImg = new Buffer(item.bannerImg, 'base64').toString('binary');
        item.backdropImg = new Buffer(item.backdropImg, 'base64').toString('binary');
        return item;
    })

    return eventData
}

const getEventService = async (type, eventId, page, pageSize) => {
    try {
        if (!type) {
            return {
                DT: '',
                EC: -1,
                EM: 'Err from event service: missing parameter!'
            }
        }
        else {
            if (type === 'ALL') {
                let event = await db.Event.findAll({
                    distinct: true,
                    order: [['createdAt', 'DESC']],
                    // include: [
                    //     {
                    //         model: db.Discount,
                    //         order: [['createdAt', 'DESC']],
                    //     },
                    // ]
                })

                let eventData = convertBufferToBase64(event);

                return {
                    DT: eventData,
                    EC: 0,
                    EM: 'Get event completed!'
                }

            }
            else if (type === 'PAGINATION') {

                const { count, rows } = await db.Event.findAndCountAll({
                    offset: (+page - 1) * (+pageSize),
                    limit: +pageSize,
                    distinct: true,
                    order: [["id", "DESC"]],
                    where: {
                        star: star ? star : { [Op.ne]: null },
                        clothesId: clothesId,

                    },
                    include: [
                        {
                            model: db.EventImage,
                            order: [['createdAt', 'DESC']],
                        },
                        {
                            model: db.User,
                            order: [['createdAt', 'DESC']],
                            attributes: {
                                exclude: ['password', 'createdAt', 'updatedAt']
                            }
                        },
                        {
                            model: db.Bill,
                            order: [['createdAt', 'DESC']],
                            include: [
                                {
                                    model: db.ShoppingCart,
                                    order: [['createdAt', 'DESC']],
                                    include: [
                                        {
                                            model: db.Color_Size,
                                            where: {
                                                size: size ? size : { [Op.ne]: null },
                                            }
                                        }]
                                }
                            ]
                        },
                    ],
                })

                let rowsIdValid = rows.filter(item => !_.isEmpty(item.Bill.ShoppingCarts))

                let eventData = convertBufferToBase64(rowsIdValid);

                return {
                    DT: {
                        rowCount: count,
                        data: eventData
                    },
                    EC: 0,
                    EM: 'Get event completed!'
                }

            }

            else {
                let event = await db.Event.findOne({
                    where: {
                        clothesId: clothesId,
                        userId: userId
                    },
                })


                return {
                    DT: event,
                    EC: 0,
                    EM: 'Get event completed!'
                }

            }



        }
    }
    catch (e) {
        console.log(e);
        return {
            DT: '',
            EC: -1,
            EM: 'Err from event service!'
        }
    }
}

const deleteEventService = async (id) => {
    try {
        if (!id) {
            return {
                DT: '',
                EC: -1,
                EM: 'Err from event service: missing parameter!'
            }
        }
        else {

            await db.Event.destroy({ where: { id: id } })


            await db.Discount.update({ eventId: -1 }, {
                where: { eventId: id }
            })


            return {
                DT: '',
                EC: 0,
                EM: 'Delete event completed!'
            }
        }
    }
    catch (e) {
        console.log(e);
        return {
            DT: '',
            EC: -1,
            EM: 'Err from event service!'
        }
    }
}
module.exports = {
    createEventService, getEventService, updateEventService, deleteEventService
}