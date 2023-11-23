const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			active:"",
			products: [],
			categories: [],
			orders: [],
			customers: [],
			payments:[],
			selectedProducts:[],
			token: "",
			user: "",
			adminNav: false,
			info:{ years:{}, categories:{}},
			shop:{},
			cart:[],
			random: 0
		},
		actions: {
			// Use getActions to call a function within a fuction

			//PRODUCTS
			getProducts: async () => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/products",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
					})
					const data = await resp.json()
					if (data.msg) return false
					setStore({ products: data })
					return true;
				} catch (error) {
					return false
				}
			},

			postProduct: async (product) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/product",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
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
			putProduct: async (product) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/product/${product.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify(product)
						})
					const data = await resp.json()
					getActions().getProducts()
					return true
				} catch (error) {
					return false
				}
			},

			deleteProduct: async (id) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/product/${id}`, {
						method: "DELETE",
						headers: {
							"Authorization": "Bearer " + token
						},
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
			
			// CATEGORIES
			getCategories: async () => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/categories",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
					})
					const data = await resp.json()
					if (data.msg) return false
					setStore({ categories: data })
					return true
				} catch (error) {
					return false
				}
			},

			postCategory: async (category) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/category",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
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
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/subcategory",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
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
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/orders",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
					})
					const data = await resp.json()
					if (data.msg) return false
					setStore({ orders: data })
					return true
				} catch (error) {
					return false
				}
			},
			deleteOrder: async (id) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/order/${id}`, {
						method: "DELETE",
						headers: {
							"Authorization": "Bearer " + token
						},
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
			postOrder: async (order) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/order",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify(order)
						})
					const data = await resp.json()
					if (resp.ok == true){
						let num = Math.random()
						setStore({random: num})
						getActions().getOrders()
						return data;
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
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customers",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
					})
					
					const data = await resp.json()
					if (data.msg) return false

					setStore({ customers: data })
					return true
				} catch (error) {
					return false
				}
			},
			postCustomer: async (customer) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customer",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify(customer)
						})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().getCustomers()
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},
			putCustomer: async (customer) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/customer/${customer.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify(customer)
						})
					const data = await resp.json()
					getActions().getCustomers()
					return true
				} catch (error) {
					return false
				}
			},
			deleteCustomer: async (id) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/customer/${id}`, {
						method: "DELETE",
						headers: {
							"Authorization": "Bearer " + token
						},
					})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().getCustomers()
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},

			// PAYMENT
			getPayments: async () => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/payments",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
					})
					const data = await resp.json()
					if (data.msg) return false

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
			changeAdminNav: (bool) => {
				setStore({adminNav: bool})
			},

			addSelectedProducts: (products) => {
				setStore({selectedProducts: products})
			},
			addToCart: (products) => {
				let num = Math.random()
				setStore({random: num})
				setStore({cart: products})
				localStorage.setItem("cart", JSON.stringify(products));
			},
			checkCart: () => {
				let localCart = localStorage.getItem('cart')
				if (localCart){
					setStore({cart: JSON.parse(localCart)})
				}
			},
			// USERS
			getUserToken: async (user) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/token",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json",},
						body: JSON.stringify(user)
						})
					const data = await resp.json()
					if (resp.ok){
						localStorage.setItem("token", data.token);
						getActions().checkToken()
						return true;
					}
					else return false
				} catch (error) {
					return false
				}
			},
			putUser: async (user) => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + `/api/user/${user.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
						body: JSON.stringify(user)
						})
					const data = await resp.json()
					if (resp.ok == true){
						getActions().checkToken()
						return true
					}
					else{
						return false
					}
				} catch (error) {
					return false
				}
			},
			
			checkToken: async () => {
				// retrieve token form localStorage
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/account",
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								"Authorization": "Bearer " + token
							},
						})
					const data = await resp.json()
					if (data.msg){
						getActions().logout()
						return false
					}
					else if (data){
						setStore({ token: token, user: data })
						return {admin: data.admin}
					}
					else{
						getActions().logout()
						return false
					}
				} catch (error) {
					return false
				}
			},
			postUser: async (user) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/user",
						{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(user)
						})
					const data = await resp.json()
					if (resp.ok == true){
						await getActions().getUserToken(user)
						return true;
					}
					else{
						return false;
					}
				} catch (error) {
					return false
				}
			},
		

			getInfo: async () => {
				const token = localStorage.getItem('token');
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/info",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token
						},
					})
					const data = await resp.json()

					setStore({ info: data })
					return true
				} catch (error) {
					return false
				}
			},
			getShopInfo: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/shop")
					const data = await resp.json()

					setStore({ shop: data})
					return true
				} catch (error) {
					return false
				}
			},
			logout: async () => {
				try {
					localStorage.setItem("token", "")
					setStore({ token: "", user: ""})
					return true
				} catch (error) {
					throw Error(error)
				}
			}
		}
	};
};

export default getState;
