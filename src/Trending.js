import React from 'react';

import {Col, Row} from "react-bootstrap";
import {isEmpty} from "lodash";
import "./Trending.css";


class Trending extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            trendRepo: []
        };
        this.trendingRepos = this.trendingRepos.bind(this);
        this.showTrendingRepos = this.showTrendingRepos.bind(this);

    }

    componentDidMount() {
        this.trendingRepos();
    }

    trendingRepos() {
        const trendRepoUrl = 'https://github-trending-api.now.sh/repositories';
        fetch(trendRepoUrl)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    trendRepo: json
                });
            });
    }

    showTrendingRepos() {

        return (
            <section>{this.state.trendRepo.map((repo, ind) => {
                const repoDownloadLink = `${repo.url}/archive/master.zip`;
                return (
                    <article className="descArticle">
                        <img className="img" height="100px" width="100px" src={repo.avatar} alt="avatar"/>
                        <Col className="repoDetails">
                            <Row><td width='350px'><b><a target={"_blank"} href={repoDownloadLink}>{repo.name}</a></b></td></Row>
                            <Row><td width='350px'>Author- {repo.author}</td></Row>
                            <Row><td width='350px'>Stars- {repo.stars}</td></Row>
                            <Row><td width='350px'>Language- {repo.language}</td></Row>
                        </Col>
                    </article>
                );
            }
            )}</section>
        );
    }



    render() {
        return (
            <div>{isEmpty(this.state.trendRepo) ? "": this.showTrendingRepos()}</div>
        );
    }
}

export default Trending;