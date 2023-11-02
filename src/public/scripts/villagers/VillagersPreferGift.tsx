import {l} from '../locale';
import React from 'react';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {decrypt, decryptJava, encryptJava as encrypt} from '../encryption/AES';
import VillagerPreferClothesPanel from './VillagerPreferClothesPanel';
import Cookies from 'js-cookie';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import {StyleRules, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {getName} from './Locales';
import {CodeCommentData} from '../repsonseBody';
import {emiyaJ, url} from '../api';
import {Clothes} from './interfaces';

const style = (theme: Theme): StyleRules => createStyles({
    select: {
        margin: theme.spacing(2),
        minWidth: 150
    },
    cardButtons: {
        marginLeft: 'auto'
    },
    inherit: {
        display: 'inherit'
    },
    card: {
       marginBottom: 10
    }
})

interface VillagersPreferGiftProps extends WithStyles<typeof style> {
    data: Villager[];
}

interface VillagersPreferGiftState {
    code: Map<number, string>;
    resultType: 'all' | 'styles' | 'colors' | 'ecolors' | 'eall';
    resultTarget: 0 | 1 | 2 | 3 | 4;
    selected: string;
    result: Clothes[];
    button: boolean;
    snackbar: boolean;
    snackbarMessage: string;
}

class VillagersPreferGift extends React.Component<VillagersPreferGiftProps, VillagersPreferGiftState> {
    constructor(prop: VillagersPreferGiftProps) {
        super(prop);
        this.state = {
            code: new Map<number, string>(),
            resultType: 'all',
            resultTarget: 0,
            selected: '',
            result: [],
            button: true,
            snackbar: false,
            snackbarMessage: ''
        }
        type myVillagers = {[key: string]: string[]};
        void axios.get('/villagers/react/my/get')
            .then((res: AxiosResponse<CodeCommentData>) => {
                const map = new Map<number, string>();
                const list = JSON.parse(decrypt(res.data.data)) as myVillagers;
                console.log(list)
                list[Object.keys(list)[1]].forEach((value: string, index: number) => {
                    map.set(index, value);
                });
                this.setState({code: map});
            })
    }

    handleInput = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
        const value = e.target.value as string;
        if (value !== '' || value != null) {
            this.setState({selected: value})
        }
    }

    handleSearchButton = (/* e: React.MouseEvent<HTMLButtonElement> */): void => {
        this.setState({button: false});
        const value = this.state.selected;
        if (value === '' || value == null) {
            this.setState({button: true});
            return;
        }

        axios.post(url(emiyaJ, 'clothes', 'search', 'villager'), {data: encrypt(Math.floor(Date.now()/1000).toString()+'/'+value), target: this.state.resultTarget})
            .then((res: AxiosResponse<CodeCommentData>) => {
                const data = res.data
                if (data.code === 'clothes00') {
                    const decrypted = JSON.parse(decryptJava(res.data.data)) as Clothes[];
                    this.setState({result: decrypted});
                } else {
                    this.setSnackBar(data.comment);
                }
                this.setState({button: true});
            })
            .catch((err: AxiosError)=> {
                if (err.response?.status === 429) {
                    this.setSnackBar(l('villagers.gift.toomanyrequests'));
                } else {
                    this.setSnackBar('Internal Server Error.');
                }
                this.setState({button: true});
            });
    }

    handleMatchOption = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
        const value = e.target.value
        switch (value) {
            case 'all':
                this.setState({resultType: value, result: [], resultTarget: 0});
                break;
            case 'styles':
                this.setState({resultType: value, result: [], resultTarget: 1});
                break;
            case 'colors':
                this.setState({resultType: value, result: [], resultTarget: 2});
                break;
            case 'ecolors':
                this.setState({resultType: value, result: [], resultTarget: 3});
                break;
            case 'eall':
                this.setState({resultType: value, result: [], resultTarget: 4});
                break;
            default:
                this.setState({resultType: 'all', result: [], resultTarget: 0});
                break;
        }
    }

    searchButton = (): JSX.Element => {
        if (this.state.button || this.state.button == null) {
        return <Button onClick={this.handleSearchButton}>{l('villagers.searchbyclothes.button')}</Button>
        } else {
            return <Button onClick={this.handleSearchButton} disabled>{l('villagers.searchbyclothes.button')}</Button>
        }
    }

    setSnackBar = (message: string): void => {
        this.setState({snackbar: true, snackbarMessage: message});
    }

    getResult = (): JSX.Element => {
        if (this.state.button) {
            return <VillagerPreferClothesPanel title={/* l('villagers.gift.resulttitle.' + this.state.resultType) */''} type={this.state.resultType} data={this.state.result} />
        } else {
            return (
                <Grid container spacing={0} direction="column" alignItems="center" justify="center">
                    <Grid item xs={3}>
                        <CircularProgress />
                    </Grid>
                </Grid>
            )
        }
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const filtered: Villager[] = this.props.data.filter((item: Villager) => {
            return Array.from(this.state.code.values()).includes(item.filename);
        });
        const villagerOptions: JSX.Element[] = [];
        filtered.map((villager: Villager) => {
            villagerOptions.push(
                <MenuItem value={villager.styles[0].toLowerCase()+'/'+villager.styles[1].toLowerCase()+'/'+villager.colors[0].toLowerCase()+'/'+villager.colors[1].toLowerCase()} >
                    {getName(villager)}
                </MenuItem>
            )
        });
        return (
            <div>
                <Card className={this.props.classes.card}>
                    <CardHeader title={l('villagers.gift.title')} />
                    <CardContent>
                        <FormControl className={this.props.classes.select}>
                            <InputLabel htmlFor={'villager'}>{l('villagers.prefer.villager')}</InputLabel>
                            <Select onChange={this.handleInput} name={'villager'} id={'villager'}>
                                <MenuItem value={''}>-</MenuItem>
                                {villagerOptions}
                            </Select>
                        </FormControl>
                        <FormControl className={this.props.classes.select}>
                            <InputLabel htmlFor={'match'}>{l('villagers.prefer.match')}</InputLabel>
                            <Select onChange={this.handleMatchOption} id={'match'}>
                                <MenuItem value={'all'}>{l('villagers.gift.matchstyleandcolor')}</MenuItem>
                                <MenuItem value={'styles'}>{l('villagers.gift.matchstyle')}</MenuItem>
                                <MenuItem value={'colors'}>{l('villagers.gift.matchcolor')}</MenuItem>
                                <MenuItem value={'ecolors'}>{l('villagers.gift.exactcolors')}</MenuItem>
                                <MenuItem value={'eall'}>{l('villagers.gift.exactstyleandcolor')}</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>
                    <CardActions>
                        {this.searchButton()}
                    </CardActions>
                </Card>
                {this.getResult()}
                <Snackbar open={this.state.snackbar} message={this.state.snackbarMessage} autoHideDuration={3000} />
            </div>
        )
    }
}

export default withStyles(style)(VillagersPreferGift);

