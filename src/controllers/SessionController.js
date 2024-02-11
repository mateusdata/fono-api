const { z, ZodError } = require('zod');
const Session = require('../models/Session');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc)
dayjs.extend(timezone)
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
        dayjs.tz.setDefault("America/Sao_Paulo");


        try {

            const session = await Session.findByPk(req.params.id, { attributes: { exclude: ['created_at', 'updated_at'] } })
                .then((ses) => ses.update({ end: dayjs().toISOString(), duration: dayjs.duration(dayjs(new Date()).diff(ses.begin)).format('HH:mm:ss') }));

            if (session) {
                return res.status(200).send(session);
            }

            console.log();

            return res.status(200).send({ message: 'Session could not be ended' });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

}

module.exports = new SessionController();