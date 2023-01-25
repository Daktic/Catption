import { useParams } from 'react-router-dom';

const DynamicPhoto = () => {
    let { id } = useParams();

    return <h1>Displaying photo with id: {id}</h1>;
};

export defualt DynamicPhoto;