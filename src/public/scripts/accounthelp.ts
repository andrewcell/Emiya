import $ from 'jquery';
import {encrypt, decrypt} from './encryption/AES';
import axios from 'axios';
import M from 'materialize-css';

const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$(() => {
    const resetPasswordButton = $('#resetButton');
    const resendEmailButton = $('#resendButton');
    const resetPasswordInput = $('#resetEmail');
    const resendEmailInput = $('#resendEmail');

    const send = (url: string, value: string): void => {
        const encrypted = encrypt(`{"email": "${value}"}`);
        axios.post('/admin/help/' + url, {data: encrypted}).then(res => {
            M.toast({html: res.data.comment, classes: 'rounded'})
        }).catch(err => {
            M.toast({html: 'Internal Server Error.', classes: 'rounded'});
        });
    }
    resetPasswordButton.on('click', () => {
        const value = resetPasswordInput.val() as string;
        if (validateEmail(value)) {
            resetPasswordButton.prop('disabled', true);
            send('resetpassword', resetPasswordInput.val() as string);
        }
    });

    resendEmailButton.on('click', () => {
        resendEmailButton.prop('disabled', true);
        send('resend', resendEmailInput.val() as string);
    });
});
