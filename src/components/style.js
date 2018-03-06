//style.js
const style = {
  commentBox: {
    width:'100%',
    margin:'0 auto',
    fontFamily:'Helvetica, sans-serif'
  },
  title: {
    textAlign:'left',
    textTransform:'uppercase',
    fontSize: '15px',
    marginTop: '15px',
    marginLeft: '10px',
    flex: '1',
  },
  cropName:{
    fontSize: '10px',
    textTransform:'none',
    display:'block',
  },
  commentList: {
    border:'1px solid #f1f1f1',
    padding:'0px',
    //maxHeight:'70vh',
    //overflow:'scroll'
  },
  hidden:{
    display:'none',
  },
  field: {
    backgroundColor:'#f5f5f5',
    margin:'5px',
    padding:'0px',
    fontSize:'.85rem',
    display:'flex',
  },
  commentForm: {
    margin:'10px',
    display:'flex',
    flexFlow:'row wrap',
    justifyContent:'space-between'
  },
  commentFormAuthor: {
    minWidth:'150px',
    margin:'3px',
    padding:'0px',
    borderRadius:'3px',
    height:'40px',
    flex:'2'
  },
  commentFormText: {
    flex:'4',
    minWidth:'400px',
    margin:'3px',
    padding:'0 10px',
    height:'40px',
    borderRadius:'3px'
  },
  commentFormPost: {
    minWidth:'75px',
    flex:'1',
    height:'40px',
    margin:'5px 3px',
    fontSize:'1rem',
    backgroundColor:'#A3CDFD',
    borderRadius:'3px',
    color:'#fff',
    textTransform:'uppercase',
    letterSpacing:'.055rem',
    border:'none'
  },
  updateLink: {
    textDecoration:'none',
    paddingRight:'15px',
    fontSize:'.7rem'
  },
  deleteLink: {
    textDecoration:'none',
    paddingRight:'15px',
    fontSize:'.7rem',
    color:'red'
  }
}

module.exports = style;