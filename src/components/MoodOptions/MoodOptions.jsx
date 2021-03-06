import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './MoodOptions.css';
import typography from '../../css/typography.css';

const MoodOptions = ({ className, moods, moodsSelected, onSelected }) => {
  const getIsChecked = (key) => {
    return moodsSelected.indexOf(key) !== -1;
  };

  return (
    <div className={classnames(className, styles.moodOptions)}>
      {
        Object.keys(moods).map((key) => {
          const mood = moods[key];
          const name = `checkbox${key}`;
          return (
            <div className={styles.option} key={key}>
              <input
                className={styles.input}
                id={name}
                type="checkbox"
                onChange={(e) => { onSelected(e, key); }}
                checked={getIsChecked(key)}
              />
              <label className={classnames(styles.label)} htmlFor={name}>
                <h3 className={typography.harrison}>{ mood.moodFor }</h3>
                <p className={classnames(typography.elliot, styles.longLabel)}>
                  { mood.longLabel }
                </p>
              </label>
            </div>
          );
        })
      }
    </div>
  );
};

MoodOptions.propTypes = {
  className: PropTypes.string,
  /* eslint react/forbid-prop-types: 0 */
  moods: PropTypes.object.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  moodsSelected: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired
};

MoodOptions.defaultProps = {
  className: 'moods-list'
};

export default MoodOptions;
