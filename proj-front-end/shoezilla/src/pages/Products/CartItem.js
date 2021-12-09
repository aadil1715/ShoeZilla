import React from "react";

const CartItem = props => {
  const { cartItem, cartKey } = props;

  const { product, amount } = cartItem;
  return (
    <div className=" column is-half">
      <div className="box">
        <div className="media"> 
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src="abc"
                alt="def"
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{  }}>
              {product.name.S}{" "}
              <span className="tag">${product.price.N}</span>
            </b>
            <div>{product.description.S}</div>
            <small>{`${amount} in cart`}</small>
          </div>
          <div
            className="media-right"
            onClick={() => props.removeFromCart(cartKey)}
          >
            {/* <span className="delete is-large"></span> */}
            <button class="button is-warning small">Remove</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;