import $ from 'jquery';
import M from 'materialize-css';
$(() => {
    $('#loginbutton').click(() => {
        $.ajax({
            type: 'POST',
            url: atob('L2FkbWluL2xvZ2lu'),
            data: $("#loginform").serialize(),
            success: (data) => {
                switch (data.error) {
                    case true:
                        M.toast({html: data.message, classes: "rounded"});
                        break;
                    case false:
                        location.reload();
                        break;
                }
            },
            error: (err) => {
                M.toast({html: err.statusText, classes: 'rounded'});
            }
        });
    });
});
