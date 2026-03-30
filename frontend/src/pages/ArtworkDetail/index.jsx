import { useParams } from 'react-router';

const ArtworkDetail = () => {
    const { id } = useParams();

    return (
        <div>
            <label htmlFor="flavors">Choose a Flavor: {id}</label>
            <input
                list="candy-flavors"
                id="flavors"
            />

            <datalist id="candy-flavors">
                <option value="chocolate" />
                <option value="strawberry" />
                <option value="mint" />
                <option value="apple" />
                <option value="orange" />
                <option value="grape" />
            </datalist>
        </div>
    );
};

export default ArtworkDetail;
