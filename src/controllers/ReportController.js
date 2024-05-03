const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');
const Pacient = require('../models/Pacient');
const Person = require('../models/Person');
const Questionnaire = require('../models/Questionnaire');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Section = require('../models/Section');
const S = require('string');
var locale_pt_br = require('dayjs/locale/pt-br');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const whois = require('../services/IdentityService');
const { z, ZodError } = require('zod');
const { formatPersonalId, personalIdType, filename, formatPhoneNumber } = require('../services/FormatterService');
const geoLookup = require('../services/LocationService');





class ReportController {
    async PacientReport(req, res) {
        const width = 595.28;
        const height = 841.89;


        const pacient = await Pacient.findByPk(req.params.id, {
            include: [Person]
        });

        if (!pacient) {
            return res.status(404).send({ message: 'Pacient not found' });
        }

        res.setHeader('Content-disposition', filename('relatorio_geral_paciente', pacient))
        res.setHeader('Content-type', 'application/pdf')

        let pdfDoc = new PDFDocument({
            size: 'A4',
            info: {
                Title: "Relatório Fonotherapp",
                Subject: "Relatório contendo informações básicas sobre o paciente e os questionários de análise funcional e estrutural",
                Author: "Fonotherapp Inc."
            },
            margins: {
                left: 60,
                top: 40,
                right: 40,
                bottom: 40,
            },
        });

        // Add rectangle to make it prettier
        pdfDoc.on('pageAdded', () => {
            pdfDoc.rect(30, 30, width - 60, height - 60).stroke();
        });

        const { outline } = pdfDoc;

        pdfDoc.pipe(res);


        const questionnaires = await Questionnaire.findAll({
            attributes: { exclude: ['created_at', 'updated_at'] },
            include: {
                model: Section,
                attributes: { exclude: ['created_at', 'updated_at'] },
                required: true,
                include: {
                    model: Question,
                    attributes: { exclude: ['qhs_id', 'created_at', 'updated_at'] },
                    required: true,
                    include: {
                        model: Answer,
                        attributes: { exclude: ['que_id', 'pac_id', 'created_at', 'updated_at'] },
                        required: true,
                        include: {
                            model: Pacient,
                            attributes: [],
                            required: true,
                            where: {
                                pac_id: req.params.id
                            }
                        }
                    }
                }
            }
        });

        pdfDoc.moveDown();
        pdfDoc.font('Helvetica').fontSize(25).fillColor('black').text('Relatório Fono', {
            align: 'center'
        });

        outline.addItem("Início");
        /**
        * Emit pageAdded event to trigger the reactangle that is around the page,
        * this is necessary because the document already has one page by default.
        */
        pdfDoc.emit('pageAdded');


        pdfDoc.translate(50, (height - 500) / 2)
            .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            .fill('non-zero');

        /*
        pdfDoc.image('/home/iky/Pictures/fono_1.jpeg', {
            align: "center",
        });
        */


        pdfDoc.addPage();
        pdfDoc.fontSize(12);
        pdfDoc.font('Helvetica').fillColor('black').text('Nome: ' + pacient.person.first_name);
        pdfDoc.font('Helvetica').fillColor('black').text('Cpf: ' + formatPersonalId(pacient.person.cpf));
        pdfDoc.font('Helvetica').fillColor('black').text('Data Nascimento: ' + dayjs(pacient.person.birthday).format('DD/MM/YYYY'));
        pdfDoc.moveDown();
        outline.addItem('Anamnese', { expanded: true });
        pdfDoc.fontSize(16);
        pdfDoc.font('Helvetica').fillColor('black').text('Anamnese');
        pdfDoc.moveDown();
        pdfDoc.fontSize(12);
        pdfDoc.font('Helvetica').fillColor('black').text('Educação: ' + pacient.education);
        pdfDoc.font('Helvetica').fillColor('black').text('Doenças básicas: ' + pacient.base_diseases);
        pdfDoc.font('Helvetica').fillColor('black').text('Razão da consulta: ' + pacient.consultation_reason);
        pdfDoc.font('Helvetica').fillColor('black').text('Perfil alimentar: ' + pacient.food_profile);
        pdfDoc.font('Helvetica').fillColor('black').text('Reclamações de deglutição: ' + pacient.chewing_complaint);
        pdfDoc.moveDown(2);



        questionnaires.forEach(questionnaire => {
            outline.addItem(questionnaire.name);
            pdfDoc.fontSize(16);
            pdfDoc.font('Helvetica').fillColor('black').text(questionnaire.name);

            questionnaire.sections.forEach(section => {
                pdfDoc.fontSize(14);
                pdfDoc.font('Helvetica').fillColor('black').text(section.name);
                pdfDoc.moveDown();
                section.questions.forEach(question => {
                    pdfDoc.fontSize(12);
                    pdfDoc.font('Helvetica').fillColor('black').text(question.name + ":");
                    question.alternatives.forEach(alternative => {
                        pdfDoc.font('Helvetica').fillColor('black').text((question.answer.alternative != alternative ? '[  ]' : '[x]') + '  ' + alternative, {
                            indent: 10
                        });
                    });
                    pdfDoc.moveDown();
                });

            })
        });


        pdfDoc.end();
    }

