import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';

// Function to render an EJS template
const renderTemplate = (templateName, data) => {
    const templatePath = path.resolve('./src/templates', `${templateName}.ejs`);
    const templateString = fs.readFileSync(templatePath, 'utf-8');
    return ejs.render(templateString, data);
};

export const POST = async (req: NextRequest) => {
    try {
        const { ishtml, to, subject, message, template, templateData } = await req.json();

        // Determine the email body based on the template
        let emailBody;
        if (template) {
            emailBody = renderTemplate(template, templateData);
        } else {
            emailBody = message;
        }

        const options = {
            method: 'POST',
            url: 'https://rapidmail.p.rapidapi.com/',
            headers: {
                'x-rapidapi-key': 'd3b93d1707mshfb683fe0e06c157p1fbff9jsn1620559177e4',
                'x-rapidapi-host': 'rapidmail.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                ishtml: ishtml, // Ensure this is set to true for HTML content
                sendto: to,
                name: 'Fanslink',
                replyTo: 'info@fansl.ink', // assuming this is your reply-to email
                title: subject,
                body: emailBody // Set the email body to the rendered HTML
            }
        };

        const response = await axios.request(options);
        console.log(response.data);

        return new NextResponse(JSON.stringify({ message: 'Email sent', data: response.data }), { status: 200 });
    } catch (error) {
        console.error('Failed to send email:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to send email', message: error.message }), { status: 500 });
    }
};
