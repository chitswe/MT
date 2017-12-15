import React from 'react';
import CustomerOrderStatus from '../../common/CustomerOrderStatus';
import {OrderStatusColor} from './OrderStatusLabel';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import update from 'react-addons-update';
class CustomerOrderStatusSelectField extends React.Component{
	componentWillReceiveProps({value}){
		if(value !==this.props.value && value.indexOf(-1)>-1 && this.props.value.indexOf(-1) ===-1){
			let all=Object.keys(CustomerOrderStatus).map(key=>(CustomerOrderStatus[key]));
			this.props.onChange(null,null,[-1,...all]);
		}else if(value !== this.props.value && value.indexOf(-1)===-1 && this.props.value.indexOf(-1)>-1 ){
			this.props.onChange(null,null,[]);
		}
	}
	renderIcon(status){
		const colorStyle = OrderStatusColor(status);
		const style = {
			width:'22px',
			height:'22px',
			display:'inline-block',
			...colorStyle
		}
		return (<span style={style}/>)
	}
	render(){
		let {floatingLabelText,hintText,dropDownMenuProps,value,multiple,...p} = this.props;
		floatingLabelText = floatingLabelText? floatingLabelText: "Order Status";
		hintText = hintText? hintText:'Order Status';
		dropDownMenuProps = dropDownMenuProps? dropDownMenuProps:{
						targetOrigin:{vertical:'top',horizontal:'left'},
		        		anchorOrigin:{vertical:'bottom',horizontal:'left'}
					};
		return (
			<SelectField 
				multiple={true}
				{...p}
				value={value}
				floatingLabelText={floatingLabelText}
				hintText={hintText}
				dropDownMenuProps={dropDownMenuProps}
			>
				<MenuItem insetChildren={true} checked={value && value.indexOf(-1)>-1} value={-1} primaryText="All" />
				<MenuItem insetChildren={true} checked={value && value.indexOf(CustomerOrderStatus.ORDERED) > -1} style={{verticalAlign:'middle'}} rightIcon={this.renderIcon(CustomerOrderStatus.ORDERED)} value={CustomerOrderStatus.ORDERED} primaryText="Ordered " key={CustomerOrderStatus.ORDERED}/>
				<MenuItem insetChildren={true} checked={value && value.indexOf(CustomerOrderStatus.PROCRESSING_PAYMENT) > -1} rightIcon={this.renderIcon(CustomerOrderStatus.PROCRESSING_PAYMENT)} value={CustomerOrderStatus.PROCRESSING_PAYMENT} primaryText="Processing Payment" key={CustomerOrderStatus.PROCRESSING_PAYMENT}/>
				<MenuItem insetChildren={true} checked={value && value.indexOf(CustomerOrderStatus.PAYMENT_RECEIVED) > -1} rightIcon={this.renderIcon(CustomerOrderStatus.PAYMENT_RECEIVED)} value={CustomerOrderStatus.PAYMENT_RECEIVED} primaryText="Payment Received" key={CustomerOrderStatus.PAYMENT_RECEIVED}/>
				<MenuItem insetChildren={true} checked={value && value.indexOf(CustomerOrderStatus.SHIPPING) > -1} rightIcon={this.renderIcon(CustomerOrderStatus.SHIPPING)} value={CustomerOrderStatus.SHIPPING} primaryText="Start Shipping" key={CustomerOrderStatus.SHIPPING}/>
				<MenuItem insetChildren={true} checked={value && value.indexOf(CustomerOrderStatus.SHIPPED) > -1} rightIcon={this.renderIcon(CustomerOrderStatus.SHIPPED)} value={CustomerOrderStatus.SHIPPED} primaryText="Shipped" key={CustomerOrderStatus.SHIPPED}/>
				<MenuItem insetChildren={true} checked={value && value.indexOf(CustomerOrderStatus.COMPLETED) > -1} rightIcon={this.renderIcon(CustomerOrderStatus.COMPLETED)} value={CustomerOrderStatus.COMPLETED} primaryText="Completed" key={CustomerOrderStatus.COMPLETED}/>
				<MenuItem insetChildren={true} checked={value && value.indexOf(CustomerOrderStatus.CANCELLED) > -1} rightIcon={this.renderIcon(CustomerOrderStatus.CANCELLED)} value={CustomerOrderStatus.CANCELLED} primaryText="Cancelled" key={CustomerOrderStatus.CANCELLED}/>
			</SelectField>
			);
	}
}
export default CustomerOrderStatusSelectField;