import React from "react";

const ProductItem = props => {
  const { product } = props;
  return (
    <div className=" column is-half"> 
      <div className="box">
        <div className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img
                src="abc"
                alt="Product"
              />
            </figure>
          </div>
          <div className="media-content">
            <b style={{ }}>
              {product.name.S}{" "}
              <span className="tag">${product.price.N}</span>
            </b>
            <div>{product.description.S}</div>
            {product.stock.N > 0 ? (
              <small>{product.stock.N + " Available"}</small>
            ) : (
              <small className="has-text-danger">Out Of Stock</small>
            )}
            <div className="is-clearfix">
              <button
                className="button is-small is-outlined is-link   is-pulled-right"
                onClick={() =>
                  props.addToCart({
                    id: product.name.S,
                    product,
                    amount: 1
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;