import React from 'react';
import { Alert } from 'react-bootstrap';

// variant for color, children for wrapping
const Message = ({ variant, children }) => {
  return (
    <Alert variant={variant}>
        {children}
    </Alert>
  );
};

Message.defaultProps = {
    variant: 'info',
};

export default Message