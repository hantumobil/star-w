import React, {Component} from 'react';
import api from '../api';
import ListItem from '../components/ListItem';
import LoadingBar from '../components/LoadingBar';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            page: 1,
            loading: false,
            atBottom: false,
            filterTxt: ''
        };
        this.loadMore = this.loadMore.bind(this);
        this.handleAtBottom = this.handleAtBottom.bind(this);
        this.handleFilterTxtChange = this.handleFilterTxtChange.bind(this);
    }

    get resource() {
        return this.props.match.params.resource ? this.props.match.params.resource : 'people';
    }

    componentDidMount() {
        this.initialLoad();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleAtBottom);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            page: 1,
            filterTxt: ''
        }, () => {
            this.initialLoad(nextProps.match.params.resource);
        });
    }

    initialLoad(resource) {
        this.setState({
            list: [],
            loading: true,
            atBottom: this.atBottom,
            filterTxt: ''
        }, () => {
            // listen scroll
            window.addEventListener('scroll', this.handleAtBottom);
        });
        // let page = this.searchPage ? this.searchPage : this.state.page;

        let page = this.state.page;
        api.resource.list(resource ? resource : this.resource, page)
            .then(res => {
                const {results} = res.data;
                this.setState({
                    list: results,
                    loading: false
                })
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    loading: false
                });
            });
    }

    handleAtBottom() {
        this.setState({
            atBottom: this.atBottom
        }, () => {
            if (this.state.atBottom) {
                this.loadMore();
            }
        });
    }

    loadMore() {
        this.setState({loading: true});
        let page = this.state.page + 1;
        let currentList = this.state.list;
        api.resource.list(this.resource, page)
            .then(res => {
                const {results} = res.data;
                console.log('results:', results);
                for (let value of results) {
                    currentList.push(value);
                }
                this.setState({
                    list: currentList,
                    loading: false,
                    page: page
                });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    loading: false
                });
            });
    }

    get atBottom() {
        const scrollY = window.scrollY;
        const visibleScreen = document.documentElement.clientHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const bottomOfPage = scrollY + visibleScreen >= pageHeight;
        return bottomOfPage || pageHeight < visibleScreen;
    }

    get searchPage() {
        let search = this.props.location.search;
        return search.slice(search.length - 1, search.length);
    }

    get filteredList() {
        if (this.state.filterTxt !== '' && this.state.list.length !== 0) {
            let regex = new RegExp('' + this.state.filterTxt, 'i');
            return this.state.list.filter( item => {
                if (item.title) {
                    return item.title.match(regex);
                } else {
                    return item.name.match(regex);
                }
            });
        } else {
            return this.state.list;
        }
    }

    handleFilterTxtChange(e) {
        this.setState({
            filterTxt: e.target.value
        });
    }

    render() {
        const items = this.filteredList.map(item => <ListItem key={item.name || item.title} resource={this.resource}
                                                            data={item}/>);
        return (
            <div id='main'>
                <header className='page-header'>
                    <h1 className='title'>{this.resource}</h1>
                    <div className='action'>
                        <input className='filter-input' type='text' onChange={this.handleFilterTxtChange} placeholder='filter title or name' value={this.state.filterTxt}/>
                        {/*<button onClick={this.loadMore}>Load More</button>*/}
                        {/*<button onClick={this.logResource}>Log Resource</button>*/}
                    </div>
                </header>

                {/*TODO: put on its own component*/}
                <ul className='list-container'>
                    {items}
                    <li className='list-item full'></li>
                </ul>
                {this.state.loading ? <LoadingBar/> : ''}
            </div>
        )
    }
}

export default Main;