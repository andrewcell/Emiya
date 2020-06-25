import React from 'react';
import {Col, Collection, ProgressBar, Row} from 'materialinse-react';

interface PointsMainListProps {
    myPoints: Map<string, number>;
}

class PointsMainList extends React.Component<PointsMainListProps, any> {
    constructor(props: PointsMainListProps) {
        super(props);
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <Collection>
                {Array.from(this.props.myPoints).map(([villagerCode, point]) => {
                    return (<div className={'collection-item'} key={villagerCode}>
                        <Row>
                            <Col s={2}>
                                <img src={`https://dodo.ij.rs/images/villagers/${villagerCode}.png`}
                                     style={{width: '64px'}} alt={villagerCode}/>
                            </Col>
                            <Col s={10}>
                                <p>잭슨 - Raymond</p>
                                <p>Level 3 - {point}점</p>
                                <ProgressBar progress={point}/>
                            </Col>
                        </Row>
                    </div>)
                })}
            </Collection>
        )
    }
}

export default PointsMainList;