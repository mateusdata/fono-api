const { z, ZodError } = require('zod');
const Session = require('../models/Session');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const Protocol = require('../models/Protocol');
const ExercisePlan = require('../models/ExercisePlan');
const Exercise = require('../models/Exercise');

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
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async lastSessions(req, res) {
        const limit = req.query.pageSize; // number of records per page
        const offset = (req.query.page - 1) * req.query.pageSize;

        const sessions = await Session.findAndCountAll({
            limit: limit,
            offset: offset,
            attributes: { exclude: ['created_at', 'updated_at'] }
        });

        return res.status(200).send(sessions);
    }
}

module.exports = new SessionController();