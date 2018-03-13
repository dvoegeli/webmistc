import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import AppState from '/imports/api/appState.js';

// Vote component - menu for voting features
class Vote extends Component {
  closeMenu(){
    AppState.set('features_show', 'none');
  }
  togglePollList(){
    AppState.set('vote_list_open', !this.props.vote_list_open);
  }
  togglePoll(){
    AppState.set('vote_start', !this.props.vote_start);
  }
  changePoll(poll){
    AppState.set({
      'vote_poll': poll,
      'vote_list_open': !this.props.vote_list_open
    });
  }
  render() {
    const vote = classNames(
      'panel w3-card-4 w3-animate-right', {
      'w3-hide': !_.isEqual(this.props.features_show, 'vote'),
    });
    const voting = {
      polls: classNames(
        'voting-polls w3-dropdown-content w3-card-4 w3-container', {
        'w3-show': this.props.vote_list_open,
      }),
      startedButtonIcon: classNames(
        'fa fa-lg fa-fw w3-margin-right', {
        'fa-play': !this.props.vote_start,
        'fa-stop': this.props.vote_start,
      }),
    }
    return (
      <div className={vote}>
        <header className="panel__header w3-container w3-teal">
          <a className="w3-teal w3-left-align" onClick={()=>this.closeMenu()}>
            <i className="fa-chevron-left fa fa-lg fa-fw w3-margin-right"/>
            Voting
          </a>
        </header>
        <main className="panel__content w3-container">
          <ul className="w3-ul w3-text-teal">
            <li>
              <h4>Polls</h4>
              <div className="w3-dropdown-click w3-slim w3-margin-bottom">
                <button onClick={()=>this.togglePollList()} className="w3-btn w3-btn-block w3-teal">
                  {this.props.vote_poll === 'none' ? 'Choose a poll' : this.props.vote_poll}
                  <i className="fa-caret-down fa fa-fw w3-margin-left"></i>
                </button>
                <div className={voting.polls}>
                  <a className="voting-polls__tag" onClick={()=>this.changePoll('Like WebMISTC?')} href="#">Like WebMISTC?</a>
                  <a className="voting-polls__tag" onClick={()=>this.changePoll('Like waffles?')} href="#">Like waffles?</a>
                </div>
              </div>
              {this.props.vote_poll === 'Like WebMISTC?' ? 
                <div className="w3-slim">
                  <div className="w3-progress-container w3-grey">
                    <div className="w3-progressbar w3-orange" style={{width: 75 + '%'}}/>
                    <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>Yes | 15 votes | 75%</div>
                  </div>
                  <div className="w3-progress-container w3-grey">
                    <div className="w3-progressbar w3-blue" style={{width: 25 + '%'}}/>
                    <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>Yeah! | 5 votes | 25%</div>
                  </div>
                </div>
              :''}
              {this.props.vote_poll === 'Like waffles?' ? 
                <div>
                  <div className="w3-progress-container w3-grey">
                    <div className="w3-progressbar w3-green" style={{width: 100 + '%'}}/>
                    <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>Yes | 20 votes | 100%</div>
                  </div>
                  <div className="w3-progress-container w3-grey">
                    <div className="w3-progressbar w3-red" style={{width: 0 + '%'}}/>
                    <div className="w3-center w3-text-white w3-margin-left" style={{position: 'absolute'}}>No | 0 votes | 0%</div>
                  </div>
                </div>
              :''}
              {this.props.vote_poll ? 
                <button onClick={()=>this.togglePoll()} className="w3-btn-block w3-section w3-cyan w3-text-white w3-ripple w3-padding">
                  <i className={voting.startedButtonIcon}/>
                  {this.props.vote_start ? 'Cutoff Votes' : 'Accept Votes'}
                </button>
              :''}
            </li>
            <li>
              <h4>Create</h4>
              <form onSubmit={(event)=>{event.preventDefault()}}>                   
                <div className="flex-row w3-row w3-section">
                  <div className="w3-col" style={{width: 35 + 'px'}}>
                    <i className="fa-tag fa fa-lg fa-fw"/>
                  </div>
                  <div className="w3-rest">
                    <input className="w3-input" name="title" type="text" placeholder="tag"/>
                  </div>
                </div>

                <div className="flex-row w3-row w3-section">
                  <div className="w3-col" style={{width: 35 + 'px'}}>
                    <i className="fa-pencil-square-o fa fa-lg fa-fw"/>
                  </div>
                  <div className="w3-rest">
                    <input className="w3-input" name="answer1" type="text" placeholder="yes"/>
                  </div>
                </div>

                <div className="flex-row w3-row w3-section">
                  <div className="w3-col" style={{width: 35 + 'px'}}>
                    <i className="fa-pencil-square-o fa fa-lg fa-fw"/>
                  </div>
                  <div className="w3-rest">
                    <input className="w3-input" name="answer2" type="text" placeholder="no"/>
                  </div>
                </div>

                <div className="flex-row w3-row w3-section">
                  <a className="w3-clickable">
                    <i className="fa-plus fa fa-lg fa-fw w3-margin-right"/>
                    Add Answer
                  </a>
                </div>

                <button className="w3-btn-block w3-section w3-cyan w3-text-white w3-ripple w3-padding">
                  <i className='fa-share-square-o fa fa-lg fa-fw w3-margin-right'/>
                  Start New Poll
                </button>

              </form>
            </li>
          </ul>
        </main>
      </div>
    );
  }
}
 
Vote.propTypes = {
  features_show: PropTypes.string.isRequired,
  vote_poll: PropTypes.string.isRequired,
  vote_start: PropTypes.bool.isRequired,
  vote_list_open: PropTypes.bool.isRequired,
};
 
export default createContainer(() => {
  return {
    features_show: AppState.get('features_show'),
    vote_poll: AppState.get('vote_poll'),
    vote_start: AppState.get('vote_start'),
    vote_list_open: AppState.get('vote_list_open'),
  };
}, Vote);