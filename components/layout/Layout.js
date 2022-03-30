import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';
//this component set the layout format for all pages of the site. For instance it is saying the header will be first then all child componentns
function Layout(props) {
  return (
    <div >
     <MainNavigation />  {/* //this will be on all pages */}
      <main className={classes.main}>{props.children}</main> {/* This will be page specific, hence recieved via props*/}
    </div>
  );
}

export default Layout;
