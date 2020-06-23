import $ from 'jquery';
import M from "materialize-css";
import axios from 'axios';
import {encrypt} from "../../shared/Encryption";

$(() => {
    const password1Input = $('#password1');
    const password2Input = $('#password2');
    const button = $('#button');
    button.on('click', () => {
        const pw = password1Input.val() as string;
        const pw2 = password2Input.val() as string;
        const hash = $('#hash').val() as string;
        const encrypted = encrypt(JSON.stringify({password1: pw, password2: pw2}));
        axios.post('/admin/help/resetpassword/' + hash, {data: encrypted}).then(res => {
            if (res.data.code === 'help00') {
                $('.row').remove();
                $('.container').append(`<h6>${res.data.comment}</h6>`)
            }
            M.toast({html: res.data.comment, classes: 'rounded'})
        }).catch(() => {
            M.toast({html: 'Internal Server Error.', classes: 'rounded'});
        });
    });
});
