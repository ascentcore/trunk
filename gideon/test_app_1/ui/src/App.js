import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { GlobalCss } from 'theme';
import Routes from 'Routes';
import { ScrollToTop, Notifications } from 'common';

function App() {
    return (
        <ScrollToTop>
            <Fragment>
                {/* <Analytics /> */}
                <CssBaseline />
                <GlobalCss />
                <Notifications />

                {/* <Topbar /> */}
                <Route component={Routes} />
                {/* <Footer /> */}
            </Fragment>
        </ScrollToTop>
    );
}

export default App;
