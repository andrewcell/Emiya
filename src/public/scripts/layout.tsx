import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './materialui/Layout';
import {PageStatus} from './points/enums';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import {Typography} from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import {l} from './locale';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        button: {
            marginRight: theme.spacing(2)
        }
    })
)

interface CardButton {
    title: string;
    link: string;
}

interface CardProp {
    title: string;
    description: string;
    links: CardButton[];
    moreDescription: string;
}

const ModuleCard = (prop: CardProp): JSX.Element => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = (): void => {
        setExpanded(!expanded);
    }

    return (
        <Card className={classes.root}>
            <CardHeader title={prop.title} />
            <CardContent>
                {prop.description}
            </CardContent>
            <CardActions disableSpacing>
                {prop.links.map(button => {
                    return <Button color={'primary'} href={button.link} key={button.link}>{button.title}</Button>
                })}
                <IconButton className={clsx(classes.expand, {[classes.expandOpen]: expanded})} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout={'auto'} unmountOnExit>
                <CardContent>
                    <Typography>
                        {prop.moreDescription}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

const modules: CardProp[] = [
    {
        title: l('home.emibo.title'),
        description: l('home.emibo.description'),
        moreDescription: l('home.emibo.moredescription'),
        links: [
            {link: '/emibo', title: l('home.enter')},
            {link: '/emibo/menu', title: l('home.emibo.ranking')}
        ]
    },
    {
        title: l('home.villagers.title'),
        description: l('home.villagers.description'),
        moreDescription: l('home.villagers.moredescription'),
        links: [
            {link: '/villagers', title: l('home.enter')},
            {link: '/villagers/list', title: l('home.villagers.list')}
        ]
    },
    /* {
        title: l('home.campsite.title'),
        description: l('home.campsite.description'),
        moreDescription: l('home.campsite.moredescription'),
        links: [
            {link: '/campsite', title: l('home.enter')},
            {link: '/campsite/history', title: l('home.campsite.history')}
        ]
    },
    {
        title: l('home.points.title'),
        description: l('home.points.description'),
        moreDescription: l('home.points.moredescription'),
        links: [
            {link: '/points', title: l('home.enter')}
        ]
    }, */
    {
        title: l('home.translations.title'),
        description: l('home.translations.description'),
        moreDescription: l('home.translations.moredescription'),
        links: [
            {link: '/translate', title: l('home.enter')}
        ]
    },
    {
        title: l('home.about.title'),
        description: l('home.about.description'),
        moreDescription: l('home.about.moredescription'),
        links: [
            {link: '/info', title: l('home.enter')}
        ]
    }
]

const Element = (): JSX.Element => {
    return (
        <Container>
            <Grid container spacing={3}>
                {modules.map(module => {
                    return (
                        <Grid item key={module.title} xs={12}>
                            <ModuleCard title={module.title} description={module.description} links={module.links} moreDescription={module.moreDescription} />
                        </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

ReactDOM.render(<Layout content={<Element />} pageStatus={PageStatus.LOADED}/>, document.getElementById('app'));

/*
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
        localStorage.clear();
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
*/