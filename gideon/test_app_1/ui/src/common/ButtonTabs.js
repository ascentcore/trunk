import React from 'react';
import { ButtonGroup, Button } from '@material-ui/core';

function ButtonTabs({
    keyPath,
    labelPath,
    pathPath = 'path',
    list,
    current,
    onClick = () => {},
    size,
    ...moreProps
}) {
    return (
        <ButtonGroup color="primary" size={size}>
            {list.map(v => (
                <Button
                    variant={current === v ? 'contained' : ''}
                    disableElevation
                    onClick={onClick(v)}
                    key={keyPath ? v[keyPath] : v}
                    to={pathPath ? v[pathPath] : undefined}
                    {...moreProps}
                >
                    {labelPath ? v[labelPath] : v}
                </Button>
            ))}
        </ButtonGroup>
    );
}

export default ButtonTabs;
