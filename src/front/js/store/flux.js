const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			active:"",
			products: [],
			categories: [],
			orders: [],
			customers: [],
			payments:[],
			selectedProducts:[]
		},
		actions: {
			// Use getActions to call a function within a fuction

			//PRODUCTS
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
			
			// CATEGORIES
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

			postCategory: async (category) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/category",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",},
						body: JSON.stringify(category)
						})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().getCategories()
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},

			// SUBCATEGORIES
			postSubCategory: async (subcategory) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/subcategory",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",},
						body: JSON.stringify(subcategory)
						})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().getCategories()
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},

			// ORDERS
			getOrders: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/orders")
					const data = await resp.json()

					setStore({ orders: data })
					return true
				} catch (error) {
					return false
				}
			},

			// SUBCATEGORIES
			postOrder: async (order) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/order",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",},
						body: JSON.stringify(order)
						})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().getOrders()
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},

			// CUSTOMERS
			getCustomers: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customers")
					const data = await resp.json()

					setStore({ customers: data })
					return true
				} catch (error) {
					return false
				}
			},

			// PAYMENT
			getPayments: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/payments")
					const data = await resp.json()

					setStore({ payments: data })
					return true
				} catch (error) {
					return false
				}
			},

			//TABS
			changeTab: (tab) => {
				setStore({active: tab})
				},

			addSelectedProducts: (products) => {
				setStore({selectedProducts: products})
				},
		}
	};
};

export default getState;
