import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import { db } from './firebase';
import Order from './Order';

function AdminPanel() {

    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        db
            .collection('admin_orders')
            .orderBy('created', 'desc')
            .onSnapshot(snapshot => {
                setAllOrders(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })))
            });
    });

    return (
        <div className="adminPanel">
            <h1>
                All Orders
            </h1>

            <div className="adminPanel__allOrders">
                {allOrders?.map(order => (
                    <Order order={order} admin/>
                ))}
            </div>
        </div>
    )
}

export default AdminPanel;
