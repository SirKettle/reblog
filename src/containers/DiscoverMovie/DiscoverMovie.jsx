import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { actions as routerActions } from 'redux-router5';
// import { loadMovies } from '../../domains/movies/moviesActions';
import { setMood } from '../../domains/mood/moodActions';
import { trackClick } from '../../domains/ui/uiActions';
import * as moodSelectors from '../../domains/mood/moodSelectors';
import MOODS from '../../constants/moods';
import backgroundImage from '../../assets/images/lights.png';
import typography from '../../css/typography.css';
import { Connected as Header } from '../Header/Header';
import MoodOptions from '../../components/MoodOptions/MoodOptions';
import Button from '../../components/Button/BaseButton';

import styles from './DiscoverMovie.css';

const mapStateToProps = (state) => {
  return {
    moodsSelected: moodSelectors.moodsSelector(state)
  };
};

const mapDispatchToProps = dispatch => ({
  // requestMovies: (args) => { loadMovies(dispatch, args); },
  requestSetMood: (moodId, toggleOn = true) => { setMood(dispatch, moodId, toggleOn); },
  track: (key, data) => { trackClick(dispatch, key, data); },
  navigateTo: (name, params) => dispatch(routerActions.navigateTo(name, params))
});

export class DiscoverMovie extends Component {

  handleToggle = (e, moodKey) => {
    this.props.requestSetMood(moodKey, e.currentTarget.checked);
  }

  submitRequest = (media) => {
    const { moodsSelected, navigateTo, track } = this.props;
    const moodOptions = moodsSelected.join('-').toLowerCase();
    track(`${media}-button`, moodOptions);
    navigateTo('results', {
      media,
      options: moodOptions,
      page: 1
    });
  }

  renderMoods = () => {
    return (
      <MoodOptions
        className={styles.moods}
        moods={MOODS}
        moodsSelected={this.props.moodsSelected}
        onSelected={this.handleToggle}
      />
    );
  }

  renderButtons = () => {
    const { moodsSelected } = this.props;
    const hasSelected = moodsSelected.size > 0;

    return (
      <div className={styles.actionButtons}>
        <Button
          dataRole="suggest-button"
          className={classnames(typography.ted, styles.button, {
            [styles.active]: hasSelected
          })}
          onClick={() => this.submitRequest('tv')}
          disabled={!hasSelected}
        >TV shows</Button>
        <Button
          dataRole="suggest-button"
          className={classnames(typography.ted, styles.button, {
            [styles.active]: hasSelected
          })}
          onClick={() => this.submitRequest('movies')}
          disabled={!hasSelected}
        >Movies</Button>
      </div>
    );
  }

  render() {
    return (
      <div
        className={classnames(styles.discoverMovie)}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Header
          className={styles.header}
          includeLinks={['search', 'about']}
        />
        <div className={classnames(styles.intro)}>
          <h2 className={classnames(typography.will)}>
            What are you in the mood for today?
          </h2>
        </div>
        { this.renderMoods() }
        { this.renderButtons() }
      </div>
    );
  }
}

DiscoverMovie.propTypes = {
  track: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  // requestMovies: PropTypes.func.isRequired,
  requestSetMood: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  moodsSelected: PropTypes.object.isRequired
};

export const Connected = connect(mapStateToProps, mapDispatchToProps)(DiscoverMovie);
