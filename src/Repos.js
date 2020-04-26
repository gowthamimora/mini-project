

import React from 'react';

import {isEmpty, reduce, extend, pickBy} from "lodash"
import { Button, Form, FormControl, FormGroup, FormLabel, Col, Row, Container, Table,  Dropdown, DropdownButton} from 'react-bootstrap';
import './Repos.css';
import Trending from "./Trending";


function convertJSON(response) {
    return response.json();
}

class Repos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userRepos: [],
            userRepoWithLang: {},
            userRepoOnSelectLang: {},
            languages: []
        };
        this.userInput = this.userInput.bind(this);
        this.constructUrlForUsername = this.constructUrlForUsername.bind(this);
        this.fetchReposAPI = this.fetchReposAPI.bind(this);
        this.saveUserRepos = this.saveUserRepos.bind(this);
        this.renderRepos = this.renderRepos.bind(this);
        this.onSelectDropdown = this.onSelectDropdown.bind(this);
        this.renderMainRepo = this.renderMainRepo.bind(this);
    }

    userInput(event) {
        this.setState({userName: event.target.value});
    }

    constructUrlForUsername() {
        return "http://api.github.com/users/" + this.state.userName + "/repos";
    }

    saveUserRepos(jsonResp) {
        Promise.all(
            jsonResp.map(userRepo => fetch(userRepo.languages_url)
                .then(response =>
                    response.json().then(languages => {
                        return {[userRepo.name]: languages}
                    }))
            )
        ).then(data => {
            const newData = reduce(data, extend);
            const languages = Object.values(newData).map(language => Object.keys(language)).flatMap(x => x);
            const uniqueLang = Array.from(new Set(languages));
            this.setState({languages: uniqueLang});
            this.setState({userRepoWithLang: newData, userRepoOnSelectLang: ""});
        });

        this.setState(
            {
                userRepos: jsonResp,
            }
        );
    }

    fetchReposAPI() {
        console.log(this.constructUrlForUsername());
        fetch(
            this.constructUrlForUsername()
        ).then(convertJSON)
            .then(this.saveUserRepos)
    }

    renderRepos(reposLang, userRepos) {
        if(isEmpty(reposLang)) {
            return ""
        }

        const userName = userRepos[0].owner.login;

        function repoAndLang(key) {
            const repoDownLoadLink = `https://github.com/${userName}/${key}/archive/master.zip`;
            return <tr key={key}>
                <td className="RepoBold"><a target={"_blank"} href={repoDownLoadLink}>{key}</a></td>
                <td className="langStyle1">{Object.keys(reposLang[key]).map((lang, ind) => <span key={lang}>{ (ind ? ', ' : '') + lang} </span>)}</td>
            </tr>
        }

        return Object.keys(reposLang).map(repoAndLang);
    }

    renderMainRepo() {
        const repoLangTable =  <Table className="repoListTable" striped hover>
            <tbody>{this.renderRepos(this.state.userRepoWithLang, this.state.userRepos)}</tbody>
        </Table>;
        const repoOnSelectLangTable =  <Table className="repoListTable" striped hover>
            <tbody>{this.renderRepos(this.state.userRepoOnSelectLang, this.state.userRepos)}</tbody>
        </Table>;

        return(
            <Row className="imgRepos1">

                <Col className="imgLeft">
                    {isEmpty(this.state.userRepos) ? "" : <img className="imgDisplay" src={isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.avatar_url}/>}
                    <h5 style={{textAlign:"center"}}>{isEmpty(this.state.userRepos) ? "" : this.state.userRepos[0].owner.login}</h5>
                </Col>
                <Col sm='7'>
                    {isEmpty(this.state.userRepoOnSelectLang) ? repoLangTable : repoOnSelectLangTable }
                </Col>
                <Col>
                    {isEmpty(this.state.languages) ? "" : <DropdownButton id="dropdown-item-button" title="Choose Language">
                        {this.state.languages.map(language =>

                            <Dropdown.Item as="button" className="colorBtn" key={language}
                                           onSelect={() => this.onSelectDropdown(language)}>{language}
                            </Dropdown.Item>)
                        }
                    </DropdownButton>}

                </Col>
            </Row>
        );
    }

    render() {
        return <Container className="containerClass">
            <Row className="rowClass1">
                <Form>
                    <Form.Group as={Row}>
                        <Col sm="8">
                        <Form.Control type="text" placeholder="Enter Username..." onChange={this.userInput}/>
                        </Col>
                        <Col sm="2">
                            <Button variant="primary" size="md" onClick={this.fetchReposAPI}>Submit</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Row>
            <Row className="tableAdjust">
                    {isEmpty(this.state.userRepos) ? <Trending />: ""}
            </Row>
            {isEmpty(this.state.userRepos) ? "": this.renderMainRepo()}
        </Container>

    }

    onSelectDropdown(language) {
        const newReposWithLang = pickBy(this.state.userRepoWithLang, function(value, key, object) {
            return Object.keys(value).includes(language);
        });
        this.setState({userRepoOnSelectLang: newReposWithLang});
    }
}
export default Repos;