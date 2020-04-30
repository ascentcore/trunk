import React, { useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Link as SimpleLink,
    Typography,
    TextField,
    Button,
    Box,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core';

import { NiceBox, ButtonLoader } from 'common';
import { userActions, userSelectors } from 'ducks';
import CheckSession from './CheckSession';

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    const handleUserChange = e => {
        setUser(e.target.value);
    };
    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };
    const handleSubmit = e => {
        e.preventDefault();

        const errors = {};
        let anyError = false;

        if (user === '') {
            errors.user = true;
            anyError = true;
        }
        if (password === '') {
            errors.password = true;
            anyError = true;
        }

        if (!anyError) {
            setErrors({});
            dispatch(userActions.login(user, password));
        } else {
            setErrors(errors);
        }
    };

    const isLoggingIn = useSelector(userSelectors.isLoggingIn);

    return (
        <Fragment>
            <NiceBox container small end>
                <CheckSession />
                <Typography variant="h5">Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={user}
                        onChange={handleUserChange}
                        error={errors['user']}
                        helperText={errors['user'] ? 'This cannot be empty' : undefined}
                        name="email"
                        autoFocus
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                        error={errors['password']}
                        helperText={errors['password'] ? 'This cannot be empty' : undefined}
                        name="password"
                    />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                        <Button component={Link} to="/register" size="large" color="primary">
                            Register
                        </Button>
                        <Button
                            variant="contained"
                            disableElevation
                            size="large"
                            color="primary"
                            onClick={handleSubmit}
                            type="submit"
                            disabled={isLoggingIn}
                        >
                            Submit
                            <ButtonLoader open={isLoggingIn} />
                        </Button>
                    </Box>
                </form>
            </NiceBox>
        </Fragment>
    );
}

export default Login;
