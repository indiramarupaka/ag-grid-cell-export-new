import React, { Component } from "react";
import ReactDOM from "react-dom";
import { AgGridReact } from "ag-grid-react";
import { LicenseManager } from "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

const KEY =
  "Evaluation_License-_Not_For_Production_Valid_Until_23_July_2019__MTU2MzgzNjQwMDAwMA==870f7edafb7c5f1ab4ea3e323377ea2a";

LicenseManager.setLicenseKey(KEY);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      per_page: 3,
      total: null,
      total_pages: null,
      columnDefs: [
        {
          field: "id",
          headerName: "ID",
          rowIndex: 1,
          cellRenderer: f => {
            console.log(f);
            return 'f';
          }
        },
        {
          field: "first_name",
          headerName: "First Name",
          rowIndex: 0
        },
        {
          field: "last_name",
          headerName: "Last Name"
        },
        {
          field: "email",
          headerName: "Email"
        }
      ],
      data: []
    };
  }

  dataSource = test => 
    ({getRows: params => {
      this.params = params;
      const currentPage = params.request.endRow / this.state.per_page;
      if (test) {
        this.fetchApi(currentPage).then(resp => {
          const { data, total } = resp;
          this.setState(resp, () => params.successCallback(data, total));
        });
      } else {
        this.fetchApi(2).then(resp => {
          resp = { ...resp, total: 9, total_pages: 3 }; // Clone The response
          const { data, total } = resp;
          console.log(resp)
          this.setState(resp, () => params.successCallback(data, total));
        });
      }
    }
  });

  fetchApi = page => {
    const url = new URL("https://reqres.in/api/users"),
      params = { page: page };
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    return fetch(url, options)
      .then(data => data.json())
      .then(resp => resp);
  };

  // otherData
  onGridReady = params => {
    console.log("onGridReady");
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // const { per_page } = this.state;

    params.api.setServerSideDatasource(this.dataSource(true));
  };

  onCellClicked = e => {
    console.log('e', e)
    if (e.column.colDef.field === 'email') alert('You clicked on Email');
  }
  onCellFocused = e => {
    if (e && e.column && e.column.colDef && e.column.colDef.field === 'email') {
      e.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = true;
    }
  }
  render() {
    const { columnDefs, per_page } = this.state;
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: "500px",
          width: "600px"
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={{
            width: 100,
            headerCheckboxSelection: isFirstColumn,
            checkboxSelection: isFirstColumn,
            resizable: true
          }}
          onCellClicked={this.onCellClicked}
          onCellFocused={this.onCellFocused}
          rowSelection="multiple"
          rowModelType="serverSide"
          pagination
          paginationPageSize={per_page}
          onGridReady={this.onGridReady}
          cacheBlockSize={per_page}
        />
      </div>
    );
  }
}


function isFirstColumn(params) {
  var displayedColumns = params.columnApi.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
