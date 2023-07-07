import React from 'react';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'

function HomePage (props) {
    return(
        <div centered>
            <Link to ={'/signup'}>
                <Button variant='contained' >Sign Up</Button>
            </Link>
                <Button variant='contained'>Log In</Button>
                <Button variant='contained'>Guest</Button>
                <></>
        </div>
    );
}
export default HomePage;
