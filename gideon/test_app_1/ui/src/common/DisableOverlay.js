// TODO refactor/complete

import React from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
}));

export default function DisableOverlay({ before, after, light }) {
    const classes = useStyles();

    return <div className={classes.root} />;
}
