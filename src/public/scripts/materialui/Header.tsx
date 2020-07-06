import React from 'react';
import ApplicationBar from './ApplicationBar';

class Header extends React.Component<any, any> {
    render(): React.ReactElement | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <ApplicationBar loginStatus={false} username={''}/>
        )
    }
}
export default Header;
