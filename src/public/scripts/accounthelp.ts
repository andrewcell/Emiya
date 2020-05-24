import $ from 'jquery';
import {encrypt, decrypt} from './encryption/AES';
import axios from 'axios';
import M from 'materialize-css';

$(() => {
    const resetPasswordButton = $('#resetButton');
    const resendEmailButton = $('#resendButton');
    const resetPasswordInput = $('#resetEmail');
    const resendEmailInput = $('#resendEmail');

    const send = (url: string, value: string) => {
        const encrypted = encrypt(`{"email": "${value}"}`);
        axios.post('/admin/help/' + url, {data: encrypted}).then(res => {
            M.toast({html: res.data.comment, classes: 'rounded'})
        }).catch(err => {
            M.toast({html: 'Internal Server Error.', classes: 'rounded'});
        });
    }
    resetPasswordButton.on('click', () => {
        send('resetpassword', resetPasswordInput.val() as string);
    });

    resendEmailButton.on('click', () => {
        send('resend', resendEmailInput.val() as string);
    });
});
