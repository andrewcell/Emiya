import $ from 'jquery';
import M from 'materialize-css';
import {AJAX, AjaxResult} from './ajax';
import {Register} from './register';
import {b64} from './b64';
import axios from 'axios';
import { encrypt } from './encryption/AES';

$(() => {
    const registerPassword: JQuery<HTMLElement> = $('#register-modal #password');
    const registerPassword2: JQuery<HTMLElement> = $('#register-modal #password2');
    const registerUsername: JQuery<HTMLElement> = $('#register-modal #username');
    const registerEmail: JQuery<HTMLElement> = $('#register-modal #email');


    const checkPassword = (): void => {
        if (Register.checkPassword(registerPassword.val() as string, registerPassword2.val() as string)) {
            registerPassword2.removeClass('invalid').addClass('valid')
        } else {
            registerPassword2.removeClass('valid').addClass('invalid')
        }
    }

    const validatePassword = (): void => {
        if (Register.validatePassword(registerPassword.val() as string)) {
            registerPassword.removeClass('invalid').addClass('valid')
        } else {
            registerPassword.removeClass('valid').addClass('invalid')
        }
    }

    const disableButton = (button: JQuery<HTMLElement>): void => {
        button.prop('disabled', true);
    }

    const enableButton = (button: JQuery<HTMLElement>): void => {
        button.prop('disabled', false);
    }

    const checkInputValid = (): boolean => {
        return registerEmail.hasClass('valid') && registerPassword.hasClass('valid') &&
            registerPassword2.hasClass('valid');// && registerUsername.hasClass('valid');
    }

    M.Modal.init($('.modal'));
    M.Sidenav.init($('.sidenav'));

    $('#loginbutton').on('click', () => {
        disableButton($('#loginbutton'));
        AJAX.send($('#loginform').serialize(), new b64('L2FkbWluL2xvZ2lu'))
            .then((result: AjaxResult) => {
                switch (result.code as string) {
                    case 'login00':
                        localStorage.setItem('token', result.comment)
                        location.reload()
                        break;
                    case 'login01':
                        M.toast({html: result.comment, classes: 'rounded'});
                        break;
                    case '500':
                        M.toast({html: result.comment, classes: 'rounded'});
                        break;
                }
                enableButton($('#loginbutton'));
            })
    });

    $('#registerButton').on('click', () => {
        if (checkInputValid()) {
            disableButton($('#registerButton'));
            Register.register(registerUsername.val() as string, registerPassword.val() as string, registerPassword2.val() as string, registerEmail.val() as string)
                .then(result => {
                    M.toast({html: result.comment, classes: 'rounded'});
                    if (result.code === 'register07') {
                        const modal = document.querySelector('#register-modal');
                        if (modal != null) {
                            M.Modal.getInstance(modal).close();
                        }
                    } else {
                        enableButton($('#registerButton'));
                    }
                });
        } else {
            enableButton($('#registerButton'));
        }
    });

    $('#saveButton').on('click', () => {
        const language = $('input[name=language]:checked')
        axios.post('/admin/config', {data: encrypt(JSON.stringify({language: language.val()}))}).then(res => {
            M.toast({html: res.data.comment, classes: 'rounded'});
        }).catch(() => {
            M.toast({html: 'Internal Server Error.', classes: 'rounded'});
        });
    });

    $('#logoutButton').on('click', () => {
        window.location.replace('/admin/logout');
    });

    $('#password').on('focusout', () => {
        checkPassword();
    });

    registerPassword.on('keyup', () => {
        validatePassword();
    });

    $('#password2').on('keyup', () => {
        checkPassword();
    });

    let lastTime = Date.now() + 1500;

    $('#login-modal #password').keydown(e => {
        if (lastTime+1500 <= Date.now()) {
            if (e.keyCode === 13) {
                $('#loginbutton').click();
                lastTime = Date.now();
            }
        }
    });
});


export {$}
