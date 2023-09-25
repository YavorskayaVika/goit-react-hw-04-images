import { StyledApp } from 'App.styled';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { Loader } from './components/Loader/Loader';
import { Button } from './components/Button/Button';
import React, { Component } from 'react';
import { getGallery } from './Pixabay/PixabayAPI';
import Searchbar from './components/Searchbar/Searchbar';
import Modal from './components/Modal/Modal';

export  class App extends Component {
  state = {
    loading: false,
    gallery: [],
    isOpen: false,
    page: 1,
    per_page: 12,
    q: '',
    currentImg: null,
    error: null,
    maxImg: 0,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const { page, per_page, q } = this.state;
      await getGallery(page, per_page, q);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }
  async componentDidUpdate(_, prevState) {
    const { page, per_page, q } = this.state;

    if (prevState.page !== page || prevState.q !== q) {
      this.setState({ loading: true });
      try {
        const { hits, totalHits } = await getGallery({ page, per_page, q });
        const maxImg = Math.ceil(totalHits / per_page);
        this.setState(prev => ({
          gallery: [...prev.gallery, ...hits],
          maxImg,
        }));
      } catch (error) {
        this.setState({ error: error });
      } finally {
        this.setState({ loading: false });
      }
    }
  }
  onLoadMore = () => {     
      this.setState(prev => ({ page: prev.page + 1 }));
    }
  
  handleOpenModal = img => {
    this.setState(prev => ({ isOpen: !prev.isOpen, currentImg: img }));
  };
  handleChangeQuery = str => {
    this.setState({ q: str, gallery: [], page: 1 });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  render() {
    const { loading, isOpen, gallery, currentImg, error, q, maxImg, page } =
      this.state;
    return (
      <>
        <StyledApp>
          <Searchbar onChangeQuery={this.handleChangeQuery} />

          {loading && !gallery.length ? (
            <Loader />
          ) : (
            <ImageGallery
              data={gallery}
              handleOpenModal={this.handleOpenModal}
            />
          )}
          {error && <h2>Something went wrong</h2>}
          {!gallery.length && q && !loading && (
            <h2>I didn't find anything, try again</h2>
          )}
          {isOpen && <Modal close={this.closeModal} currentImg={currentImg} />}
        </StyledApp>
        {gallery.length > 0 && page < maxImg && (
          <Button title="Load More" onLoadMore={this.onLoadMore} />
        )}
      </>
    );
  }
}