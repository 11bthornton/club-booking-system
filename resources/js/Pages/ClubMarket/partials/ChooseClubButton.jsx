import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { faRightLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';



export function ChooseClubButton({ day, isSelected, onChoose }) {
    return (
        <Button
            // style={{ backgroundColor: isSelected ? 'orange' : 'primary', color: 'white' }}
            color='primary'
            variant="outlined"
            onClick={() => onChoose(day)}>
            {isSelected ?
                <div className='flex gap-4 items-center'>
                    <FontAwesomeIcon icon={faRightLeft} data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" />
                    Change
                </div> :
                <div data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" className='flex gap-4 items-center'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} data-tooltip-content="Dollar" data-tooltip-id="icon-tooltip-s" />
                    CHOOSE
                </div>}
            <Tooltip id="icon-tooltip-s" effect="solid" />


        </Button>
    );
}
