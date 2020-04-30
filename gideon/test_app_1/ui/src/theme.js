import React from 'react';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
// import { red, blue } from '@material-ui/core/colors';
import //darken,
// lighten,
'@material-ui/core/styles/colorManipulator';

const defaultTheme = createMuiTheme(); // eslint-disable-line

const themeObj = {
    palette: {
        // primary: red,
        // secondary: { main: '#0000ff' },
    },
    typography: {
        // fontSize: 12,
    },
    overrides: {
        // MuiButton: {
        //     label: {
        //         textDecoration: 'none',
        //     },
        //     outlinedPrimary: {
        //         color: #0f0,
        //         borderColor: #f0f,
        //         '&:hover': {
        //             borderColor: #0f0,
        //         },
        //     },
        //     containedPrimary: {
        //         backgroundColor: #0f0,
        //         '&:hover': {
        //             backgroundColor: darken(#0f0, 0.2),
        //         },
        //     },
        // },
    },
};

const darkThemeObj = {
    ...themeObj,
    palette: {
        type: 'dark',
        // primary: { main: lighten(red, 0.4) },
        // secondary: blue,
    },
    overrides: {
        // MuiPaper: {
        //     root: {
        //         backgroundColor: red[700],
        //     },
        // },
    },
};

const theme = createMuiTheme(themeObj);
const darkTheme = createMuiTheme(darkThemeObj);

export default function Theme({ children }) {
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
export function DarkTheme({ children }) {
    return <MuiThemeProvider theme={darkTheme}>{children}</MuiThemeProvider>;
}

export const GlobalCss = withStyles({
    '@global': {
        // html: {
        //     fontSize: 16,
        // },
        a: {
            color: theme.palette.primary.main,
            // textDecoration: 'none',
        },
        b: {
            fontWeight: '500 !important',
        },
        // this overcomes chrome styles for autofill
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus input:-webkit-autofill, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus': {
            '-webkit-transition-delay': '9999999s',
        },
        '.fa-fw': {
            width: '1em',
        },
        u: {
            '&.dashed': {
                textDecoration: 'none',
                borderBottom: `1px dotted ${theme.palette.text.secondary}`,
            },
        },
    },
})(() => null);
