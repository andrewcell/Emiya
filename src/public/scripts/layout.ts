import $ from 'jquery';
import M from 'materialize-css';
import {AJAX, AjaxResult} from './ajax';
import {Register, RegisterCode} from './register';
import {b64} from './b64';

$(() => {
    const registerPassword: JQuery<HTMLElement> = $('#register-modal #password');
    const registerPassword2: JQuery<HTMLElement> = $('#register-modal #password2');
    const registerUsername: JQuery<HTMLElement> = $('#register-modal #username');
    const registerEmail: JQuery<HTMLElement> = $('#register-modal #email');


    const checkPassword = () => {
        console.log(registerPassword.val())
        if (Register.checkPassword(registerPassword.val() as string, registerPassword2.val() as string)) {
            registerPassword2.removeClass('invalid').addClass('valid')
        } else {
            registerPassword2.removeClass('valid').addClass('invalid')
        }
    }

    const validatePassword = () => {
        if (Register.validatePassword(registerPassword.val() as string)) {
            registerPassword.removeClass('invalid').addClass('valid')
        } else {
            registerPassword.removeClass('valid').addClass('invalid')
        }
    }

    M.Modal.init($('.modal'));
    M.Sidenav.init($('.sidenav'));

    $('#loginbutton').on('click', async () => {
        const result: AjaxResult = await AJAX.send($("#loginform").serialize(), new b64('L2FkbWluL2xvZ2lu'))
        switch (result.code as string) {
            case 'login00':
                location.reload()
                break;
            case 'login01':
                M.toast({html: result.comment, classes: 'rounded'});
                break;
            case '500':
                M.toast({html: result.comment, classes: 'rounded'});
                break;
        }
        console.log(result)
    });

    $('#registerButton').on('click', async () => {
        if ($('#register-modal input').hasClass('valid')) {
            const result = await Register.register(registerUsername.val() as string, registerPassword.val() as string, registerPassword2.val() as string, registerEmail.val() as string);
            if (result.code === 'register07') {
                M.Modal.getInstance(document.querySelector('#register-modal')!).close()
            }
            M.toast({html: result.comment, classes: 'rounded'});
        }
    });

    $('#password').on('focusout', () => {
        checkPassword();
    });

    registerPassword.on('keyup', () => {
        validatePassword();
    })
    $('#password2').on('keyup', () => {
        checkPassword();
    });
});



export {$}
