import React from 'react';

import {isEmpty, reduce, extend} from "lodash"
import { Button, Form, FormControl, FormGroup, FormLabel, Col, Row, Container, Table } from 'react-bootstrap';
import './TrendingLang.css';

function convertJSON(response) {
    return response.json();
}

class TrendingLang extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
            userName: "",
            userRepos: [],
            userRepoWithLang: {}
        };
        this.userInput = this.userInput.bind(this);
        this.constructUrlForUsername = this.constructUrlForUsername.bind(this);
        this.fetchReposAPI = this.fetchReposAPI.bind(this);
        this.saveUserRepos = this.saveUserRepos.bind(this);
        this.renderRepos = this.renderRepos.bind(this);
        //this.renderPieChart = this.renderPieChart.bind(this);
        
	}

	userInput(event) {
        this.setState({userName: event.target.value});
    }

    constructUrlForUsername() {
        return "http://api.github.com/users/" + this.state.userName + "/repos";
    }

    saveUserRepos(jsonResp) {
        console.log("1", jsonResp);
        Promise.all(
            jsonResp.map(userRepo => fetch(userRepo.languages_url)
                .then(response =>
                    response.json().then(languages => {
                        return {[userRepo.name]: languages}
                    }))
            )
        ).then(data => {
            const newData = reduce(data, extend);
            this.setState({userRepoWithLang: newData})
            //console.log(this.state.userRepoWithLang);
        });

        /*this.setState(
            {
                userRepos: jsonResp,
            }
        );*/
    }

    fetchReposAPI() {
        console.log(this.constructUrlForUsername());
        fetch(
            this.constructUrlForUsername()
        ).then(convertJSON)
            .then(this.saveUserRepos)
    }

    /*renderPieChart() {
    	//console.log('renderPieChart');

    	return 'Naveen'
    }*/

    renderRepos(reposLang) {
    	console.log(reposLang)
    	//console.log(this.state.userRepoWithLang);
        if(isEmpty(reposLang)) {
            return ""
        }

        

        function repoAndLang(key) {
        	console.log(key);

            return key.map(val => console.log(val));
        }

		/*function langValue(key1) {
			console.log(key1);
        	return 	<div>{Object.keys(langValue[key1]).map(val => <p>{val}</p>)}</div>
        }*/

        return Object.keys(reposLang)//.map((key, val) => console.log(key, val));
        //return Object.keys(reposLang).map(repos => console.log(repos));
        
    }


	render() {

        return <Container className="containerClass">
            <Row className="rowClass">
                <Col>
                <Form>
                    <Col className="columnChange">
                    <Form.Group as={Row}>
                    <Form.Label column sm="2"> Username </Form.Label>
                        <Col sm="5">
                        <Form.Control type="text" placeholder="Enter username" onChange={this.userInput}/>
                        </Col>
                        <Col sm="2">
                            <Button variant="primary" size="sm" onClick={this.fetchReposAPI}>Submit</Button>
                        </Col>
                    </Form.Group>
                </Col>
                </Form>
                </Col>
            </Row>
            <Row className="imgRepos">
            <Col>
            	<p>Language Percentage</p>
            	{this.renderRepos(this.state.userRepoWithLang)}
            </Col>
            </Row>
        </Container>

    }
}


export default TrendingLang;