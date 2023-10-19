const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			products: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			getProducts: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/products")
					const data = await resp.json()

					setStore({ products: data })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					showError()
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

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
