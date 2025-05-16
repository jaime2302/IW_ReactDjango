import React from 'react';

function Error({ message = "Ha ocurrido un error." }) {
    return (
        <div style={{
            color: '#fff',
            backgroundColor: '#d32f2f',
            padding: '16px',
            borderRadius: '4px',
            textAlign: 'center',
            margin: '20px 0'
        }}>
            <strong>Error:</strong> {message}
        </div>
    );
}

export default Error;