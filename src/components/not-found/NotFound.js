import React, { useEffect } from 'react';

const NotFound = (props) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            props.history.push('stepOne');
        }, 3000);

        return () => clearTimeout(timer);
    });

    return (
        <div className="notFoundParent">
            <h1>404 </h1>
            <p>hoppsan! Sidan hittas inte.</p>
        </div>
    );
};

export default NotFound;