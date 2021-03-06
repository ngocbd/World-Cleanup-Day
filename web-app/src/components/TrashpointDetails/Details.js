import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { If, Else } from 'react-if';
import 'moment/locale/en-ie';
import classnames from 'classnames';
import closeButton from '../../assets/closeButton.png';
import {
  Userpic,
  LocationIconEvent,
  TimeIcon,
  ShareIcon,
  ReportIcon,
} from '../common/Icons';
import StatusText from './StatusText';
import TrashpointDate from './TrashpointDate';
import TrashPhotos from './TrashPhotos';
import TpdetailsHeader from './Header'
import TrashAmount from './TrashAmount';
import { Loader } from '../Spinner';
import { noop } from '../../shared/helpers';
import ShareModal from '../ShareModal/ShareModal';
import './Details.css';

class Details extends Component {
  render() {
    const {
      marker: {
        name,
        address,
        status,
        createdAt,
        updatedAt,
        creator,
        updater,
        thumbnails,
        mediumPhotos,
        composition,
        origin,
        hashtags,
        amount,
        location,
      },
      actions,
      isOpened,
      toggleDetailsWindow,
      canEdit,
      trashpointId,
      isUserAllowedAdding,
      showShareModal,
      showHeader,
      history,
      trashTypes,
      trashOrigin,
      isShareModalVisible,
    } = this.props;
    const coordinates = location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : '';
    const formattedLocation = `${address} | ${coordinates}`;
    moment.locale('en-ie');
    return (
      <div className="Tpdetails">
        <If condition={isUserAllowedAdding}>
          <div
            onClick={() => { history.push('/trashpoints/create') }}
            className="Create-trashpoint"
          >
            <span>Place trashpoint</span>
          </div>
        </If>
        <If condition={!!trashpointId && showHeader}>
          <TpdetailsHeader
            tpTitle={name || "Loading..."}
            onMinimizeClick={() => history.push('/trashpoints')}
          />
        </If>
        <If condition={!!trashpointId}>
          <If condition={!!location}>
            <div className={ classnames('Tpdetails-plot', 'scrollbar-modified', { 'visible': isOpened })}>
              {
                isShareModalVisible &&
                <ShareModal
                  header="Share trashpoint"
                  url={`${window.location.origin}/trashpoints/${trashpointId}`}
                  title={`I just marked this trashpoint in ${ formattedLocation }. Check the details:`}
                  image={thumbnails && thumbnails[0] && thumbnails[0].url}
                />
              }
              <div className="Details-default-container">
                <div className="Details-address-container">
                  <div>
                    <LocationIconEvent />
                  </div>
                  <span className="Details-address">
                    {formattedLocation}
                  </span>
                </div>
              </div>
              <div className="Details-default-container Details-creation-info">
                <span className="Details-trash-type-title">
                  Type of trashpoint
                </span>
                <br /><br />
                <StatusText status={status} />
              </div>
              <div className="Details-default-container">
                <div
                  onClick={showShareModal}
                  className="Details-actions-share Details-width-45"
                >
                  <ShareIcon />
                  <span className="EventDetails-share">Share</span>
                </div>
              </div>
              {
                creator &&
                <div className="Details-default-container Details-creation-info">
                  <span className="Details-trash-type-title">About creator</span>
                  <p className="Details-creation-info-block">
                    <Userpic />
                    <span>{creator.name}</span>
                  </p>
                  <p className="Details-creation-info-block">
                    <TimeIcon />
                    <span>{moment(createdAt).format('L')}</span>
                  </p>
                </div>
              }
              {
                updater &&
                <div className="Details-default-container Details-creation-info">
                  <span className="Details-trash-type-title">Updates</span>
                  <p className="Details-creation-info-block">
                    <Userpic />
                    <span>{updater.name}</span>
                  </p>
                  <p className="Details-creation-info-block">
                    <TimeIcon />
                    <span>{moment(updatedAt).format('L')}</span>
                  </p>
                </div>
              }
              <div className="Details-default-container">
                <TrashAmount disabled amount={amount} />
              </div>
              <div className="Details-default-container">
                <span className="Details-trash-type-title">Trash type</span>
                <div className="Details-composition-tag-container">
                  {[...composition, ...hashtags].map((text, index) => {
                    const isHashtag = text.indexOf('#') === 0;
                    const label = isHashtag
                      ? text
                      : (trashTypes.find(t => t.type === text) || {})
                          .label;
                    if (!label) {
                      return null;
                    }
                    return (
                      <div className="Details-composition-tag" key={index}>
                        <span className="Tag-label">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {
                origin &&
                <div className="Details-default-container">
                  <span className="Details-trash-type-title">Trash origin</span>
                  <div className="Details-composition-tag-container">
                    {origin.map((text, index) => {
                      const label = (trashOrigin.find(t => t.type === text) || {}).label;
                      if (!label) {
                        return null;
                      }
                      return (
                        <div className="Details-composition-tag" key={index}>
                          <span className="Tag-label">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              }
              <div className="Details-default-container">
                <TrashPhotos photos={(thumbnails || []).map(thumbnail => ({
                    thumbnailUrl: thumbnail.url,
                    mediumPhotoUrl: mediumPhotos.find((mediumPhoto) => mediumPhoto.id === thumbnail.parentId).url,
                  }))}
              />
              </div>
              <div className="Details-filler" />
              <If condition={canEdit}>
                <div className="Details-default-container">
                  <div
                    className="CreateTrashpoint-edit-button"
                    onClick={
                      () => this.props.history.push(`/trashpoints/${trashpointId}/edit`)
                    }
                  >
                    <p>Update trashpoint</p>
                  </div>
                </div>
              </If>
            </div>
            <Else>
              <div className="Tpdetails-loader-container">
                <Loader />
              </div>
            </Else>
          </If>
        </If>
      </div>
    );
  }
}

Details.propTypes = {
  marker: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    status: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
    createdByName: PropTypes.string,
    updatedByName: PropTypes.string,
    thumbnails: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      }),
    ),
    composition: PropTypes.arrayOf(PropTypes.string),
    hashtags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  actions: PropTypes.shape({
    onCloseDetailsClick: PropTypes.func.isRequired,
    onEditTrashpointClick: PropTypes.func,
  }).isRequired,
  isOpened: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool,
  trashTypes: PropTypes.any.isRequired,
  trashOrigin: PropTypes.any.isRequired,
};

Details.defaultProps = {
  actions: {
    onEditTrashpointClick: noop,
  },
  canEdit: false,
};

export default Details;
