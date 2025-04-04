

    import { config } from '../../config/app.config';
    import { resend } from './resendClient';

    type Params = {
        id?: string;
        to?: string;
        subject: string;
        text: string;
        html: string;
        from?: string;
    }

    type CreateEmailResponse = {
        data: {
            id: string | null; 
        };
        error: any;  
    };

    const mailer_sender = config.NODE_ENV === "development" ? `no-reply <onboarding@resend.dev>` : `no-reply <${config.MAILER_SENDER}>`
    const to_mailer = (to: string) => config.NODE_ENV === "development" ? "devlivered@resend.dev" : to;
   


    export const sendEmail = async ({ to, subject, text, html, from = mailer_sender, }: Params): Promise<CreateEmailResponse> => {
        to = to_mailer(to || '');
        try {
            const response = await resend.emails.send({
                from, 
                to,
                subject,
                html,
                text,
            });
            console.log('Email sent successfully:', response);
            if (response.data) {
            return {data: {id: response.data.id}, error: null}
        } else {
            return {data: { id: null}, error: null }
        }
        } catch (error) {
            console.error('Error sending email:', error);
            return {data: { id: '' }, error: error};
        }

    }