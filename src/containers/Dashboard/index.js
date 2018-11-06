import React, { Component } from 'react';
import MarkDown from 'markdown-it';
import Markup from 'react-html-markup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, List } from 'semantic-ui-react';
import config from '../../config';
import { bitBucketListing } from '../../redux/modules/bitBucketRepo';

const { bitBucket } = config;
const md = MarkDown({
  html: false,
  linkify: true,
  typographer: true
});

class Dashboard extends Component {
  state = {
    token: null
  };
  
	static propTypes = {
		dispatch: PropTypes.func,
    location: PropTypes.object,
    bitBucketList: PropTypes.array
	};
  
	componentDidMount = () => {
		const { dispatch, location } = this.props;
		const params = this.getHashParams(location.hash);
		
		if (params) {
		  const token = params.access_token;
      this.setState({ token });
      const listData = { token };
      dispatch(bitBucketListing(listData));
    }
	};
  
  getHashParams = (hash) => {
    let hashParams = {};
    let e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) {
        return decodeURIComponent(s.replace(a, " "));
      },
      q = hash.toString().substring(1);
    
    while ((e = r.exec(q)))
      hashParams[d(e[1])] = d(e[2]);
    
    return hashParams;
  };
  
  bitBucketConnect = () => {
    window.location =
      `https://bitbucket.org/site/oauth2/authorize?client_id=${bitBucket.key}&response_type=token`;
	};
  
	getMd = () => {
    return md.render(`
# Horizontal Rules

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

You will like those projects!

---

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
`);
  };
  
  getMdParse = () => {
    return (
      <Markup
        htmlString= { this.getMd() }
      />
    );
  };
  
  getBitBucketData = (e, href, type) => {
    const { dispatch } = this.props;
    const { token } = this.state;
    if (type === 'commit_directory') {
      const listData = Object.assign({}, { token, path: href.split('/src')[1] });
      dispatch(bitBucketListing(listData));
    }
  };
  
  getLevelUp = (repo) => {
    let href_1 = '', href_2 = '';
    if (repo.path.split('/').length > 1) {
      href_2 = repo.path.split('/').slice(-4, -2)[0] || 'src';
      href_1 = repo.links.self.href.split(href_2)[0];
      
      return (
        <List.Icon
          size='large'
          name='reply'
          onClick={ (e) => this.getBitBucketData(e, (href_1+href_2), 'commit_directory') }
        />);
    }
  };
  
  render () {
	  const { user, isLoad, loadErr, bitBucketList } = this.props;
    
//	  console.log('bitBucketList -------- ', bitBucketList);
	  
    if (!user || (isLoad && loadErr)) {
      return (
        <div>
          {
            user && <h3>An Error Occurred : { loadErr }</h3>
          }
        </div>
      );
    }
    
    return (
      <div>
        <div className="left aligned topAdujusting">
          <h3 className="">WELCOME {user.firstName + ' ' + user.lastName}</h3>
        </div>
  
        <Button className='ui facebook button' style={{ marginLeft: '20px' }} role='button'
                onClick={ this.bitBucketConnect }>
          <i aria-hidden='true' className='bitbucket icon' /> Bitbucket
        </Button>
  
        <div className="ui card fluid cardShadow mb20">
          <div className="content pageMainTitle">
            <h4>LISTING FILES FROM BITBUCKET REPOSITORY</h4>
          </div>
  
          <div className="content">
            <List>
              <List.Item>
                { bitBucketList && this.getLevelUp(bitBucketList[0]) }
              </List.Item>
              <List.Item>
                { bitBucketList && <List.Icon size='large' name='folder open'/> }
                <List.Content>
                  <List.Header>
                    { bitBucketList && (bitBucketList[0].path.split('/').slice(-2, -1)[0] || 'src') }
                  </List.Header>
                  <List.List>
                  {
                    bitBucketList && bitBucketList.map((repo, idx) => {
                      return (
                        <List.Item as='a' key={idx}>
                          <List.Icon
                            size='large'
                            verticalAlign='middle'
                            name={ (repo.type === 'commit_directory') ? 'folder' : 'file' }
                            onClick={ (e) => this.getBitBucketData(e, repo.links.self.href, repo.type) }
                          />
                          <List.Content>
                            <List.Header>{repo.path.split('/').pop()}</List.Header>
                          </List.Content>
                        </List.Item>
                      );
                    })
                  }
                </List.List>
              </List.Content>
              </List.Item>
            </List>
            {/*{ this.getMd() }*/}
            {/*{ this.getMdParse() }*/}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
	user: state.get('auth').get('user'),
  isLoad: state.get('bitBucketRepo').get('isLoad'),
	loadErr: state.get('bitBucketRepo').get('loadErr'),
  bitBucketList: state.get('bitBucketRepo').get('bitBucketList')
}))(Dashboard);