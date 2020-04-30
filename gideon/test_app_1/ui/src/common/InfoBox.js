import React from 'react';
import { Box, Typography } from '@material-ui/core';

function InfoBox({ children, ...boxProps }) {
    return (
        <Box
            px={2}
            py={1}
            bgcolor="warning.light"
            borderRadius="borderRadius"
            border="1px solid"
            borderColor="warning.main"
            {...boxProps}
        >
            <Typography variant="subtitle1">{children}</Typography>
        </Box>
    );
}

export default InfoBox;
