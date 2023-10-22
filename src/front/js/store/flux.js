const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			active:"",
			products: [],
			categories: [],
			orders: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			getProducts: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/products")
					const data = await resp.json()

					setStore({ products: data })
					return true;
				} catch (error) {
					return false
				}
			},

			postProduct: async (product) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/product",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",},
						body: JSON.stringify(product)
						})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().getProducts()
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},

			deleteProduct: async (id) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/product/${id}`, {
						method: "DELETE"})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().getProducts()
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},

			getCategories: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/categories")
					const data = await resp.json()

					setStore({ categories: data })
					return true
				} catch (error) {
					return false
				}
			},

			changeTab: (tab) => {
				setStore({active: tab})
				}
		}
	};
};

export default getState;
