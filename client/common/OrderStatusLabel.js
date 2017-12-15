import React from 'react';
import CustomerOrderStatus from '../../common/CustomerOrderStatus';

const OrderStatusColor = (OrderStatusId)=>{
	let style={
			color:'#fff',
		};
	switch(OrderStatusId){
			case CustomerOrderStatus.ORDERED:
				style.backgroundColor='#777';
				style.border='1px solid #777';
				break;
			case CustomerOrderStatus.PROCRESSING_PAYMENT:
				style.backgroundColor='#337ab7';
				style.border='1px solid #337ab7';
				break;
			case CustomerOrderStatus.PARTIALLY_PAID:
			case CustomerOrderStatus.PAYMENT_RECEIVED:
				style.backgroundColor='#5cb85c';
				style.border='1px solid #5cb85c';
				break;
			case CustomerOrderStatus.SHIPPING:
				style.backgroundColor='#5bc0de';
				style.border='1px solid #5bc0de';
				break;
			case CustomerOrderStatus.SHIPPED:
				style.backgroundColor='#f0ad4e';
				style.border='1px solid #f0ad4e';
				break;
			case CustomerOrderStatus.COMPLETED:
				style.backgroundColor='#d9534f';
				style.border='1px solid #d9534f';
				break;
			case CustomerOrderStatus.CANCELLED:
			default:
				style.backgroundColor='#fff';
				style.color='#000';
				style.border='1px solid #000';
				break;
		}
		return style;
};
class OrderStatusLable extends React.Component{
	render(){
		let {OrderStatus} = this.props;
		let {OrderStatusId,Name} = OrderStatus?OrderStatus:{};
		let colorStyle = OrderStatusColor(OrderStatusId);
		let style={
			fontSize:'12px',
			padding:'8px',
			flexShrink:0,
			...colorStyle
		};
		return (
			<span
				style={style}
			>
				{Name}
			</span>
			);
	}
}

export default OrderStatusLable;
export {OrderStatusColor};