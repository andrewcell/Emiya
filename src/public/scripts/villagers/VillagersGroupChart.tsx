import React from 'react';
import {ChartData, Radar} from 'react-chartjs-2';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {Typography} from '@material-ui/core';
import VillagersGroupRadarChart from './VillagersGroupRadarChart';
import {VillagerStorage, VillagerStorageByVillager} from './interfaces';
import {Personality} from './enums';
import {l} from '../locale';
import {ChartDataSets} from 'chart.js';

interface VillagersGroupChartProps {
    storage: VillagerStorage;
    codeToVillagerArray: (codes: string[]) => Villager[];
}

interface VillagersGroupChartState {
    loaded: boolean;
    personalityLabels: string[];
    personalityData: any[];
    storage: VillagerStorageByVillager;
}

class VillagersGroupChart extends React.Component<VillagersGroupChartProps, VillagersGroupChartState> {
    constructor(props: VillagersGroupChartProps) {
        super(props);
        this.state = {
            loaded: false,
            personalityLabels: [],
            personalityData: [],
            storage: {}
        }
    }

    componentDidMount(): void {
        const { storage, codeToVillagerArray } = this.props
        const newStorage: VillagerStorageByVillager = {};
        const personalityLabels: string[] = [];
        Object.values(Personality).map(p => {
            personalityLabels.push(l('villagers.personalities.' + p));
        });
        const personalityData: ChartDataSets[] = [];
        Object.keys(storage).map(key => {
            const villagerArray = codeToVillagerArray(storage[key]);
            villagerArray.map(v => {
            })
            personalityData.push({
                label: key,
                data: [1,2,3]
            })
        });
        this.setState({storage: newStorage});
        this.setState({loaded: false, personalityLabels, personalityData});
    }

    render(): React.ReactElement {
        if (this.state.loaded) {
            const { personalityLabels, personalityData } = this.state;
            return (
                <>
                    <VillagersGroupRadarChart labels={personalityLabels} datasets={personalityData} />
                </>
            )
        } else {
            return (
                <></>// <Typography variant={'h4'}>Loading charts...</Typography>
            )
        }
    }
}

export default VillagersGroupChart;