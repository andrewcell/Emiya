import React from 'react';
import { l } from '../locale';
import 'chartjs-plugin-datalabels';
import MyVillagersChart from './MyVillagersChart';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import {createStyles, StyleRules, Theme, WithStyles} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Hobby, Personality, Villager} from 'animal-crossing/lib/types/Villager';
import {getColorByColor, getHobby, getPersonality, getSpecies, getStyle} from './Locales';

const styles = (theme: Theme): StyleRules => createStyles({
    topMargin: {
        marginTop: 10,
        width: '100%',
    },
    paddingCharts: {
        margin: '0 !important',
        paddingLeft: 10,
        paddingRight: 10
    },
    spacingNoMargin: {
        margin: 0
    }
});

interface MyVillagersStatisticsProps extends WithStyles<typeof styles> {
    my: Villager[];
}

class MyVillagersStatistics extends React.Component<MyVillagersStatisticsProps, any> {
    constructor(prop: MyVillagersStatisticsProps) {
        super(prop);
        this.state = {
            complete: false,
            villagers: []
        }
    }

    MissingHobby = (hobbies: string[]): JSX.Element[] | JSX.Element => {
        if (hobbies.length >= 1) {
            const elements: JSX.Element[] = [];
            hobbies.map(value => {
                elements.push(<Typography>{l('villagers.hobbies.' + value.toLowerCase())}</Typography>)
            });
            return elements;
        } else {
            return (<Typography>{l('villagers.my.fullhobbies')}</Typography>)
        }
    }

    MissingPersonality = (personalities: string[]): JSX.Element[] | JSX.Element => {
        if (personalities.length >= 1) {
            const elements: JSX.Element[] = [];
            personalities.map(value => {
                elements.push(<Typography>{getPersonality(value as Personality)}</Typography>)
            });
            return elements;
        } else {
            return (<Typography>{l('villagers.my.fullpersonality')}</Typography>)
        }
    }

    listVillagerImages = (list: any[]): JSX.Element[] => {
        return Object.entries(list).map((v: [string, Villager[]], index) => {
            return (
                <Grid item xs={12} key={index}>
                    <div style={{color: this.chartColorList[index]}} >
                        {v[0]}
                        {v[1].map((value) => {
                            return (
                                <img key={value.filename} style={{width: '10%', verticalAlign: 'middle'}} src={value.iconImage} alt={value.filename}/>
                            )})}
                    </div>
                </Grid>
            )
        })
    }

    conflictTypeList = (list: any): JSX.Element | JSX.Element[] => {
        let conflict = false;
        const html = Object.entries(list).map((entry, key) => {
            const personality = entry[0].toString();
            const villagersList = entry[1] as Villager[];
            const AB: Map<string, string[]> = new Map([['A', []], ['B', []]]);
            villagersList.map((value) => {
                // eslint-disable-next-line no-unused-expressions
                AB.get(value.subtype as string)?.push(value.filename);
            });
            return (
                <div key={key}>
                    {Array.from(AB).map((value, index) => {
                        if (value[1].length >= 2) {
                            conflict = true;
                            return (
                                <div key={index}>
                                    <div className={'red--text'} key={index}>{personality} {value[0]}</div>
                                    {value[1].map(code => {
                                        return <img key={code} style={{width: '15%', verticalAlign: 'middle'}} src={`https://acnhcdn.com/latest/NpcIcon/${code}.png`}  alt={code} />
                                        // return (img)
                                    })}
                                </div>
                            )
                        }
                    })}
                </div>
            )
        })

        if (conflict) {
            return html;
        } else {
            return <Typography>{l('villagers.my.noconflictype')}</Typography>
        }

    };


    chartColorList = ['red', 'orange', '#dbd000', 'green', 'yellowgreen', '#101aad', 'skyblue', 'purple', 'violet', 'pink']

    chartOptions = {
        plugins: {
            datalabels: {
                display: true,
                color: 'white'
            }
        }
    }

    pushToList = (list: any, name: string, villager: Villager): void => {
        if (name in list) {
            (list[name] as Villager[]).push(villager);
        } else {
            list[name] = [villager] as Villager[];
        }
    }

    pushToChart = (chartObject: any, name: string): void => {
        if (name in chartObject) {
            chartObject[name]++
        } else {
            chartObject[name] = 1;
        }
    }

