import React from 'react'
import {Route} from 'react-router-dom'
import { Routes } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import Drawer from './components/Drawer'
import Home from './pages/Home'
import Favorites from './pages/Favorites'

// const arr =[]

function App() {
  const [items, setItems] = React.useState([])
  const [cartItems, setCartItems] = React.useState([])
  const [favorite, setFavorite] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [cartOpened, setCartOpened] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  console.log(items);

  React.useEffect(() => {
    async function fetchData() {
      const cartRespons = await axios.get('https://627500465dc4f5764b9ccafb.mockapi.io/cart');
      const favoritesRespons = await axios.get('https://627500465dc4f5764b9ccafb.mockapi.io/favorite');
      const itemsRespons = await axios.get('https://627500465dc4f5764b9ccafb.mockapi.io/items');

      setIsLoading(false);

      setItems(itemsRespons.data);
      setCartItems(cartRespons.data);
      setFavorite(favoritesRespons.data);
      
      console.log(itemsRespons, favoritesRespons, cartRespons)
    }
    

    fetchData()
  }, [])

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.id) === Number(obj.id));
      console.log(findItem)
      if (findItem) {
        setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`https://627500465dc4f5764b9ccafb.mockapi.io/cart/${findItem.id}`);
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post('https://627500465dc4f5764b9ccafb.mockapi.io/cart/', obj);
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id
              };
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Ошибка при добавлении в корзину');
      console.error(error);
    }
  };

// const onAddToCart = (obj) => {
//     if(cartItems.find((item)=> Number(item.id) === Number(obj.id))){
//       axios.delete(`https://627500465dc4f5764b9ccafb.mockapi.io/cart/${obj.id}`)
//       setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
//     }else{
//       axios.post('https://627500465dc4f5764b9ccafb.mockapi.io/cart', obj);
//       setCartItems(prev =>[...prev, obj]);
//     }
// }

const onPemoveItem = (id) => {
  axios.delete(`https://627500465dc4f5764b9ccafb.mockapi.io/cart/${id}`);
  setCartItems((prev) => prev.filter(item => item.id !==id));
}

const onAddToFavorite = async (obj) => {
try{
  if (favorite.find(favObj => favObj.id === obj.id)){
    await axios.delete(`https://627500465dc4f5764b9ccafb.mockapi.io/favorite/${obj.id}`);
    setFavorite((prev) => prev.filter((item) => item.id !== obj.id));
  }else{
    const { data } = await axios.post('https://627500465dc4f5764b9ccafb.mockapi.io/favorite', obj);
    setFavorite(prev =>[...prev, data]);
  }
}catch(error){
  alert('Не удалось добавить в фаворить')
}
}

const onChangeSearchInput = (event) => {
  setSearchValue(event.target.value)
}

return (
  <div className="wrapper clear">
    {cartOpened && <Drawer items={cartItems} onClose={()=> setCartOpened(false)} onRemove={onPemoveItem}/> }
        <Header onClickCart ={()=> setCartOpened(true)}/>

    <Routes>
    <Route path='/' element={
              <Home 
              items={items} 
              cartItems= {cartItems}
              searchValue={searchValue} 
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
              />
              
    }/>
    <Route path='/favorit' element={<Favorites items={favorite} onAddToFavorite={onAddToFavorite}/>}/>

    </Routes>

    </div> /* wrapper*/ 
  );

}

export default App;



