import React from 'react';
import DateTimeParser from '../../common/DateTimeParser';

const ColorStyle = (value) => {
  let style ={
    color:'#fff',
    backgroundColor:'#777',
    border:'1px solid #777'
  };

 return style;

}
class BlogPostTimeHistoryLabel extends React.Component {
  render() {
    let {dateTimeHistory} = this.props;
    let colorStyle = ColorStyle(dateTimeHistory);
    let style ={
      fontSize :'12px',
      padding:'8px',
      flexShrink:0,
      ...colorStyle
    }

    return (
      <span style={style}>
      {dateTimeHistory}
      </span>
    )

  }
}
export default BlogPostTimeHistoryLabel;
export {ColorStyle};