    personalityToGender = (personality: Personality): string => {
        switch (personality) {
            case Personality.Jock:
            case Personality.Cranky:
            case Personality.Smug:
            case Personality.Lazy:
                return l('villagers.genders.male');
            case Personality.Normal:
            case Personality.Peppy:
            case Personality.BigSister:
            case Personality.Snooty:
                return l('villagers.genders.female');
            default:
                return '?';
        }
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const hobbies: string[] = Object.values(Hobby);
        const personalities: string[] = Object.values(Personality);

        // Chart Data
        const species: any = {};
        const personalitiesChart: any = {};
        const hobbiesChart: any = {};
        const styleChart: any = {};
        const colorChart: any = {};
        const sexChart: any = {};

        // List for chart above
        const speciesList: any = {};
        const personalList: any = {};
        const hobbyList: any = {};
        const styleList: any = {};
        const colorList: any = {};
        const sexList: any = {};

        this.props.my.forEach(((value) => {
            const hobbyIndex = hobbies.indexOf(value.hobby);
            if (hobbyIndex > -1) {
                hobbies.splice(hobbyIndex, 1);
            }
            const personalityIndex = personalities.indexOf(value.personality);
            if (personalityIndex > -1) {
                personalities.splice(personalityIndex, 1);
            }

            const speciesName = getSpecies(value.species);
            const personalityName = getPersonality(value.personality);
            const hobbyName = getHobby(value.hobby);
            const Style1 = getStyle(value, 0);
            const Style2 = getStyle(value, 1);
            const Color1 = getColorByColor(value.colors[0]);
            const Color2 = getColorByColor(value.colors[1]);
            const sex = this.personalityToGender(value.personality);

            this.pushToList(personalList, personalityName, value);
            this.pushToList(hobbyList, hobbyName, value);
            this.pushToList(speciesList, speciesName, value);
            this.pushToList(styleList, Style1, value);
            this.pushToList(colorList, Color1, value);
            this.pushToList(sexList, sex, value);

            this.pushToChart(species, speciesName);
            this.pushToChart(personalitiesChart, personalityName);
            this.pushToChart(hobbiesChart, hobbyName);
            this.pushToChart(styleChart, Style1);
            this.pushToChart(colorChart, Color1);
            this.pushToChart(sexChart, sex);

            if (value.styles[0] !== value.styles[1]) {
                this.pushToList(styleList, Style2, value);
                this.pushToChart(styleChart, Style2);
            }
            if (value.colors[0] !== value.colors[1]) {
                this.pushToList(colorList, Color2, value);
                this.pushToChart(colorChart, Color2);
            }
        }));

        const { classes } = this.props;

        return (
            <Grid container className={classes.topMargin} spacing={1} classes={{'spacing-xs-1': classes.spacingNoMargin}}>
                <Grid item md={4} sm={12} style={{width: '100%'}}>
                    <Card>
                        <CardContent>
                            <Typography variant={'h6'}>{l('villagers.my.missingpersonality')}</Typography>
                            {this.MissingPersonality(personalities)}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={4} sm={12} style={{width: '100%'}}>
                    <Card>
                        <CardContent>
                            <Typography variant={'h6'}>{l('villagers.my.missinghobby')}</Typography>
                            {this.MissingHobby(hobbies)}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={4} sm={12} style={{width: '100%'}}>
                    <Card>
                        <CardContent>
                            <Typography variant={'h6'}>{l('villagers.my.conflict')}</Typography>
                            {this.conflictTypeList(personalList)}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid container justify={'center'} alignItems={'center'} className={classes.paddingCharts} spacing={1}>
                    <MyVillagersChart villagerList={speciesList} dataForChart={species} title={l('villagers.my.speciesreport')} />
                    <MyVillagersChart villagerList={styleList} dataForChart={styleChart} title={l('villagers.my.style')} />
                    <MyVillagersChart villagerList={hobbyList} dataForChart={hobbiesChart} title={l('villagers.my.hobby')} />
                    <MyVillagersChart villagerList={personalList} dataForChart={personalitiesChart} title={l('villagers.my.personality')} />
                    <MyVillagersChart villagerList={colorList} dataForChart={colorChart} title={l('villagers.my.color')} />
                    <MyVillagersChart villagerList={sexList} dataForChart={sexChart} title={l('villagers.my.sex')} />
                </Grid>
            </Grid>

        )
    }
}

export default withStyles(styles)(MyVillagersStatistics);
