export const initialState = {
    basket: [],
    address: [],
    user: null
};

// Selector
export const getBasketTotal = (basket) => basket?.reduce((amount, item) => item.price + amount, 0);


const reducer = (state, action) => {

    console.log(action);
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user
            };

        case 'ADD_TO_BASKET':
            return {
                ...state,
                basket: [...state.basket, action.item],
            };

        case 'REMOVE_FROM_BASKET':
            const index = state.basket.findIndex(
                (basketItem) => basketItem.id === action.id
            );
            let newBasket = [...state.basket];

            if (index >= 0) {
                newBasket.splice(index, 1);
            } else {
                console.warn(
                    `Can't remove product (id: ${action.id}) as it's not in basket!`
                )
            }

            return {
                ...state,
                basket: newBasket
            };

        case 'EMPTY_BASKET':
            return {
                ...state,
                basket: []
            };

        case 'ADD_ADDRESS':
            return {
                ...state,
                address: [...state.address, action.item],
            };    
    
        default:
            return state;
    }
};

export default reducer;