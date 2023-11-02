import {Doughnut} from 'react-chartjs-2';
import React from 'react';
import {createStyles, Grid, StyleRules, Theme, WithStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import withStyles from '@material-ui/core/styles/withStyles';
import {Villager} from 'animal-crossing/lib/types/Villager';

const styles = (theme: Theme): StyleRules => createStyles({
    card: {
        overflow: 'auto',
        [theme.breakpoints.up(600)]: {
            height: 700
        },
        borderTopColor: '#b3b3ff',
        borderTopStyle: 'solid',
        borderTopWidth: 5,
        width: '100%'
    },
    displayBlock: {
        display: 'block'
    }
});

interface ChartProp extends WithStyles<typeof styles> {
    villagerList: any;
    dataForChart: any;
    title: string;

}

class MyVillagersChart extends React.Component<ChartProp, never> {
    constructor(prop: ChartProp) {
        super(prop);
    }

    chartColorList = ['red', 'orange', '#dbd000', 'green', 'yellowgreen', '#101aad', 'skyblue', 'purple', 'violet', 'pink', 'deepskyblue', 'darkgreen']

    chartOptions = {
        responsive: true,
        plugins: {
            datalabels: {
                display: true,
                color: 'white'
            }
        }
    }

    getChartData = (data: any): any => {
        return {
            labels: Object.keys(data),
            datasets: [
                {
                    labels: Object.keys(data),
                    data: Object.values(data),
                    backgroundColor: this.chartColorList,
                    fill: true
                }
            ]
        }
    }

    listVillagerImages = (list: any[]): JSX.Element[] => {
        return Object.entries(list).map((v: [string, Villager[]], index) => {
            return (
                <Grid item sm={12} key={v[0]}>
                    <div style={{color: this.chartColorList[index]}} >
                        {v[0]}
                        {v[1].map((value) => {
                            return (
                                <img style={{width: '10%', verticalAlign: 'middle'}} key={value.filename} src={value.iconImage} alt={value.filename}/>
                            )})}
                    </div>
                </Grid>
            )
        });
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { classes } = this.props;

        return (
            <Grid item md={4} sm={6} xs={12} style={{width: '100%'}}>
                <Card elevation={3} className={classes.card}>
                    <CardContent>
                        <Typography variant={'h6'}>{this.props.title}</Typography>
                        <Grid container classes={{container: classes.displayBlock}}>
                            {this.listVillagerImages(this.props.villagerList)}
                        </Grid>
                        <div style={{textAlign: 'center'}}>
                            <Doughnut data={this.getChartData(this.props.dataForChart)} options={this.chartOptions} />
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default withStyles(styles)(MyVillagersChart);
