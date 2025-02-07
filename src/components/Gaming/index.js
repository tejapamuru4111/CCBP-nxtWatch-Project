import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import Sidebar from '../Sidebar'

import nxtWatchContext from '../../context/nxtWatchContext'

import {
  BannerContainer,
  HomeBgContainer,
  HomeContainer,
  ThumbnailsBgContainer,
  LoaderContainer,
  HomeVideosListContainer,
  FailureContainer,
  FailureImage,
  FailureHeading,
  FailurePara,
  FailureButton,
  VideoListItem,
  ThumbnailImage,
  VideoDetailsContainer,
  VideoTitleEtcContainer,
  TitlePara,
  CommonParaTag,
  BannerHeading,
  TrendingIconContainer,
  TrendingIcon,
} from './gamingStyles'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Gaming extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    videosList: [],
  }

  componentDidMount() {
    this.getTrendingVideos()
  }

  getTrendingVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/videos/gaming'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updatedVideosList = data.videos.map(eachVid => ({
        id: eachVid.id,
        thumbnailUrl: eachVid.thumbnail_url,
        title: eachVid.title,
        viewCount: eachVid.view_count,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        videosList: updatedVideosList,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetryingVideos = () => {
    this.getTrendingVideos()
  }

  renderLoader = theme => (
    <LoaderContainer data-testid="loader">
      <Loader
        type="ThreeDots"
        color={theme ? '#ffffff' : ' #181818'}
        height="50"
        width="50"
      />
    </LoaderContainer>
  )

  renderFailureView = theme => (
    <FailureContainer>
      <FailureImage
        src={
          theme
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'
        }
        alt="failure view"
      />
      <FailureHeading dark={theme}>Oops! Something Went Wrong</FailureHeading>
      <FailurePara>
        We are having some trouble to complete your request. Please try again.
      </FailurePara>
      <FailureButton type="button" onClick={this.onRetryingVideos}>
        Retry
      </FailureButton>
    </FailureContainer>
  )

  renderSuccessView = theme => {
    const {videosList} = this.state

    return (
      <>
        <BannerContainer data-testid="banner" dark={theme}>
          <TrendingIconContainer dark={theme}>
            <TrendingIcon />
          </TrendingIconContainer>
          <BannerHeading dark={theme}>Gaming</BannerHeading>
        </BannerContainer>
        <HomeVideosListContainer>
          {videosList.map(eachVideo => (
            <VideoListItem key={eachVideo.id}>
              <Link
                to={`/videos/${eachVideo.id}`}
                style={{textDecoration: 'none'}}
              >
                <ThumbnailImage
                  src={eachVideo.thumbnailUrl}
                  alt="video thumbnail"
                />
                <VideoDetailsContainer>
                  <VideoTitleEtcContainer>
                    <TitlePara dark={theme}>{eachVideo.title}</TitlePara>

                    <CommonParaTag>
                      {eachVideo.viewCount} Watching Worldwide
                    </CommonParaTag>
                  </VideoTitleEtcContainer>
                </VideoDetailsContainer>
              </Link>
            </VideoListItem>
          ))}
        </HomeVideosListContainer>
      </>
    )
  }

  renderFinalOutput = themeType => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader(themeType)
      case apiStatusConstants.success:
        return this.renderSuccessView(themeType)
      case apiStatusConstants.failure:
        return this.renderFailureView(themeType)
      default:
        return null
    }
  }

  render() {
    return (
      <nxtWatchContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          return (
            <>
              <Header />
              <HomeBgContainer dark={isDarkTheme} data-testid="gaming">
                <Sidebar />
                <HomeContainer>
                  <ThumbnailsBgContainer>
                    {this.renderFinalOutput(isDarkTheme)}
                  </ThumbnailsBgContainer>
                </HomeContainer>
              </HomeBgContainer>
            </>
          )
        }}
      </nxtWatchContext.Consumer>
    )
  }
}

export default Gaming
