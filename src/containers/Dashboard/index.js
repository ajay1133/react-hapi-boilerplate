import React, { Component } from 'react';
import MarkDown from 'markdown-it';
import Markup from 'react-html-markup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
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
	
	componentDidMount = () => {
		const { dispatch, location } = this.props;
		const params = this.getHashParams(location.hash);
		
		if (params) {
		  const token = params.access_token;
      this.setState({ token });
      dispatch(bitBucketListing(token));
    }
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
  
  render () {
	  const { user, isLoad, loadErr, bitBucketList } = this.props;
    
	  console.log('bitBucketList -------- ', bitBucketList);
	  
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
            { this.getMd() }
            { this.getMdParse() }
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