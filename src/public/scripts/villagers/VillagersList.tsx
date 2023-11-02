/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import {VillagersListProp, SearchQuery, Query} from './interfaces';
import {l} from '../locale';
import VillagersSearch from './VillagersSearch';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentDots} from '@fortawesome/free-solid-svg-icons/faCommentDots';
import {faBirthdayCake} from '@fortawesome/free-solid-svg-icons/faBirthdayCake';
import VillagerDetail from './VillagerDetail';
import {List} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {getColorByColor, getHobby, getName, getPersonality, getPhrase, getStyle} from './Locales';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';

class VillagersList extends React.Component<VillagersListProp, SearchQuery> {
    constructor(prop: VillagersListProp) {
        super(prop);
        this.state = {
            personality: '',
            type: '',
            style: '',
            name: '',
            species: '',
            hobby: '',
            changed: false,
            dialog: false,
            phrase: '',
            snackbar: false,
            snackbarMessage: ''
        }
    }

    handleData = (data: Query): void => {
        if (data.personality != null) {
            this.setState({personality: data.personality, changed: true})
        }
        if (data.type != null && (data.type === 'A' || data.type === 'B')) {
            this.setState({type: data.type, changed: true});
        }
        if (data.style != null) {
            this.setState({style: data.style, changed: true});
        }
        if (data.name != null) {
            this.setState({name: data.name, changed: true});
        }
        if (data.species != null) {
            this.setState({species: data.species, changed: true});
        }
        if (data.hobby != null) {
            this.setState({hobby: data.hobby, changed: true});
        }
        if (data.phrase != null) {
            this.setState({phrase: data.phrase, changed: true});
        }
    }

    handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const code = event.currentTarget.value;
        void this.props.addVillager(code).then(comment => {
            this.setState({snackbar: true, snackbarMessage: comment});
        });
    }

    handleClickVillager = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, code: string): void => {
        this.setState({code, dialog: true})
    }

    getVillagerDetail = (code?: string): JSX.Element => {
        if (code != null && code === this.state.code) {
            return (
                <Dialog open={this.state.dialog} onClose={this.closeDialog} fullScreen>
                    <VillagerDetail code={code} handleClose={this.closeDialog} addVillager={this.props.addVillager} removeVillager={this.props.removeVillager} data={this.props.data} />
                </Dialog>
            )
        } else {
            return <></>
        }
    }

    closeDialog = (): void => {
        this.setState({dialog: false})
    }

    closeSnackbar = (event?: React.SyntheticEvent, reason?: string): void => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({snackbar: false});
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        let filtered: Villager[] = [];
        if (this.state.changed) {
            filtered = this.props.data.filter((it) => {
                let type = true;
                let style = true;
                let hobby = true;

                if (this.state.type !== '') {
                    type = it.subtype === this.state.type?.toUpperCase()
                }
                if (this.state.style !== '') {
                    style = (it.styles[0].toLowerCase() === this.state.style) || (it.styles[1].toLowerCase() === this.state.style)
                }
                if (this.state.hobby !== '') {
                    hobby = it.hobby.toLowerCase() === this.state.hobby;
                }
                return it.personality.toLowerCase().includes(this.state.personality) &&
                    type &&
                    style &&
                    hobby &&
                    (it.translations.uSen.toLowerCase().includes(this.state.name.toLowerCase()) || it.translations.kRko.includes(this.state.name) || it.translations.jPja.includes(this.state.name)) &&
                    (it.catchphrases.uSen.toLowerCase().includes(this.state.phrase.toLowerCase()) || it.catchphrases.kRko.includes(this.state.phrase) || it.catchphrases.jPja.includes(this.state.phrase)) &&
                    it.species.toLowerCase().includes(this.state.species)
            });
        }
        return (
            <div>
                <Snackbar open={this.state.snackbar} autoHideDuration={3000} onClose={this.closeSnackbar} message={this.state.snackbarMessage} action={
                    <IconButton size="small" color="inherit" onClick={this.closeSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                } />
                <VillagersSearch setData={this.handleData} />
                <List>
                    {filtered.map((v: Villager) => {
                        const name = getName(v);
                        const phrase = getPhrase(v);
                        return (
                            <>
                                <ListItem key={v.filename} button onClick={(e): void => this.handleClickVillager(e, v.filename)}>
                                    <ListItemIcon>
                                        <LazyLoadImage src={v.iconImage}  alt={v.filename} style={{width: 88, margin: 10, height: '100%'}}/>
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant={'h6'}>{name}</Typography>} secondary={
                                        <>
                                            <Typography style={{color: 'gray'}}>{l('villagers.list.personality')} :
                                                <Typography style={{color: 'black', display: 'inline'}}>{' ' + getPersonality(v.personality)} ({(v.subtype)}) &nbsp;</Typography>
                                                <Typography style={{color: 'gray', display: 'inline'}}>{l('villagers.list.hobby')} : </Typography>
                                                <Typography style={{color: 'blue', display: 'inline'}}>{getHobby(v.hobby)}</Typography>
                                            </Typography>
                                            <Typography style={{color: 'gray'}}>
                                                {l('villagers.list.style') + ' '}
                                                <Typography style={{color: 'black', display: 'inline'}}>
                                                    {getStyle(v, 0)} / {getStyle(v, 1)}
                                                </Typography>
                                            </Typography>
                                            <Typography style={{color: 'gray'}}>
                                                {l('villagers.list.color') + ' '}
                                                <Typography style={{color: 'black', display: 'inline'}}>
                                                    {getColorByColor(v.colors[0])} / {getColorByColor(v.colors[1])}
                                                </Typography>
                                            </Typography>
                                            <Typography variant={'caption'}>
                                                <FontAwesomeIcon icon={faCommentDots} /> {phrase + ' '}
                                                <FontAwesomeIcon icon={faBirthdayCake} />
                                                {' '+v.birthday}
                                            </Typography>
                                        </>
                                    }>
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <IconButton edge={'end'} onClick={this.handleClick} value={v.filename}>
                                            <AddIcon fontSize={'large'} />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider component="li" />
                            </>
                        )
                    })}

                </List>
                {this.getVillagerDetail(this.state.code)}
            </div>
        )
    }
}

export default VillagersList;
