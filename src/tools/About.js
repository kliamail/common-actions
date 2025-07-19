import React from 'react';
import {Box, Typography, Link} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function About() {
    return (
        <Box sx={{p: 2}}>
            <Typography variant="h5" gutterBottom>About this site</Typography>

            <Typography paragraph>
                This is a tiny collection of JSON utilities built with React&nbsp;+ MUI.
                If you’d like to report a bug or request a feature, open an issue&nbsp;or
                pull-request on GitHub.
            </Typography>

            <Link
                href="https://github.com/kliamail/common-actions"
                target="_blank" rel="noopener"
                underline="hover"
                sx={{display: 'inline-flex', alignItems: 'center', gap: .5}}
            >
                <GitHubIcon fontSize="small"/>
                github.com/kliamail/common-actions
            </Link>
        </Box>
    );
}