var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');


var ResumeSearch = React.createClass({
    render: function() {
        return (
            <form className="form-inline" name="searchForm">
                <div className="form-group">
                    <input type="text" className="form-control"
                           ref="searchText"
                           name="searchText"
                           onKeyPress={this.keyPressHandler}
                           onClick={()=>{this.refs.searchText.select()}}
                           placeholder="Enter the skills here..."></input>
                </div>
                <button type="button" className="btn btn-primary"
                        onClick={this.submitSearch}
                >Search</button>
            </form>
        )
    },

    submitSearch: function (e) {
        this.props.submitHandler({searchText: document.forms.searchForm.searchText.value});
    },
    
    keyPressHandler: function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.props.submitHandler({searchText: document.forms.searchForm.searchText.value});
        }
    }
});

module.exports = ResumeSearch;
