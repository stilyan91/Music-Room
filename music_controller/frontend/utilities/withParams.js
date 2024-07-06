import React from 'react';
import { useParams } from "react-router-dom";

export const withParams = (Component) => (props) => {
    const params = useParams();
    return <Component{...props} params={params} />;
}