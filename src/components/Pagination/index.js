import React from 'react';
import PropTypes from 'prop-types';
import { Container, Menu, Button, Icon } from 'semantic-ui-react'; 

export default class Pagination extends React.Component {
  static propTypes = {
    totalEntries: PropTypes.number,
    offset: PropTypes.number,
    currentPage: PropTypes.number,
    navigate: PropTypes.func
  }

  static defaultProps = {
    totalEntries: 0,
    offset: 0,
    currentPage: 0,
    navigate: null
  };


  renderButton = (v, isCurrent, isClick) => {
    const { navigate } = this.props;

    return (
      <Button
        basic
        as="a"
        onClick={isClick ? () => navigate(v) : () => {}}
        className={isCurrent ? 'page-item active' : 'page-item'}
        key={v}
        href="#top"
      >
        <span>{isClick ? v : '...'}</span>
      </Button>
    );
  }

  renderNavigateButton = (disableBtn, page, text) => {
    const { navigate, offset } = this.props;
    return (
      <Button
        basic
        as="a"
        icon
        disabled={disableBtn}
        onClick={() => navigate(page, offset)}
        href="#top"
      >
        {text}
      </Button>
    );
  }

  render() {
    const { totalEntries, offset, currentPage } = this.props;
    if (totalEntries <= 0) {
      return (
        <Container textAlign="left" className="user-list-table-entries mt-2">
          {'Showing 0 of 0 entries'}
        </Container>
      );
    }

    const page = Math.ceil(totalEntries / offset) >= currentPage ? currentPage : 1;
    const range = [];
    for (let i = 1; i <= Math.ceil(totalEntries / offset); i++) {
      range.push(i);
    }

    const disablePrevBtn = page === 1;
    const disableNextBtn = page === range.length;
    // const userStartRange = page === 1 ? 1 : ((offset * (page - 1)) + 1);
    // const userEndRange = page === range.length ? totalEntries : (offset * page);
    const nextPage = page === range.length ? page : page + 1;
    const prevPage = page === 1 ? 1 : page - 1;

    return (
      <div className="row">
        <div className="col-sm-12 col-12">
          <Menu floated="right" pagination>
            {
              this.renderNavigateButton(disablePrevBtn, prevPage, <Icon name="chevron left" />, <span>nest</span>)
            }

            {
              range.map((v) => {
                const isCurrent = v === page;

                if (v === page - 1 || v === page + 1 || v === page || v === 1) {
                  return (this.renderButton(v, isCurrent, true));
                }

                if (v === page + 2 || v === page - 2) {
                  return (this.renderButton(v, isCurrent, false));
                }

                if (v === range.length) {
                  return (this.renderButton(v, isCurrent, true));
                }
                return null;
              })
            }

            {
              this.renderNavigateButton(disableNextBtn, nextPage, <Icon name="chevron right" />)
            }
          </Menu>
        </div>
      </div>
    );
  }
}
