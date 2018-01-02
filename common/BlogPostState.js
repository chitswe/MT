const states={
  DRAFT:{
  	id:0,
  	Name:'saved draft'
  } ,
  PUBLISHED:{
  	id:1,
  	Name:'published'
  } ,
  ARCHIVED:{
  	id:2,
  	Name:'archived'
  }
};

const toBlogPostState=(id)=>{
	var arr = Object.keys(states).map(function (key) { return states[key]; });
	return arr[id];
}

export default states;
export {toBlogPostState};
