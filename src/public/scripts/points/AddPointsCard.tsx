import React from 'react';

interface AddPointCardProp {
    code: string;
}

const AddablePoints = {

}

const AddPointsCard = (props: AddPointCardProp): JSX.Element => {
    return (
        <>
            <h1>{props.code}</h1>
        </>
    )
}

export default AddPointsCard;