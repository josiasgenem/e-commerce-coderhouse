import nodemailer from 'nodemailer';
import * as config from '../config/environment.js'
import { usersDao } from '../persistence/factory.js';
import UsersRepository from '../persistence/repository/users/users.repository.js';
const userRepository = new UsersRepository();
import { generateResetPassToken } from '../helpers/helpers.js';
import { logger } from '../utils/logger.js';

export default class MailingService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.SMTP_SERVICE,
            secure: true,
            port: 465,
            auth: {
                user: config.SMTP_EMAIL,
                pass: config.SMTP_PASSWORD
            }
        })
    }

    async sendResetToken(email) {
        try {
            const user = await usersDao.getByEmail(email, true);
            if (!user) {
                logger.warn(`Someone tried to reset password, but email '${email}' does not exist!`);
                return { success: false, message: `Someone tried to reset password, but email '${email}' does not exist!` };
            }
            const repositoryUser = userRepository.formatFromDB(user).sanitize();
            logger.debug(`MailingService: sendResetToken: repositoryUser`, repositoryUser);

            const token = generateResetPassToken(repositoryUser);
            logger.debug(`MailingService: sendResetToken: token`, {token});
            
            const resetLink = `http://localhost:${config.PORT}/users/reset-password/${token}`
            const isEmailSent = this.transporter.sendMail({
                from: config.SMTP_EMAIL,
                to: user.email,
                subject: 'Coderhouse e-commerce password reset',
                html: `
                    <h1>Coderhouse e-commerce password reset</h1>
                    <p>Hi ${user.first_name},you are trying to reset your password.</p></br>
                    <p>Click on the next button please:</p></br>
                    <a href="${resetLink}"><button>Reset Password</button></a></br>
                    <p>Or copy next link and paste it in your browser: ${resetLink}</p>
                `
                })
                .then(resp => {
                    if (resp.rejected.length > 0) return true
                })
                .catch(err => {
                    logger.error('MailingService: sendResetPassword: Error', err)
                    return false;
                })
            // const isEmailSent = await this.#sendResetPasswordEmail(repositoryUser, token);
            // logger.debug('MailingService: resetPassword: isEmailSent', {isEmailSent: isEmailSent});

            if (!isEmailSent) return { success: false, message: 'An error ocurred when we tried to send reset password email. Please try again!' };
            logger.info(`Email to reset password sent to: ${email}`)
            return { success: true, message: `An email was sent to ${email} with a link to reset your password. Please, check your spam inbox!`}
        } catch (err) {
            throw err;
        }

    }

    async #sendResetPasswordEmail (user, token) {
        const resetLink = `http://localhost:${config.PORT}/users/reset-password/${token}`
        return this.transporter.sendMail({
            from: config.SMTP_EMAIL,
            to: user.email,
            subject: 'Coderhouse e-commerce password reset',
            html: `
            <h1>Coderhouse e-commerce password reset</h1>
            <p>Hi ${user.first_name},you are trying to reset your password.</p></br>
            <p>Click on the next button please:</p></br>
            <a href="${resetLink}><button">Reset Password</button></a></br>
            <p>Or copy next link and paste it in your browser: ${resetLink}</p>
            `
        })
        .then(resp => {
            if (resp.rejected.length > 0) return true
        })
        .catch(err => {
            logger.error('MailingService: sendResetPassword: Error', err)
            return false;
        })
    }

}