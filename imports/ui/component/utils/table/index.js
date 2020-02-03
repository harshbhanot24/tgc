import BootstrapTable from "react-bootstrap-table-next";
import React from "react";
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
const Reusabletable = props => {
  const {
    data,
    columns
  } = props;
  const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    Showing { from } to { to } of { size } Results
  </span>
);

const options = {
  paginationSize: 4,
  pageStartIndex: 0,
  // alwaysShowAllBtns: true, // Always show next and previous button
  // withFirstAndLast: false, // Hide the going to First and Last page button
  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
  hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  firstPageText: 'First',
  prePageText: 'Back',
  nextPageText: 'Next',
  lastPageText: 'Last',
  nextPageTitle: 'First page',
  prePageTitle: 'Pre page',
  firstPageTitle: 'Next page',
  lastPageTitle: 'Last page',
  showTotal: true,
  paginationTotalRenderer: customTotal,
  sizePerPageList: [{
    text: '5', value: 5
  }, {
    text: '10', value: 10
  }, {
    text: '20', value: 20
  }] // A numeric array is also available. the purpose of above example is custom the text
};
return(
<BootstrapTable keyField='_id' data={ data } bordered={ false}columns={ columns } pagination={ paginationFactory(options) } />
);
}
  export default Reusabletable;