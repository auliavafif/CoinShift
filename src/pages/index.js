import React, { useEffect } from 'react'
import SwapCard from '../components/transfer/swap-card'
import RecentDeposits from '../components/transfer/recent-deposits'
import VolumeStats from '../components/transfer/volume-stats'
import Layout from '../components/common/layout'
import { css } from '@emotion/core'
import SEO from '../components/common/seo'
import { transferActions } from '../state/ducks/transfer'
import { authActions } from '../state/ducks/auth'
import { commonActions } from '../state/ducks/common'
import { Link } from 'gatsby'

import { connect } from 'react-redux'

const Index = ({
  fetchMethodsWatcher,
  initializeSessionWatcher,
  location,
  fetchRateWatcher,
  updateFetchRateStatus,
  fetchRecentDepositsWatcher,
  recentDeposits
}) => {
  const exchangeData = location.search
    ? JSON.parse(
        '{"' +
          decodeURI(location.search.substring(1))
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      )
    : null

  useEffect(() => {
    fetchMethodsWatcher()
    initializeSessionWatcher()
    return () => {
      fetchRateWatcher()
    }
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
      <div
        css={css`
          margin: 30px auto;
          max-width: 600px;
        `}
      >
        <SwapCard exchangeData={exchangeData} />
        <RecentDeposits></RecentDeposits>
        <VolumeStats></VolumeStats>
      </div>
    </Layout>
  )
}

const mapStateToProps = state => {
  return {
    depositMethods: state.transfer.depositMethods,
    settleMethods: state.transfer.settleMethods,
    auth: state.auth,
    isLoading: state.common?.isLoading,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMethodsWatcher: () => dispatch(transferActions.fetchMethodsWatcher()),
    initializeSessionWatcher: () =>
      dispatch(authActions.initializeSessionWatcher()),
    fetchRateWatcher: () => dispatch(transferActions.fetchRateWatcher()),
    updateFetchRateStatus: status =>
      dispatch(commonActions.updateFetchRateStatus(status)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
