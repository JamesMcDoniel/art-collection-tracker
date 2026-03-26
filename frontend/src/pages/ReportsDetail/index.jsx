import { useParams } from 'react-router';

const ReportsDetail = () => {
    const { id } = useParams();

    return <div>Report: {id}</div>;
};

export default ReportsDetail;
