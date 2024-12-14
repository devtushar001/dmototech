import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fassets } from "../../../../frontend/src/frontend_assets/assets";
import "./Orders.css";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const orderList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/api/order/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.orders) {
        toast.error(result.message || "Failed to fetch orders.");
        return;
      }

      toast.success(result.message || "Orders fetched successfully.");
      setOrders(result.orders);
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    console.log(newStatus, orderId)
    try {
      const response = await fetch(`${url}/api/order/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Order status updated successfully.");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(result.message || "Failed to update order status.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while updating status.");
    }
  };

  useEffect(() => {
    orderList();
  }, []);

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="order-container">
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <img src={fassets.parcel_icon} alt="Order Icon" />
              <div>
                <p className="order-item-accessory">
                  {order.items.map((item, i) =>
                    `${item.name} x ${item.quantity}${
                      i < order.items.length - 1 ? ", " : ""
                    }`
                  )}
                </p>
                <p className="order-item-name">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <div className="order-item-address">
                  <p>
                    {order.address?.street},{" "}
                    {order.address?.city},{" "}
                    {order.address?.state},{" "}
                    {order.address?.country},{" "}
                    {order.address?.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address?.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p
                className={
                  order.payment ? "success" : "fail"
                }
              >
                &#8377;{Math.round(order.amount)}.00
              </p>
              <select
                onChange={(event) => {
                  statusHandler(event, order._id);
                }}
                value={order.status}
              >
                <option value="Processing">Processing</option>
                <option value="Payment Failed">Payment Failed</option>
                <option value="Hold">Hold</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
