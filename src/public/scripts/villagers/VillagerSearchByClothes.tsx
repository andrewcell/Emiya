import React from 'react';
import {l} from '../locale';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {decryptJava, encryptJava as encrypt} from '../encryption/AES';
import {Clothes} from './interfaces';
import VillagerSearchByClothesPanel from './VillagerSearchByClothesPanel';
import Cookies from 'js-cookie';
import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from '@material-ui/core/MenuItem';
import {CardContent, createStyles, StyleRules, Theme, WithStyles} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import CardActions from '@material-ui/core/CardActions';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import {Color, Villager} from 'animal-crossing/lib/types/Villager';
import {CodeCommentData, Data} from '../repsonseBody';

// const url = 'http://127.0.0.1:8080'
const url = 'https://emiyaj.vxz.me';

const styles = (theme: Theme): StyleRules => createStyles({
    select: {
        margin: theme.spacing(2),
        minWidth: 150
    }
});

interface VillagerSearchByClothesProps extends WithStyles<typeof styles> {
    myVillagers: Villager[];
}

interface VillagerSearchByClothesState {
    name: string;
    selectedColor: string;
    result: boolean;
    color1: string;
    color2: string;
    style: string;
    total: number;
    button: boolean;
    message: string;
    image: string;
    snackbar: boolean;
    snackbarMessage: string;
    resultTarget: 0 | 1 | 2 | 3 | 4;
}

class VillagerSearchByClothes extends React.Component<VillagerSearchByClothesProps, VillagerSearchByClothesState> {
    constructor(prop: VillagerSearchByClothesProps) {
        super(prop);
        this.state = {
            name: '',
            selectedColor: '',
            result: false,
            color1: '',
            color2: '',
            style: '',
            total: 0,
            button: true,
            message: '',
            image: '',
            snackbar: false,
            snackbarMessage: '',
            resultTarget: 0
        }
    }

    handleInput = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>): void => {
        this.setState({selectedColor: e.target.value as string});
    }

    handleName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: e.currentTarget.value});
    }

    handleSearch = (/* e: React.MouseEvent<HTMLButtonElement> */): void => {
        this.setState({button: false, message: '', image: ''});
        const nameValue = this.state.name;
        const colorValue = this.state.selectedColor;

        if (nameValue === '' || colorValue === '') {
            this.setState({button: true});
            return
        }
        axios.post(`${url}/clothes/search/name`, {data: encrypt(Math.floor(Date.now()/1000).toString()+'/'+nameValue+'/'+colorValue), target: this.state.resultTarget})
            .then((res: AxiosResponse<CodeCommentData>) => {
                const data = res.data
                if (data.code === 'clothes00') {
                    const decrypted = JSON.parse(decryptJava(res.data.data)) as {first: number; second: Clothes};
                    const clothes = decrypted.second;
                    if (clothes == null) {
                        this.setState({message: l('villagers.searchbyclothes.notfound')})
                    } else {
                        const color1: string = clothes.color1.toLowerCase();
                        const color2: string = clothes.color2.toLowerCase();
                        let message: string = (Cookies.get('locale') === 'ko_KR' ? clothes.nameKorean : clothes.name) + ` (${l('villagers.styles.' + clothes.style1.toLowerCase())}) [${l('villagers.colors.' + color1)}, ${l('villagers.colors.' + color2)}]`;
                        if (decrypted.first > 1) {
                            message = l('villagers.searchbyclothes.multipleresult') +  message;
                        }
                        this.setState({
                            result: true,
                            message,
                            image: 'https://acnhcdn.com/latest/FtrIcon/' + clothes.filename + '.png',
                            style: clothes.style1.toLowerCase(),
                            color1: clothes.color1.toLowerCase(),
                            color2: clothes.color2.toLowerCase(),
                            button: true
                        });
                    }
                } else {
                    this.message(data.comment);
                }
                this.setState({button: true})
            })
            .catch((err: AxiosError)=> {
                if (err.response?.status === 429) {
                    this.message(l('villagers.gift.toomanyrequests'));
                } else {
                    this.message('Internal Server Error.');
                }
                this.setState({button: true})
            });
    }

    searchButton = (): JSX.Element => {
        if (this.state.button || this.state.button == null) {
        return <Button onClick={this.handleSearch}>{l('villagers.searchbyclothes.button')}</Button>
        } else {
            return <Button onClick={this.handleSearch} disabled>{l('villagers.searchbyclothes.button')}</Button>
        }
    }

    message = (message: string): void => {
        this.setState({snackbar: true, snackbarMessage: message});
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const colorOptions: JSX.Element[] = [];
        Object.values(Color).map(casedColor => {
            const color = casedColor.toLowerCase();
            colorOptions.push(<MenuItem value={color}>{l('villagers.colors.' + color)}</MenuItem>);
        });

        const exactColorAndStyles: Villager[] = []
        const exactColors: Villager[] = []
        const matchColors: Villager[] = []
        const matchColorAndStyles: Villager[] = []
        if (this.state.result) {
            const color = [this.state.color1, this.state.color2];
            const style = this.state.style;
            this.props.myVillagers.map((v: Villager) => {
                const color1 = v.colors[0].toLowerCase()
                const color2 = v.colors[1].toLowerCase()
                const style1 = v.styles[0].toLowerCase()
                const style2 = v.styles[1].toLowerCase()
                if (color.includes(color1) && color.includes(color2)) {
                    if (style1 === style || style2 === style) {
                        exactColorAndStyles.push(v);
                    } else {
                        exactColors.push(v);
                    }
                } else if (color.includes(color1) || color.includes(color2)) {
                    if (style1 === style || style2 === style) {
                        matchColorAndStyles.push(v);
                    } else {
                        matchColors.push(v);
                    }
                }
            });
        }

        return (
            <div>
                <Card>
                    <CardHeader title={l('villagers.searchbyclothes.title')} />
                    <CardContent>
                        <FormControl className={this.props.classes.select}>
                            <InputLabel htmlFor={'villager'}>{l('villagers.gift.color')}</InputLabel>
                            <Select onChange={this.handleInput} id={'villager'}>
                                <MenuItem value={''}>-</MenuItem>
                                {colorOptions}
                            </Select>
                        </FormControl>
                        <FormControl className={this.props.classes.select}>
                            <TextField label={l('villagers.search.name')} id={'name'} onChange={this.handleName}/>
                        </FormControl>
                        {(this.state.message) ? <Typography>{this.state.message}</Typography> : null}
                        {(this.state.image) ? <img src={this.state.image} alt={this.state.image} /> : null}
                    </CardContent>
                    <CardActions>
                        {this.searchButton()}
                    </CardActions>

                </Card>

                <VillagerSearchByClothesPanel title={l('villagers.searchbyclothes.exactcolors')} data={exactColors} />
                <VillagerSearchByClothesPanel title={l('villagers.searchbyclothes.exactcolorsandstyle')} data={exactColorAndStyles} />
                <VillagerSearchByClothesPanel title={l('villagers.searchbyclothes.matchcolors')} data={matchColors} />
                <VillagerSearchByClothesPanel title={l('villagers.searchbyclothes.matchcolorsandstyles')} data={matchColorAndStyles} />
                <Snackbar open={this.state.snackbar} message={this.state.snackbarMessage} autoHideDuration={3000} />
            </div>
        )
    }
}

export default withStyles(styles)(VillagerSearchByClothes);
