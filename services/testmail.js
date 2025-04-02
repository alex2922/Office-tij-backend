import { sentOTP } from './emailService.js';




const testEmail = async () => {
    try {
        const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const testRecipient = 'useless2922@gmail.com';

        const result = await sentOTP(testRecipient, testOTP);
        console.log( result ? 'Test email sent successfully' : 'Failed to send test email');
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}

testEmail();