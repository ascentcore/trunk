// TODO: test/improve

import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, info) {}
    render() {
        if (this.state.hasError) {
            return (
                <Typography variant="h4" style={{ padding: 16 }}>
                    Something went wrong.
                </Typography>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
