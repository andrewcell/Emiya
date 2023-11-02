import React from 'react';
import {l} from '../locale';
import {Card, StyleRules, Theme, WithStyles} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import {Query, SearchQuery} from './interfaces';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import {Hobby, Personality, Style} from 'animal-crossing/lib/types/Villager';
import {Species} from './enums';
import {getHobby, getPersonality, getSpecies} from './Locales';

const styles = (theme: Theme): StyleRules => ({
    select: {
        margin: theme.spacing(2),
        minWidth: 120
    },
    cardButtons: {
        marginLeft: 'auto'
    }
});

interface VillagersSearchProp extends WithStyles<typeof styles> {
    setData: (data: Query) => void;
}

interface VillagersSearchState {
    liveSearch: boolean,
    showAll: boolean,
    search: Query[]
}

class VillagersSearch extends React.Component<VillagersSearchProp, VillagersSearchState> {
    constructor(prop: VillagersSearchProp) {
        super(prop);
        this.state = {
            liveSearch: false,
            showAll: true,
            search: []
        }
    }
    handleInput = (e: React.ChangeEvent<{  name?: string | undefined; value: unknown }>): void  => {
        const value: string = (e.target.value as string).toLowerCase();
        let query: Query = {}
        switch (e.target.name) {
            case 'personality':
                query = {personality: value}
                break;
            case 'style':
                query = {style: value}
                break;
            case 'name':
                query = {name: value}
                break;
            case 'species':
                query = {species: value}
                break;
            case 'type':
                query = {type: value.toUpperCase()}
                break;
            case 'hobby':
                query = {hobby: value}
                break;
            case 'phrase':
                query = {phrase: value}
                break;
        }
        if (this.state.liveSearch) {
            this.props.setData(query);
        } else {
            this.state.search.push(query);
        }
    }

    handleSearchButton = (): void => {
        this.state.search.map((query) => {
            this.props.setData(query);
        })
    }

    handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
        if (checked) {
            this.setState({liveSearch: true});
        } else {
            this.setState({liveSearch: false});
        }
    }

    render(): React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const personalityOptions: JSX.Element[] = [];
        Object.values(Personality).map(item => {
            personalityOptions.push(<MenuItem value={item}>{getPersonality(item)}</MenuItem>)
        });

        const hobbyOptions: JSX.Element[] = [];
        Object.values(Hobby).map(item => {
            hobbyOptions.push(<MenuItem value={item.toLowerCase()}>{getHobby(item)}</MenuItem>)
        });

        const speciesOptions: JSX.Element[] = [];
        Object.values(Species).map(item => {
            speciesOptions.push(<MenuItem value={item.toLowerCase()}>{getSpecies(item)}</MenuItem>)
        });

        const styleOptions: JSX.Element[] = [];
        Object.values(Style).map(item => {
            styleOptions.push(<MenuItem value={item.toLowerCase()}>{l('villagers.styles.' + item.toLowerCase())}</MenuItem>)
        });


        let searchButton;
        if (!(this.state.liveSearch)) {
            searchButton = (
                <Button id={'searchButton'} onClick={this.handleSearchButton} color={'primary'}>{l('villagers.search.search')}</Button>
            )
        }
        return (
            <Card>
                <CardHeader title={l('villagers.search.title')} />
                <CardContent>
                    <FormControl className={this.props.classes.select}>
                        <InputLabel htmlFor={'personality'}>{l('villagers.search.personality')}</InputLabel>
                        <Select onChange={this.handleInput} name={'personality'} id={'personality'}>
                            <MenuItem value={''}>-</MenuItem>
                            {personalityOptions}
                        </Select>
                    </FormControl>
                    <FormControl className={this.props.classes.select}>
                        <InputLabel htmlFor={'type'}>{l('villagers.search.type')}</InputLabel>
                        <Select onChange={this.handleInput} name={'type'} id={'type'}>
                            <MenuItem value={''}>-</MenuItem>
                            <MenuItem value={'A'}>A</MenuItem>
                            <MenuItem value={'B'}>B</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={this.props.classes.select}>
                        <InputLabel htmlFor={'hobby'}>{l('villagers.search.hobby')}</InputLabel>
                        <Select onChange={this.handleInput} name={'hobby'} id={'hobby'}>
                            <MenuItem value={''}>-</MenuItem>
                            {hobbyOptions}
                        </Select>
                    </FormControl>
                    <FormControl className={this.props.classes.select}>
                        <InputLabel htmlFor={'species'}>{l('villagers.search.species')}</InputLabel>
                        <Select onChange={this.handleInput} name={'species'} id={'species'}>
                            <MenuItem value={''}>-</MenuItem>
                            {speciesOptions}
                        </Select>
                    </FormControl>
                    <FormControl className={this.props.classes.select}>
                        <InputLabel htmlFor={'style'}>{l('villagers.search.style')}</InputLabel>
                        <Select onChange={this.handleInput} name={'style'} id={'style'}>
                            <MenuItem value={''}>-</MenuItem>
                            {styleOptions}
                        </Select>
                    </FormControl>
                    <TextField className={this.props.classes.select} onChange={this.handleInput} label={l('villagers.search.phrase')} name={'phrase'}/>
                    <TextField className={this.props.classes.select} onChange={this.handleInput} label={l('villagers.search.name')} name={'name'}/>
                </CardContent>
                <CardActions disableSpacing>
                    <Tooltip title={l('villagers.tooltip.livesearch')}>
                        <FormControlLabel className={this.props.classes.cardButtons} label={l('villagers.search.live')} control={<Checkbox name={'live'} onChange={this.handleCheckBox} checked={this.state.liveSearch} color={'primary'} />} />
                    </Tooltip>
                    {searchButton}
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(VillagersSearch);
