import React from 'react';
import {ChartDataSets} from 'chart.js';
import {Radar} from 'react-chartjs-2';

interface VillagersGroupRadarChartProps {
    labels: string[];
    datasets: ChartDataSets[];
}

export default class VillagersGroupRadarChart  extends React.Component<VillagersGroupRadarChartProps, any> {
    constructor(props: VillagersGroupRadarChartProps) {
        super(props);
    }
    render(): React.ReactElement {
        const { labels, datasets } = this.props;
        return (
            <>
                <Radar data={{labels, datasets}} />
            </>
        )
    }
}