var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;
var browserHistory = require('react-router').browserHistory;
var RadarChart = require('react-chartjs').Radar;
var PieChart = require('react-chartjs').Pie;
var LineChart = require('react-chartjs').Line;

var $ = require('jquery');
var ResumeTable = require('./ResumeTable');
var ResumeSearch = require('./ResumeSearch');

var NoMatch = React.createClass({
    render: function () {
        return (
            <div className="jumbotron text-center">
                <h1>Ops!</h1>
            </div>
        )
    }
});

var ResumeList = React.createClass({
    getInitialState: function() {
        return {persons: []};
    },

    render: function() {
        return (
            <div>
                <div className="jumbotron text-center">
                    <h1>Resume Analyzer</h1>
                    <ResumeSearch submitHandler={this.submitSearch}/>
                </div>
                <div className="container">
                    <ResumeTable persons={this.state.persons}/>
                </div>
            </div>
        )
    },

    componentDidMount: function() {
        this.loadData({searchText: ""})
    },
    
    loadData: function (searchQuery) {
        $.ajax('/api/persons', {data: searchQuery}).done(function(data) {
            this.setState({persons: data});
        }.bind(this));
    },

    submitSearch: function (searchQuery) {
        this.loadData(searchQuery)
    }
});

var ResumeProfile = React.createClass({
    getInitialState: function () {
        return {person: {
            email: null,
            resume_content: null
        }}
    },

    render: function () {
        return (
            <div>
                <div className="jumbotron center-block">
                    <h1>Profile</h1>
                    <h4 className="censored">{this.state.person.email}</h4>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-7">
                            <h4>Resume Text</h4>
                            <pre className="censored">{this.state.person.resume_content}</pre>
                        </div>
                        <div className="col-sm-5">
                            <h5>Personality Profile</h5>
                            {this.state.person.personality_profile ?
                                <div>
                                    <h5>Big 5s</h5>
                                    <RadarChart
                                        data={this.calculate_big_5(this.state.person.personality_profile.personality)}
                                        options={{responsive: true}}
                                    />
                                    <h5>Values</h5>
                                    <PieChart
                                        data={this.calculate_values(this.state.person.personality_profile["values"])}
                                        options={{
                                            responsive: true,
                                            legend: {
                                                display: true,
                                                labels: {
                                                    fontColor: 'rgb(255, 99, 132)'
                                                }
                                            }
                                        }}
                                    />
                                    <h5>Consumer Needs</h5>
                                    <LineChart
                                        data={this.calculate_needs(this.state.person.personality_profile.needs)}
                                        options={{responsive: true}}
                                    />
                                </div> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    },

    componentDidMount: function () {
        this.loadData()
    },

    loadData: function () {
        $.ajax('/api/person/' + this.props.params.uid).done(function (data) {
            this.setState({person: data})
        }.bind(this))
    },

    calculate_big_5: function (big_5) {
        var labels = [
            "Openness",
            "Conscientiousness",
            "Extraversion",
            "Agreeableness",
            "Emotional range"
        ];
        var datasets = [{
            data: [
                big_5[0].percentile*100,
                big_5[1].percentile*100,
                big_5[2].percentile*100,
                big_5[3].percentile*100,
                big_5[4].percentile*100
            ],
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)"
        }, {
            data: [100],
            fillColor: "rgba(0,0,0,0)",
            strokeColor: "rgba(0,0,0,0)"
        }];
        return {
            labels, datasets
        }
    },

    calculate_values: function (values_percentage) {
        return [
            {
                value: values_percentage[0].percentile*100,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: values_percentage[0].name
            },
            {
                value: values_percentage[1].percentile*100,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: values_percentage[1].name
            },
            {
                value: values_percentage[2].percentile*100,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: values_percentage[2].name
            },
            {
                value: values_percentage[3].percentile*100,
                color: "#949FB1",
                highlight: "#A8B3C5",
                label: values_percentage[3].name
            },
            {
                value: values_percentage[4].percentile*100,
                color: "#4D5360",
                highlight: "#616774",
                label: values_percentage[4].name
            }
        ]
    },

    calculate_needs: function (needs) {
        var labels = [];
        var data = [];
        for (i = 0; i < needs.length; i++) {
            need = needs[i];
            labels.push(need.name);
            data.push(need.percentile*100);
        }
        return {
            labels, datasets: [{
                data,
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)"
            }, {
                data: [100, 100, 100, 100, 100],
                fillColor: "rgba(0,0,0,0)",
                strokeColor: "rgba(0,0,0,0)"
            }]
        }

    }
});

ReactDOM.render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={ResumeList}/>
            <Route path="/profile/:uid" component={ResumeProfile}/>
            <Route path="*" component={NoMatch}/>
        </Router>
    ),
    document.getElementById('main')
);
