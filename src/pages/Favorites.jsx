import React from 'react';
import Card from '../components/Card'
import AppContext from '../context'

function Favorites({ onAddToFavorite}) {
    const { favorite } = React.useContext(AppContext);


    // console.log(state);

    return(
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Мои закладки</h1>
            </div>

            <div className="d-flex flex-wrap">
                    {favorite.map((item, index) => (
                        <Card
                            key={index}
                            favorited={true}
                            onFavorite={onAddToFavorite}
                            {...item}
                        />
                    ))}
            </div>
        </div>
    );
}

export default Favorites;