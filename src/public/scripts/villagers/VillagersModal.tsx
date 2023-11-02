/*
import React from 'react';
import {Collection} from 'materialinse-reactjs';
import {l} from '../locale';
import {Villager} from 'animal-crossing/lib/types/Villager';
import {getName} from './Locales';

class VillagersModal extends React.Component<any, never> {
    constructor(prop: any) {
        super(prop);
    }

    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div id={'villagersModal'} className={'modal modal-fixed-footer'}>
                <div className={'modal-content'}>
                    <h4>Add Villager</h4>
                    <Collection>
                        {this.props.data.map((v: Villager) => {
                            const name = getName(v)

                            return (
                                <li className={'collection-item'} key={v.filename}>
                                    <p>
                                    <img src={'/images/villagers/' + v.filename + '.png'} style={{width: '10%'}} alt={v.filename} />
                                    <span style={{verticalAlign: 'top'}}>{name} ({v.subtype})</span>
                                    <p>{l('villagers.personalities.'+v.personality)}</p>
                                        <button className={'btn'} value={v.filename}>add</button>
                                    </p>
                                </li>
                            )
                        })}
                    </Collection>
                </div>
            </div>
        );
    }
}

export default VillagersModal;
*/