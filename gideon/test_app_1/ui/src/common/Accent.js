import React from 'react';
import { Box } from '@material-ui/core';

function Accent({ children, danger, color }) {
    const col = color || `${danger ? 'error' : 'primary'}.main`;
    return (
        <Box key={col} color={col} component="span" fontWeight="fontWeightMedium">
            {children}
        </Box>
    );
}

export default Accent;
