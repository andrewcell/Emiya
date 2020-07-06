import React from 'react';
import ApplicationBar from './ApplicationBar';

class Header extends React.Component<any, any> {
    render() {
        return (
            <ApplicationBar loginStatus={false} username={''}/>
        )
    }
}
export default Header;