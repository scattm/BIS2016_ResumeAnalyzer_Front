var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');


var ResumeRow = React.createClass({
    render: function () {
        return (
            <tr>
                <td className="censored">{this.props.person.email}</td>
                <td><a href={'profile/' + this.props.person._id}>View</a></td>
            </tr>
        )
    }
});

var ResumeTable = React.createClass({
    render: function () {
        var persons = this.props.persons.map(function (person) {
            return <ResumeRow key={person._id} person={person}/>
        });
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {persons}
                </tbody>
            </table>
        )
    }
});

var ResumeList = React.createClass({
    render: function () {
        return (
            <div>
                <h4>Result List</h4>

            </div>
        )
    },
});

module.exports = ResumeTable;
