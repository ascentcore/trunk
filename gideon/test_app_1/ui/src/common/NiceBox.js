// TODO: refactor

import React from 'react';

import { Paper, Box, Container } from '@material-ui/core';

function NiceBox({ children, container, simple, narrow, small, end, ...props }) {
    const maxWidth = small ? 'xs' : narrow ? 'lg' : 'xl';
    const content = simple ? (
        <Box {...props}>{children}</Box>
    ) : (
        <Paper>
            <Box p={3} mb={end ? undefined : 4} {...props}>
                {children}
            </Box>
        </Paper>
    );

    if (!container) return content;
    return <Container maxWidth={maxWidth}>{content}</Container>;
}

export default NiceBox;
