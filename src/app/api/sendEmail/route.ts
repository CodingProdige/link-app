import { NextRequest, NextResponse } from 'next/server';
import transporter from '@/lib/nodemailer';

interface EmailTemplate {
    to: string;
    subject: string;
    message: string;
}

export const POST = async (req: NextRequest) => {
    if (req.method !== 'POST') {
        return new NextResponse('Method not allowed', { status: 405 });
    }

    try {
        const { to, subject, message }: EmailTemplate = await req.json();

        const mailOptions = {
            from: process.env.SMTP_USER, // Sender address
            to, // List of recipients
            subject, // Subject line
            text: message, // Plain text body
        };

        await transporter.sendMail(mailOptions);
        return new NextResponse(JSON.stringify({ message: 'Email sent' }), { status: 200 });
    } catch (error) {
        console.error('Failed to send email:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }
};
