const { z, ZodError } = require('zod');
const Session = require('../models/Session');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const Protocol = require('../models/Protocol');
const ExercisePlan = require('../models/ExercisePlan');
const Exercise = require('../models/Exercise');
const { Op } = require('sequelize');

dayjs.extend(duration);


class SessionController {

    async create(req, res) {
        const createSchema = z.object({
            pac_id: z.number().int().positive(),
        });


        try {
            const session = await Session.create(createSchema.parse(req.body));

            if (session) {
                return res.status(200).send(session);
            }

        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async info(req, res) {

        try {
            const session = await Session.findByPk(req.params.id, {
                include: {
                    model: Protocol,
                    attributes: { exclude: ['created_at', 'updated_at'] },
                    include: {
                        model: ExercisePlan,
                        attributes: { exclude: ['pro_id', 'created_at', 'updated_at'] },
                        include: {
                            attributes: { exclude: ['created_at', 'updated_at'] },
                            model: Exercise
                        }
                    }
                },
                attributes: { exclude: ['created_at', 'updated_at'] }
            });

            if (session) {

                return res.status(200).send(session);
            }

            return res.status(404).send({ message: 'Session not found' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async update(req, res) {
        const updateSchema = z.object({
            comments: z.string(),
        });

        try {
            const session = await Session.findByPk(req.params.id, { attributes: { exclude: ['created_at', 'updated_at'] }, having: { end: null } })
                .then((ses) => ses.update(updateSchema.parse(req.body)));

            if (session) {
                return res.status(200).send(session);
            }

            return res.status(403).send({ message: 'Session could not be created' });
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async end(req, res) {

        try {

            const session = await Session.findByPk(req.params.id, { attributes: { exclude: ['created_at', 'updated_at'] } })
                .then((ses) => ses.update({ end: dayjs().toISOString(), duration: dayjs.duration(dayjs(new Date()).diff(ses.begin)).format('HH:mm:ss') }));

            if (session) {
                return res.status(200).send(session);
            }

            return res.status(200).send({ message: 'Session could not be ended' });
        } catch (error) {
            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async lastSessions(req, res) {
        const listSchema = z.object({
            pageSize: z.coerce.number().positive(),
            page: z.coerce.number().positive(),
        });

        try {
            const { pageSize, page } = listSchema.parse(req.query);
            const limit = pageSize; // number of records per page
            const offset = (page - 1) * pageSize;

            const sessions = await Session.findAndCountAll({
                limit: limit,
                offset: offset,
                attributes: { exclude: ['created_at', 'updated_at'] },
                include:{
                    model: Protocol,
                    where:{
                        doc_id: req.params.doc_id,
                    }
                },
                where: {
                    pac_id: req.params.pac_id,
                }
            });

            return res.status(200).send(sessions);
        } catch (error) {
            
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }

    }
}

module.exports = new SessionController();