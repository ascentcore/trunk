import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, Box } from '@material-ui/core';

import { something } from 'ducks';

const useStyles = makeStyles(theme => ({}));

function _Template({ test }) {
    const classes = useStyles();
    const [] = useState();

    return <Fragment>Lorem ipsum</Fragment>;
}

export default _Template;
