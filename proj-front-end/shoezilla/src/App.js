import "./App.css";
import React, { Component } from "react";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AddProduct from './pages/Products/AddProduct';
import Cart from './pages/Products/Cart';
import ProductList from './pages/Products/ProductList';
import Context from "./Context";
import axios from 'axios';

import { withRouter } from "react-router-dom";


// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route exact path="/login" element={<Login />} />
//           <Route exact path="/signup" element={<Signup />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: []
    };
    this.routerRef = React.createRef();
  }
  async componentDidMount() {
    let user = localStorage.getItem("user");
    let cart = localStorage.getItem("cart");
    //Left from here. Add api to products by starting ec2. Step number Creating product views
    const products = await axios.get('https://8nzmg2zfe6.execute-api.us-east-1.amazonaws.com/products');
    user = user ? JSON.parse(user) : null;
    cart = cart? JSON.parse(cart) : {};
    console.log(products.data["data"])
    this.setState({ user,  products: products.data["data"], cart });
  }

  loginI = e => {
    if(localStorage.getItem("user")!=null){
      this.setState({user: localStorage.getItem("user")});
    }
  }

  logout = e => {
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  addProduct = (product, callback) => {
    let products = this.state.products.slice();
    products.push(product);
    this.setState({ products }, () => callback && callback());
  };

  addToCart = cartItem => {
    let cart = this.state.cart;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  removeFromCart = cartItemId => {
    let cart = this.state.cart;
    delete cart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };
  
  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  };

  checkout = () => {
    if (!this.state.user) {
      this.routerRef.current.history.push("/login");
      return;
    }
  
    const cart = this.state.cart;
  
    const products = this.state.products.map(p => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;
  
        axios.put(
          `http://localhost:3001/products/${p.id}`,
          { ...p },
        )
      }
      return p;
    });
  
    this.setState({ products });
    this.clearCart();
  };

  listOrders = () => {
    
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.loginI,
          addProduct: this.addProduct,
          clearCart: this.clearCart,
          checkout: this.checkout
        }}
      >
        <Router ref={this.routerRef}>
        <div className="App">
          <nav
            className="navbar container"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <b className="navbar-item is-size-4 ">ShoeZilla</b>
              <label
                role="button"
                class="navbar"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={e => {
                  e.preventDefault();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </label>
              {console.log(this.state)}
            </div>
              <div className={`navbar-menu ${ 
                   this.state.showMenu ? "is-active" : ""
                }`}>
                <Link to="/products" className="navbar-item">
                  Products
                </Link>
                {localStorage.getItem("user")!=null && JSON.parse(localStorage.getItem("user"))["accessLevel"] < 1 && (
                  <Link to="/add-product" className="navbar-item">
                    Add Product
                  </Link>
                )}
                <Link to="/cart" className="navbar-item">
                  Cart
                  <span
                    className="tag is-link"
                    style={{ marginLeft: "5px" }}
                  >
                    {Object.keys(this.state.cart).length }
                 </span>
                </Link> 
                {console.log(this.state)}
                {localStorage.getItem("user")==null? (
                  <>
                  <Link to="/login" className="navbar-item">
                    Login
                  </Link>
                  <Link to="/signup" className="navbar-item">
                    Signup
                  </Link>
                </>
                ) : (
                  <>
                  <Link to="/your-orders" onClick={this.listOrders} className="navbar-item">
                    Your orders
                  </Link>
                  <Link to="/" onClick={this.logout} className="navbar-item">
                    Logout
                  </Link>
                  </>
                )}
              </div>
            </nav>
            <Routes>
              <Route exact path="/" element={<ProductList/>} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/cart" element={<Cart/>} />
              <Route exact path="/add-product" element={<AddProduct/>} />
              <Route exact path="/products" element={<ProductList/>} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/your-orders" element={<YourOrders/>} />
            </Routes>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}