    async ServiceTerm(req, res) {
        const width = 595.28;
        const height = 841.89;

        const serviceSchema = z.object({
            price: z.string().transform((value)=>Number(value)).pipe(z.number().positive()),
            number_of_sessions: z.string().transform((value)=>Number(value)).pipe(z.number().positive().int()),
            lat: z.string().transform((value)=>Number(value)).pipe(z.number()).optional(),
            lon: z.string().transform((value)=>Number(value)).pipe(z.number()).optional(),
        });


        try {

            const serviceOptions = serviceSchema.parse(req.query);

            console.log(serviceOptions);
            const geoIpLocation = await geoLookup(serviceOptions.lat, serviceOptions.lon);
            const user = await User.findByPk(whois(req), { include: [Doctor, Person] });

            const pacient = await Pacient.findByPk(req.params.id, {
                include: [Person]
            });

            if (!pacient) {
                return res.status(404).send({ message: 'Pacient has not been found' });
            }

            res.setHeader('Content-disposition', filename('recibo_de_servico', pacient))
            res.setHeader('Content-type', 'application/pdf')

            let pdfDoc = new PDFDocument({
                size: 'A4',
                info: {
                    Title: "Recibo de Prestação de Serviço",
                    Subject: "Recibo de pretação de serviço entre fonoaudiólogo e paciente",
                    Author: "Fonotherapp Inc."
                },
                margins: {
                    left: 80,
                    top: 40,
                    right: 80,
                    bottom: 40,
                },
            });

            pdfDoc.on('pageAdded', () => {
                pdfDoc.rect(30, 30, width - 60, height - 60).stroke();
            });

            pdfDoc.pipe(res);

            /**
             * Emit pageAdded event to trigger the reactangle that is around the page,
             * this is necessary because the document already has one page by default.
             */
            pdfDoc.emit('pageAdded');

            let text = "Recebi(emos) de {{pacient_name}}, a importância de R$ {{price}} referente à {{number_of_sessions}} sessões de avaliação/terapia fonoaudiológica.";
            let followUp = "Para maior clareza firmo(amos) o presente recibo para que produza os seus efeitos, dando plena e irrevogável quitação, pelo valor recebido.";
            let dateText = "{{city_name}}, {{day}} de {{month_name}} de {{year}}.";



            const values = {
                pacient_name: pacient?.person?.full_name,
                pacient_id: formatPersonalId(pacient?.person?.cpf),
                pacient_id_type: formatPersonalId(pacient?.person?.cpf),
                price: serviceOptions.price.toFixed(2).toLocaleString('pt-BR'),
                number_of_sessions: serviceOptions.number_of_sessions,
            }

            const dateInfo = {
                city_name: geoIpLocation?.address?.town || '____________________________',
                day: dayjs().format('DD'),
                month_name: S(dayjs().locale(locale_pt_br).format('MMMM')).capitalize(),
                year: dayjs().format('YYYY')
            }


            const doctorIdInfoTemplate = '{{personal_id_type}} - {{personal_id}}';
            const doctorIdInfoData = {
                personal_id_type: personalIdType(user?.person?.cpf || user?.doctor?.gov_license),
                personal_id: formatPersonalId(user?.person?.cpf || user?.doctor?.gov_license) || "___________",
            }

            if (!pacient) {
                return res.status(404).send({ message: 'Person not found' });
            }

            pdfDoc.moveDown(5);
            pdfDoc.fontSize(14);
            pdfDoc.text('Recibo de Prestação de Serviço', { align: 'center' });
            pdfDoc.moveDown(10);

            pdfDoc.fontSize(12);
            pdfDoc.text(S(text).template(values).toString(), { align: 'justify' });
            pdfDoc.text(followUp);
            pdfDoc.moveDown(5);
            pdfDoc.text(S(dateText).template(dateInfo).toString(), { align: 'center' });
            pdfDoc.moveDown(5);
            pdfDoc.text('__________________________________', { align: 'center' });
            pdfDoc.text('Fonoaudióloga(o)', { align: 'center' });
            pdfDoc.moveDown(1);
            pdfDoc.text(S(doctorIdInfoTemplate).template(doctorIdInfoData).toString(), { align: 'center' });

            pdfDoc.end();
        } catch (error) {
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async FollowupReport(req, res) {
        const reportSchema = z.object({
            diagnoses: z.string().max(350),
            structural_assessment: z.string().max(500),
            functional_assessment: z.string().max(500),
            swallowing_assessment: z.string().max(500),
            general_guidelines: z.string().max(500),
            conclusion: z.string().max(500),
            next_steps: z.string().max(500)
        });

        const width = 595.28;
        const height = 841.89;

        try {

            const doctorAssessment = reportSchema.parse(req.query);

            //const geoIpLocation = geoIp2.lookup(req.ip);
            const user = await User.findByPk(whois(req), { include: [Doctor, Person] });
            const pacient = await Pacient.findByPk(req.params.id, { include: Person });


            if (!pacient) {
                return res.status(404).send({ message: 'Pacient has not been found' });
            }

            res.setHeader('Content-disposition', filename('relatorio_acompanhamento', pacient))
            res.setHeader('Content-type', 'application/pdf')

            let pdfDoc = new PDFDocument({
                size: 'A4',
                info: {
                    Title: "Relatório de Acompanhamento",
                    Subject: "Relatório contendo dados de avaliação estrutural, funcional, parecer de deglutição, orientações geraism conclusão e encaminhamentos",
                    Author: "Fonotherapp Inc."
                },
                margins: {
                    left: 80,
                    top: 40,
                    right: 80,
                    bottom: 40,
                },
            });

            pdfDoc.on('pageAdded', () => {
                pdfDoc.rect(30, 30, width - 60, height - 60).stroke();
            });

            pdfDoc.pipe(res);

            /**
            * Emit pageAdded event to trigger the reactangle that is around the page,
            * this is necessary because the document already has one page by default.
            */
            pdfDoc.emit('pageAdded');

            const pacientTemplate = "Paciente: {{pacient_full_name}}\nCpf: {{personal_id}}\nData de Admissão: {{addmission_date}}";
            const pacientData = {
                pacient_full_name: pacient?.person?.full_name,
                personal_id: formatPersonalId(pacient?.person?.cpf),
                addmission_date: dayjs(pacient.created_at).format('DD/MM/YYYY')
            };

            const clinicalHistoryTemplate = "Paciente, {{pacient_age}} anos, apresenta os seguintes diagnósticos: {{diagnoses}}. Encontra-se em acompanhamento fonoaudiológico a {{duration_of_relation}}.";
            const clinicalHistoryData = {
                pacient_age: dayjs().diff(pacient?.person?.birthday, 'years'),
                diagnoses: doctorAssessment.diagnoses,
                duration_of_relation: dayjs().diff(pacient.created_at, 'days') + ' dias'
            };

            const doctorTemplate = "{{doctor_name}}\n{{personal_id_type}} - {{personal_id}}";
            const doctorData = {
                doctor_name: (user?.person != null ? user?.person?.first_name + " " + user?.person?.last_name : user?.nick_name) || '__________________________',
                personal_id_type: personalIdType(user?.person?.cpf || user?.doctor?.gov_license),
                personal_id: formatPersonalId(user?.person?.cpf || user?.doctor?.gov_license) || '__________________'
            }

            const assessmentSections = new Map();

            assessmentSections.set('Dados da Avaliação Estrutural', 'structural_assessment');
            assessmentSections.set('Dados da Avaliação Funcional', 'functional_assessment');
            assessmentSections.set('Parecer da Deglutição', 'swallowing_assessment');
            assessmentSections.set('Orientações gerais', 'general_guidelines');
            assessmentSections.set('Conclusão e conduta', 'conclusion');
            assessmentSections.set('Encaminhamentos', 'next_steps');


            pdfDoc.moveDown(5);
            pdfDoc.fontSize(14);
            pdfDoc.text('Relatório Acompanhamento', { align: 'center' });
            pdfDoc.moveDown(5);
            pdfDoc.fontSize(12);
            pdfDoc.text(S(pacientTemplate).template(pacientData).toString(), { align: 'left' });
            pdfDoc.moveDown(5);

            const { outline } = pdfDoc;

            pdfDoc.fontSize(14);
            pdfDoc.text('História Clínica:', { align: 'left' });
            pdfDoc.moveDown(1);
            pdfDoc.rect(60, pdfDoc.y, 480, 100).stroke();
            pdfDoc.fontSize(12);
            pdfDoc.moveDown(1);
            pdfDoc.text(S(clinicalHistoryTemplate).template(clinicalHistoryData).toString(), { align: 'justify' });
            pdfDoc.moveDown(12);

            assessmentSections.forEach((value, key) => {
                const allowedHeight = height - pdfDoc.y;

                if (allowedHeight < 210) {
                    pdfDoc.addPage();
                }

                pdfDoc.fontSize(14);
                pdfDoc.text(`${key}:`, { align: 'left' });
                pdfDoc.moveDown(1);
                pdfDoc.rect(60, pdfDoc.y, 480, 180).stroke();
                pdfDoc.moveDown(1);
                pdfDoc.fontSize(12);
                pdfDoc.text(doctorAssessment[value], { align: 'justify' });
                pdfDoc.moveDown(12);
                /**
                 * Add to the navegation bar
                 */
                outline.addItem(key);
            })

            pdfDoc.text('__________________________________', { align: 'center' });
            pdfDoc.moveDown();
            pdfDoc.text(S(doctorTemplate).template(doctorData).toString(), { align: 'center' });
            outline.addItem('Assinatura');

            pdfDoc.end();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }

    async DischargeReport(req, res) {
        const DischargeReportSchema = z.object({
            medical_diagnoses: z.string().max(500),
            how_it_was_discovered: z.string().max(500),
            first_session_findings: z.string().max(500),
            therapeutic_plan: z.string().max(500),
            patients_progress: z.string().max(500),
            current_condition: z.string().max(500),
            referrals: z.string().max(500),
            lat: z.string().transform((value)=>Number(value)).pipe(z.number()).optional(),
            lon: z.string().transform((value)=>Number(value)).pipe(z.number()).optional(),
        });

        const width = 595.28;
        const height = 841.89;

        try {
            const DischargeReport = DischargeReportSchema.parse(req.query);
            const user = await User.findByPk(whois(req), { include: [Doctor, Person] });
            const pacient = await Pacient.findByPk(req.params.pac_id, { include: Person });
            const geoIpLocation = await geoLookup(DischargeReport.lat, DischargeReport.lon);

            if (!pacient) {
                return res.status(404).send({ message: 'Pacient has not been found' });
            }

            res.setHeader('Content-disposition', filename('relatorio_de_alta', pacient))
            res.setHeader('Content-type', 'application/pdf')

            let pdfDoc = new PDFDocument({
                size: 'A4',
                info: {
                    Title: "Relatório de Alta",
                    Subject: "Relatório contendo dados sobre o paciente e conclusoẽs para a alta do paciente",
                    Author: "Fonotherapp Inc."
                },
                margins: {
                    left: 80,
                    top: 40,
                    right: 80,
                    bottom: 40,
                },
            });


            pdfDoc.on('pageAdded', () => {
                pdfDoc.rect(30, 30, width - 60, height - 60).stroke();
            });

            pdfDoc.pipe(res);

            /**
            * Emit pageAdded event to trigger the reactangle that is around the page,
            * this is necessary because the document already has one page by default.
            */
            pdfDoc.emit('pageAdded');

            pdfDoc.moveDown(5);
            pdfDoc.fontSize(14);
            pdfDoc.text('Relatório de Alta', { align: 'center' });
            pdfDoc.moveDown(5);
            const template = `Paciente {{pacient_name}}, {{pacient_age}} ano(s), {{medical_diagnoses}}. O tratamento fonoaudiológico teve início no dia {{treatment_begin_date}},  encontrava-se em uso de SNG/SNE/GTT ou ALIMENTAÇÃO EXCLUSIVA VIA ORAL, {{how_it_was_discovered}}. {{first_session_findings}}. {{therapeutic_plan}}.
            {{patients_progress}}. {{current_condition}}. {{referrals}}. À disposição, `;

            const reportData = {
                ...DischargeReport,
                pacient_name: pacient?.person?.full_name,
                pacient_age: dayjs().diff(pacient?.person?.birthday, 'years'),
                treatment_begin_date: dayjs(pacient.created_at).format('DD/MM/YYYY'),
            };

            const contactInfoTemplate = `{{doctor_name}} {{gov_license}}\n{{phone_number}}`
            const contactData = {
                doctor_name: user?.person?.full_name ?? "Dr. Coca Cola",
                gov_license: user?.doctor?.gov_license ?? "14580",
                phone_number: formatPhoneNumber("75900000000"),
            }

            const cityTemplate = `{{city_name}}, {{day}} de {{month_name}} de {{year}}`;
            const cityData = {
                city_name: geoIpLocation?.address?.town || '_______________________',
                day: dayjs().format('DD'),
                month_name: S(dayjs().locale(locale_pt_br).format('MMMM')).capitalize().toString(),
                year: dayjs().format('YYYY')
            }
            pdfDoc.fontSize(12);
            pdfDoc.text(S(template).template(reportData).toString(), { align: 'justify', lineGap: 10 });
            pdfDoc.moveDown(1);
            pdfDoc.text('__________________________________', { align: 'center' });
            pdfDoc.moveDown(0.5);  
            pdfDoc.text(S(contactInfoTemplate).template(contactData).toString(), { align: 'center' });
            pdfDoc.moveDown(2);           
            pdfDoc.text(S(cityTemplate).template(cityData).toString(), { align: 'center' });
            pdfDoc.end();


        } catch (error) {
            console.log(error);
            return res.status(500).send(error instanceof ZodError ? error : 'Server Error');
        }
    }
}

module.exports = new ReportController();