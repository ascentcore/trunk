import React from 'react';
import {
    Paper,
    // makeStyles,
    Box,
    Typography,
    Divider,
} from '@material-ui/core';

function Introduction() {

    return (
        <Paper>
            <Box p={2}>
                <Typography variant="h6">Welcome to Survival Arena!</Typography>
                <Typography>
                    The purpose of the arena is to setup and train an intelligent population in mission to survival
                </Typography>
            </Box>
        </Paper>
    )
}

export default Introduction