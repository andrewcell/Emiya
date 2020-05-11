import $ from 'jquery';
import M from 'materialize-css';
import {AJAX} from './ajax';
import {b64} from './b64';
$(() => {
    M.Modal.init($('.modal'));

    $('#loginbutton').on('click', async () => {
        const result = await AJAX.send($("#loginform").serialize(), new b64('L2FkbWluL2xvZ2lu'))
        switch (result) {
            case 'login00':
                location.reload();
            case 'login01':
                M.toast({html: 'Invalid Username or password.', classes: 'rounded'})
        }
        console.log(result)
    });
});

export {$}
